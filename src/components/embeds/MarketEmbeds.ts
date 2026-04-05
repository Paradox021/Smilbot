import { EmbedBuilder } from 'discord.js';
import { PaginationState, getPageItems } from '@/components/pagination';
import { MarketOffer } from '@/services/marketService';



/**
 * Creates an embed showing market offers with pagination
 * @param offers Array of market offers
 * @param state Pagination state
 * @returns EmbedBuilder
 */
export function createMarketListEmbed(
  offers: MarketOffer[],
  state: PaginationState
): EmbedBuilder {
  const pageOffers = getPageItems(offers, state);

  const embed = new EmbedBuilder()
    .setColor(0x00569d)
    .setTitle('🛒 Market')
    .setDescription('Select an offer from the dropdown below to purchase')
    .setFooter({
      text: `Page ${state.currentPage + 1} of ${state.totalPages} • ${offers.length} total offers`,
    })
    .setTimestamp();

  // Add fields for each offer on this page
  for (let i = 0; i < pageOffers.length; i++) {
    const offer = pageOffers[i];
    const globalIndex = state.currentPage * state.itemsPerPage + i + 1;

    embed.addFields({
      name: `#${globalIndex} - ${offer.cardId.name}`,
      value: `**Seller:** @${offer.seller.username}\n**Price:** ${offer.price} coins`,
      inline: true,
    });
  }

  // If no offers, show message
  if (pageOffers.length === 0) {
    embed.setDescription('No offers available in this market.');
  }

  return embed;
}

/**
 * Creates an embed for when the market is empty
 * @returns EmbedBuilder
 */
export function createEmptyMarketEmbed(): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0x00569d)
    .setTitle('🛒 Market')
    .setDescription('The market is empty. Be the first to sell a card!')
    .setTimestamp();
}

/**
 * Creates a confirmation embed for a purchase
 * @param offer The offer being purchased
 * @param success Whether the purchase was successful
 * @param message Additional message
 * @returns EmbedBuilder
 */
export function createPurchaseResultEmbed(
  offer: MarketOffer | null,
  success: boolean,
  message: string
): EmbedBuilder {
  const color = success ? 0x00ff00 : 0xff0000;
  const title = success ? '✅ Purchase Successful' : '❌ Purchase Failed';

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(message)
    .setTimestamp();

  if (offer && success) {
    embed.addFields({
      name: 'Card Purchased',
      value: `**${offer.cardId.name}** for ${offer.price} coins`,
    });
  }

  return embed;
}
