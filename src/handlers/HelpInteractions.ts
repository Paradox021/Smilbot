import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Client, StringSelectMenuBuilder, MessageComponentInteraction } from 'discord.js';
import { Command } from '@/types/Command';
import { CommandCategory } from '@/types/CommandCategory';

export const COMMANDS_PER_PAGE = 5;

/**
 * Generates an embed for a specific page of commands
 */
export function generateHelpEmbed(commands: Command[], categoryName: string, page: number): EmbedBuilder {
  const totalPages = Math.ceil(commands.length / COMMANDS_PER_PAGE) || 1;
  const start = (page - 1) * COMMANDS_PER_PAGE;
  const pageCommands = commands.slice(start, start + COMMANDS_PER_PAGE);

  const embed = new EmbedBuilder()
    .setTitle(`Help: ${categoryName}`)
    .setColor(0x00569D)
    .setFooter({ text: `Page ${page} of ${totalPages}` })
    .setTimestamp();

  if (pageCommands.length === 0) {
    embed.setDescription('No commands found.');
    return embed;
  }

  for (const cmd of pageCommands) {
    const aliases = cmd.aliases && cmd.aliases.length > 0 ? `\n*Aliases: ${cmd.aliases.join(', ')}*` : '';
    embed.addFields({ name: `.${cmd.name}`, value: `${cmd.description}${aliases}` });
  }

  return embed;
}

/**
 * Creates pagination buttons for help
 */
export function createHelpButtons(category: string, page: number, totalPages: number): ActionRowBuilder<ButtonBuilder> {
  const row = new ActionRowBuilder<ButtonBuilder>();

  const prevButton = new ButtonBuilder()
    .setCustomId(`help_prev_${category}_${page - 1}`)
    .setLabel('Previous')
    .setStyle(ButtonStyle.Primary)
    .setDisabled(page <= 1);

  const nextButton = new ButtonBuilder()
    .setCustomId(`help_next_${category}_${page + 1}`)
    .setLabel('Next')
    .setStyle(ButtonStyle.Primary)
    .setDisabled(page >= totalPages);

  row.addComponents(prevButton, nextButton);
  return row;
}

export function createCategorySelectMenu(currentCategory: string): ActionRowBuilder<StringSelectMenuBuilder> {
  const row = new ActionRowBuilder<StringSelectMenuBuilder>();

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('help_category_select')
    .setPlaceholder('Select a category...')
    .addOptions([
      {
        label: 'All Commands',
        value: 'All',
        description: 'Show all available commands',
        default: currentCategory === 'All'
      },
      ...Object.values(CommandCategory).map(category => ({
        label: category,
        value: category,
        description: `Show options for ${category}`,
        default: currentCategory === category
      }))
    ]);

  row.addComponents(selectMenu);
  return row;
}

/**
 * Handle button interactions for help pagination
 */
export async function handleHelpInteraction(interaction: MessageComponentInteraction, client: Client): Promise<boolean> {
  const customId = interaction.customId;

  if (!customId.startsWith('help_prev_') && !customId.startsWith('help_next_') && customId !== 'help_category_select') {
    return false;
  }

  await interaction.deferUpdate();
  
  const { commandList } = await import('@/commands');

  let category = 'All';
  let targetPage = 1;

  if (interaction.isStringSelectMenu() && customId === 'help_category_select') {
    category = interaction.values[0];
    targetPage = 1;
  } else if (interaction.isButton()) {
    // customId format: help_next_CategoryName_page
    const parts = customId.split('_');
    category = parts[2];
    targetPage = parseInt(parts[3], 10);
  }

  let filteredCommands = commandList;
  let categoryName = 'All Commands';

  if (category !== 'All') {
    filteredCommands = commandList.filter((cmd: Command) => cmd.categories?.includes(category as CommandCategory));
    categoryName = category;
  }

  const totalPages = Math.ceil(filteredCommands.length / COMMANDS_PER_PAGE) || 1;
  const page = Math.max(1, Math.min(targetPage, totalPages));

  const embed = generateHelpEmbed(filteredCommands, categoryName, page);
  
  const components = [];
  components.push(createCategorySelectMenu(category));
  
  if (totalPages > 1) {
    components.push(createHelpButtons(category, page, totalPages));
  }

  await interaction.editReply({
    embeds: [embed],
    components: components
  });

  return true;
}
