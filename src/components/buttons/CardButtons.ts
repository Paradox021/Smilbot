import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js';
import {
  PaginationState,
  createPaginationButtons,
  hasNextPage,
  hasPreviousPage,
} from '@/components/pagination';

/**
 * View modes for card display
 */
export type CardViewMode = 'list' | 'detailed';

/**
 * Button custom ID prefixes for cards
 */
export const CARD_BUTTON_PREFIXES = {
  USER_CARDS: 'userCards',
  ALL_CARDS: 'allCards',
} as const;

/**
 * Creates the "Open Cards" button that triggers the card viewer
 * @param userId Discord user ID to show cards for
 * @param label Button label
 * @returns ActionRowBuilder with the button
 */
export function createOpenCardsButton(
  userId: string,
  label: string = 'Show my cards'
): ActionRowBuilder<ButtonBuilder> {
  const button = new ButtonBuilder()
    .setCustomId(`openCards_${userId}`)
    .setLabel(label)
    .setStyle(ButtonStyle.Primary);

  return new ActionRowBuilder<ButtonBuilder>().addComponents(button);
}

/**
 * Creates the "Open Other User's Cards" button
 * @param userId Discord user ID to show cards for
 * @param username Username to display
 * @returns ActionRowBuilder with the button
 */
export function createOpenOtherCardsButton(
  userId: string,
  username: string
): ActionRowBuilder<ButtonBuilder> {
  const button = new ButtonBuilder()
    .setCustomId(`openCards_${userId}`)
    .setLabel(`Show ${username}'s cards`)
    .setStyle(ButtonStyle.Primary);

  return new ActionRowBuilder<ButtonBuilder>().addComponents(button);
}

/**
 * Creates the "Open All Cards" button
 * @returns ActionRowBuilder with the button
 */
export function createOpenAllCardsButton(): ActionRowBuilder<ButtonBuilder> {
  const button = new ButtonBuilder()
    .setCustomId('openAllCards')
    .setLabel('Show all cards')
    .setStyle(ButtonStyle.Primary);

  return new ActionRowBuilder<ButtonBuilder>().addComponents(button);
}

/**
 * Creates buttons for card list view (with pagination and view toggle)
 * @param state Pagination state
 * @param userId User ID (for user-specific cards)
 * @param isAllCards Whether showing all cards or user cards
 * @returns Array of ActionRowBuilder
 */
export function createCardListButtons(
  state: PaginationState,
  userId?: string,
  isAllCards: boolean = false
): ActionRowBuilder<ButtonBuilder>[] {
  const rows: ActionRowBuilder<ButtonBuilder>[] = [];
  const prefix = isAllCards ? CARD_BUTTON_PREFIXES.ALL_CARDS : CARD_BUTTON_PREFIXES.USER_CARDS;
  const contextData = userId || '';

  // Toggle view button
  const toggleButton = new ButtonBuilder()
    .setCustomId(`${prefix}_toDetailed_${state.currentPage}_${contextData}`)
    .setLabel('🔍 Detailed View')
    .setStyle(ButtonStyle.Secondary);

  const toggleRow = new ActionRowBuilder<ButtonBuilder>().addComponents(toggleButton);
  rows.push(toggleRow);

  // Pagination buttons (only if more than one page)
  if (state.totalPages > 1) {
    const paginationRow = createPaginationButtons(state, {
      customIdPrefix: `${prefix}_page`,
      contextData,
      includeFirstLast: true,
    });
    rows.push(paginationRow);
  }

  return rows;
}

/**
 * Creates buttons for card detailed view (with navigation and view toggle)
 * @param totalCards Total number of cards
 * @param currentPosition Current card index (0-based)
 * @param userId User ID (for user-specific cards)
 * @param isAllCards Whether showing all cards or user cards
 * @returns Array of ActionRowBuilder
 */
export function createCardDetailedButtons(
  totalCards: number,
  currentPosition: number,
  userId?: string,
  isAllCards: boolean = false
): ActionRowBuilder<ButtonBuilder>[] {
  const prefix = isAllCards ? CARD_BUTTON_PREFIXES.ALL_CARDS : CARD_BUTTON_PREFIXES.USER_CARDS;
  const contextData = userId || '';
  const isFirst = currentPosition === 0;
  const isLast = currentPosition === totalCards - 1;

  // Navigation row
  const navigationRow = new ActionRowBuilder<ButtonBuilder>();

  // First button
  navigationRow.addComponents(
    new ButtonBuilder()
      .setCustomId(`${prefix}_detailedNav_first_0_${contextData}`)
      .setLabel('⏮️')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(isFirst)
  );

  // Previous button
  navigationRow.addComponents(
    new ButtonBuilder()
      .setCustomId(`${prefix}_detailedNav_prev_${currentPosition - 1}_${contextData}`)
      .setLabel('◀️')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(isFirst)
  );

  // Toggle to list view
  navigationRow.addComponents(
    new ButtonBuilder()
      .setCustomId(`${prefix}_toList_${currentPosition}_${contextData}`)
      .setLabel('📋 List View')
      .setStyle(ButtonStyle.Secondary)
  );

  // Next button
  navigationRow.addComponents(
    new ButtonBuilder()
      .setCustomId(`${prefix}_detailedNav_next_${currentPosition + 1}_${contextData}`)
      .setLabel('▶️')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(isLast)
  );

  // Last button
  navigationRow.addComponents(
    new ButtonBuilder()
      .setCustomId(`${prefix}_detailedNav_last_${totalCards - 1}_${contextData}`)
      .setLabel('⏭️')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(isLast)
  );

  return [navigationRow];
}

/**
 * Parses a card button custom ID
 * @param customId Button custom ID
 * @returns Parsed data or null
 */
export function parseCardButtonCustomId(customId: string): {
  prefix: string;
  action: string;
  params: string[];
} | null {
  const parts = customId.split('_');
  if (parts.length < 2) return null;

  const [prefix, action, ...params] = parts;

  if (prefix !== CARD_BUTTON_PREFIXES.USER_CARDS && prefix !== CARD_BUTTON_PREFIXES.ALL_CARDS) {
    return null;
  }

  return { prefix, action, params };
}
