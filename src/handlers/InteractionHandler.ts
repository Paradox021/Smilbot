import { Interaction, Client } from 'discord.js';
import { handleCardInteraction } from './CardInteractions';
import { handleMarketInteraction } from './MarketInteractions';

/**
 * Main interaction handler that routes to specific handlers
 * @param interaction Discord interaction
 * @param client Discord client
 */
export async function handleInteraction(
  interaction: Interaction,
  client: Client
): Promise<void> {
  try {
    // Try card interactions first
    if (interaction.isButton()) {
      const handled = await handleCardInteraction(interaction, client);
      if (handled) return;
    }

    // Try market interactions (handles both buttons and select menus)
    const marketHandled = await handleMarketInteraction(interaction, client);
    if (marketHandled) return;

    // Add more handlers here as needed...

  } catch (error) {
    console.error('Error handling interaction:');

    // Try to respond with an error message
    try {
      if (interaction.isRepliable()) {
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: 'An error occurred while processing your request.',
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: 'An error occurred while processing your request.',
            ephemeral: true,
          });
        }
      }
    } catch {
      // Silently fail if we can't respond
    }
  }
}

export { handleCardInteraction } from './CardInteractions';
export { handleMarketInteraction } from './MarketInteractions';
