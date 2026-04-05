import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from 'discord.js';
import { PaginationState, createPaginationButtons, getPageItems } from '@/components/pagination';
import { MarketOffer } from '@/services/marketService';

/**
 * Button and select menu custom ID prefixes for market
 */
export const MARKET_BUTTON_PREFIXES = {
  MARKET: 'market',
  SELECT: 'marketSelect',
  BUY: 'marketBuy',
} as const;

/**
 * Creates the "Open Market" button that triggers the market viewer
 * @returns ActionRowBuilder with the button
 */
export function createOpenMarketButton(): ActionRowBuilder<ButtonBuilder> {
  const button = new ButtonBuilder()
    .setCustomId('openMarket')
    .setLabel('🛒 Open Market')
    .setStyle(ButtonStyle.Primary);

  return new ActionRowBuilder<ButtonBuilder>().addComponents(button);
}

/**
 * Creates the select menu for choosing an offer from the current page
 * @param offers All offers
 * @param state Pagination state
 * @param serverId Server ID for context
 * @returns ActionRowBuilder with select menu
 */
export function createMarketSelectMenu(
  offers: MarketOffer[],
  state: PaginationState,
  serverId: string
): ActionRowBuilder<StringSelectMenuBuilder> {
  const pageOffers = getPageItems(offers, state);

  const select = new StringSelectMenuBuilder()
    .setCustomId(`${MARKET_BUTTON_PREFIXES.SELECT}_${serverId}_${state.currentPage}`)
    .setPlaceholder('Select an offer to purchase...')
    .setMinValues(1)
    .setMaxValues(1);

  // Add options for each offer on this page
  for (let i = 0; i < pageOffers.length; i++) {
    const offer = pageOffers[i];
    const globalIndex = state.currentPage * state.itemsPerPage + i + 1;

    select.addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel(`#${globalIndex} - ${offer.cardId.name}`)
        .setDescription(`${offer.price} coins from @${offer.seller.username}`)
        .setValue(offer._id) // Store the offer _id as the value
    );
  }

  // If no offers on page, add a disabled placeholder
  if (pageOffers.length === 0) {
    select.addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel('No offers available')
        .setDescription('Check back later')
        .setValue('none')
    );
    select.setDisabled(true);
  }

  return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);
}

/**
 * Creates the buy button for the selected offer
 * @param selectedOfferId The _id of the selected offer (null if none selected)
 * @param serverId Server ID for context
 * @returns ActionRowBuilder with buy button
 */
export function createMarketBuyButton(
  selectedOfferId: string | null,
  serverId: string
): ActionRowBuilder<ButtonBuilder> {
  const button = new ButtonBuilder()
    .setCustomId(
      selectedOfferId
        ? `${MARKET_BUTTON_PREFIXES.BUY}_${serverId}_${selectedOfferId}`
        : `${MARKET_BUTTON_PREFIXES.BUY}_none`
    )
    .setLabel('💰 Buy Selected Card')
    .setStyle(ButtonStyle.Success)
    .setDisabled(!selectedOfferId);

  return new ActionRowBuilder<ButtonBuilder>().addComponents(button);
}

/**
 * Creates all market components (embed buttons + select menu + buy button)
 * @param offers All offers
 * @param state Pagination state
 * @param serverId Server ID
 * @param selectedOfferId Currently selected offer ID (null if none)
 * @returns Array of ActionRowBuilder
 */
export function createMarketComponents(
  offers: MarketOffer[],
  state: PaginationState,
  serverId: string,
  selectedOfferId: string | null = null
): ActionRowBuilder<ButtonBuilder | StringSelectMenuBuilder>[] {
  const components: ActionRowBuilder<ButtonBuilder | StringSelectMenuBuilder>[] = [];

  // Select menu (if there are offers)
  if (offers.length > 0) {
    components.push(createMarketSelectMenu(offers, state, serverId));
  }

  // Buy button
  components.push(createMarketBuyButton(selectedOfferId, serverId));

  // Pagination buttons (only if more than one page)
  if (state.totalPages > 1) {
    const paginationRow = createPaginationButtons(state, {
      customIdPrefix: `${MARKET_BUTTON_PREFIXES.MARKET}_page`,
      contextData: serverId,
      includeFirstLast: false, // Keep market pagination simpler
    });
    components.push(paginationRow);
  }

  return components;
}

/**
 * Parses a market button/select custom ID
 * @param customId Button or select menu custom ID
 * @returns Parsed data or null
 */
export function parseMarketCustomId(customId: string): {
  type: 'page' | 'select' | 'buy';
  serverId?: string;
  offerId?: string;
  page?: number;
} | null {
  const parts = customId.split('_');

  if (parts[0] === MARKET_BUTTON_PREFIXES.SELECT) {
    // marketSelect_serverId_page
    return {
      type: 'select',
      serverId: parts[1],
      page: parts[2] ? parseInt(parts[2], 10) : 0,
    };
  }

  if (parts[0] === MARKET_BUTTON_PREFIXES.BUY) {
    // marketBuy_serverId_offerId
    if (parts[1] === 'none') return null;
    return {
      type: 'buy',
      serverId: parts[1],
      offerId: parts[2],
    };
  }

  if (customId.startsWith(`${MARKET_BUTTON_PREFIXES.MARKET}_page`)) {
    // market_page_action_targetPage_serverId
    return {
      type: 'page',
      serverId: parts[4],
      page: parseInt(parts[3], 10),
    };
  }

  return null;
}
