import { ButtonInteraction, Client, MessageFlags } from 'discord.js';
import { userService } from '@/services/userService';
import { cardService, Card } from '@/services/cardService';
import {
  createCardListEmbed,
  createCardDetailedEmbed,
  createTextEmbed,
  CardWithCount,
} from '@/components/embeds';
import {
  createCardListButtons,
  createCardDetailedButtons,
  CARD_BUTTON_PREFIXES,
} from '@/components/buttons';
import { createPaginationState, goToPage } from '@/components/pagination';

const ITEMS_PER_PAGE = 10;

/**
 * Fetches cards based on whether it's all cards or user-specific
 */
async function fetchCards(
  isAllCards: boolean,
  userId?: string
): Promise<{ cards: CardWithCount[]; title: string }> {
  if (isAllCards) {
    const cards = await cardService.getAllCards();
    return { cards, title: 'All Cards' };
  }

  if (!userId) {
    return { cards: [], title: 'Cards' };
  }

  const userData = await userService.getMyCards(userId);
  if (!userData || !userData.cards || userData.cards.length === 0) {
    return { cards: [], title: 'Cards' };
  }

  return {
    cards: userData.cards as CardWithCount[],
    title: `${userData.username}'s Cards`,
  };
}

/**
 * Handles opening cards (initial button click)
 */
export async function handleOpenCards(
  interaction: ButtonInteraction,
  client: Client
): Promise<void> {
  const customId = interaction.customId;
  const isAllCards = customId === 'openAllCards';

  let userId: string | undefined;
  if (!isAllCards && customId.startsWith('openCards_')) {
    userId = customId.split('_')[1];
  }

  const { cards, title } = await fetchCards(isAllCards, userId);

  if (cards.length === 0) {
    await interaction.reply({
      embeds: [createTextEmbed(0x00569d, isAllCards ? 'No cards exist yet.' : 'This user has no cards.')],
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  const state = createPaginationState(cards, ITEMS_PER_PAGE);
  const embed = createCardListEmbed(cards, title, state);
  const buttons = createCardListButtons(state, userId, isAllCards);

  await interaction.reply({
    embeds: [embed],
    components: buttons,
    flags: MessageFlags.Ephemeral,
  });
}

/**
 * Handles switching from list to detailed view
 */
export async function handleToDetailedView(
  interaction: ButtonInteraction,
  prefix: string,
  params: string[]
): Promise<void> {
  const isAllCards = prefix === CARD_BUTTON_PREFIXES.ALL_CARDS;
  const page = parseInt(params[0], 10) || 0;
  const userId = params[1] || undefined;

  const { cards, title } = await fetchCards(isAllCards, userId);

  if (cards.length === 0) {
    await interaction.update({
      embeds: [createTextEmbed(0xff0000, 'No cards found.')],
      components: [],
    });
    return;
  }

  // Calculate which card to show based on the current page
  const position = page * ITEMS_PER_PAGE;
  const clampedPosition = Math.min(position, cards.length - 1);

  const embed = createCardDetailedEmbed(cards, clampedPosition);
  const buttons = createCardDetailedButtons(cards.length, clampedPosition, userId, isAllCards);

  await interaction.update({
    embeds: [embed],
    components: buttons,
  });
}

/**
 * Handles switching from detailed to list view
 */
export async function handleToListView(
  interaction: ButtonInteraction,
  prefix: string,
  params: string[]
): Promise<void> {
  const isAllCards = prefix === CARD_BUTTON_PREFIXES.ALL_CARDS;
  const currentPosition = parseInt(params[0], 10) || 0;
  const userId = params[1] || undefined;

  const { cards, title } = await fetchCards(isAllCards, userId);

  if (cards.length === 0) {
    await interaction.update({
      embeds: [createTextEmbed(0xff0000, 'No cards found.')],
      components: [],
    });
    return;
  }

  // Calculate which page to show based on the current card position
  const page = Math.floor(currentPosition / ITEMS_PER_PAGE);
  const state = goToPage(createPaginationState(cards, ITEMS_PER_PAGE), page);

  const embed = createCardListEmbed(cards, title, state);
  const buttons = createCardListButtons(state, userId, isAllCards);

  await interaction.update({
    embeds: [embed],
    components: buttons,
  });
}

/**
 * Handles navigation in detailed view (first, prev, next, last)
 */
export async function handleDetailedNavigation(
  interaction: ButtonInteraction,
  prefix: string,
  params: string[]
): Promise<void> {
  const isAllCards = prefix === CARD_BUTTON_PREFIXES.ALL_CARDS;
  const [action, positionStr, ...contextParts] = params;
  const userId = contextParts[0] || undefined;

  const { cards, title } = await fetchCards(isAllCards, userId);

  if (cards.length === 0) {
    await interaction.update({
      embeds: [createTextEmbed(0xff0000, 'No cards found.')],
      components: [],
    });
    return;
  }

  let newPosition: number;
  switch (action) {
    case 'first':
      newPosition = 0;
      break;
    case 'last':
      newPosition = cards.length - 1;
      break;
    case 'prev':
    case 'next':
    default:
      newPosition = parseInt(positionStr, 10) || 0;
      break;
  }

  // Clamp position to valid range
  newPosition = Math.max(0, Math.min(newPosition, cards.length - 1));

  const embed = createCardDetailedEmbed(cards, newPosition);
  const buttons = createCardDetailedButtons(cards.length, newPosition, userId, isAllCards);

  await interaction.update({
    embeds: [embed],
    components: buttons,
  });
}

/**
 * Handles list pagination
 */
export async function handleListPagination(
  interaction: ButtonInteraction,
  prefix: string,
  params: string[]
): Promise<void> {
  const isAllCards = prefix === CARD_BUTTON_PREFIXES.ALL_CARDS;
  // params format: [action, targetPage, contextData]
  const [action, targetPageStr, ...contextParts] = params;
  const userId = contextParts[0] || undefined;
  const targetPage = parseInt(targetPageStr, 10) || 0;

  const { cards, title } = await fetchCards(isAllCards, userId);

  if (cards.length === 0) {
    await interaction.update({
      embeds: [createTextEmbed(0xff0000, 'No cards found.')],
      components: [],
    });
    return;
  }

  const state = goToPage(createPaginationState(cards, ITEMS_PER_PAGE), targetPage);
  const embed = createCardListEmbed(cards, title, state);
  const buttons = createCardListButtons(state, userId, isAllCards);

  await interaction.update({
    embeds: [embed],
    components: buttons,
  });
}

/**
 * Main router for card interactions
 */
export async function handleCardInteraction(
  interaction: ButtonInteraction,
  client: Client
): Promise<boolean> {
  const customId = interaction.customId;

  // Handle open buttons
  if (customId.startsWith('openCards_') || customId === 'openAllCards') {
    await handleOpenCards(interaction, client);
    return true;
  }

  // Parse card button custom ID
  const parts = customId.split('_');
  const prefix = parts[0];

  if (prefix !== CARD_BUTTON_PREFIXES.USER_CARDS && prefix !== CARD_BUTTON_PREFIXES.ALL_CARDS) {
    return false;
  }

  const action = parts[1];
  const params = parts.slice(2);

  switch (action) {
    case 'toDetailed':
      await handleToDetailedView(interaction, prefix, params);
      return true;
    case 'toList':
      await handleToListView(interaction, prefix, params);
      return true;
    case 'detailedNav':
      await handleDetailedNavigation(interaction, prefix, params);
      return true;
    case 'page':
      await handleListPagination(interaction, prefix, params);
      return true;
    default:
      return false;
  }
}
