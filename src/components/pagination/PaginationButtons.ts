import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js';
import { PaginationState, hasNextPage, hasPreviousPage } from './PaginationState';

/**
 * Configuration for pagination buttons
 */
export interface PaginationButtonConfig {
  /** Prefix for the button custom IDs */
  customIdPrefix: string;
  /** Additional data to include in custom ID (e.g., userId) */
  contextData?: string;
  /** Whether to include First/Last buttons (default: true) */
  includeFirstLast?: boolean;
  /** Labels for the buttons */
  labels?: {
    first?: string;
    previous?: string;
    next?: string;
    last?: string;
  };
}

const DEFAULT_LABELS = {
  first: '⏮️',
  previous: '◀️',
  next: '▶️',
  last: '⏭️',
};

/**
 * Builds the custom ID string for a pagination button
 */
function buildCustomId(
  prefix: string,
  action: string,
  page: number,
  contextData?: string
): string {
  const parts = [prefix, action, page.toString()];
  if (contextData) {
    parts.push(contextData);
  }
  return parts.join('_');
}

/**
 * Creates pagination navigation buttons
 * @param state Current pagination state
 * @param config Button configuration
 * @returns ActionRowBuilder with navigation buttons
 */
export function createPaginationButtons(
  state: PaginationState,
  config: PaginationButtonConfig
): ActionRowBuilder<ButtonBuilder> {
  const labels = { ...DEFAULT_LABELS, ...config.labels };
  const includeFirstLast = config.includeFirstLast ?? true;
  const row = new ActionRowBuilder<ButtonBuilder>();

  // First button
  if (includeFirstLast) {
    const firstButton = new ButtonBuilder()
      .setCustomId(buildCustomId(config.customIdPrefix, 'first', 0, config.contextData))
      .setLabel(labels.first)
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(!hasPreviousPage(state));
    row.addComponents(firstButton);
  }

  // Previous button
  const previousButton = new ButtonBuilder()
    .setCustomId(
      buildCustomId(config.customIdPrefix, 'prev', state.currentPage - 1, config.contextData)
    )
    .setLabel(labels.previous)
    .setStyle(ButtonStyle.Primary)
    .setDisabled(!hasPreviousPage(state));
  row.addComponents(previousButton);

  // Next button
  const nextButton = new ButtonBuilder()
    .setCustomId(
      buildCustomId(config.customIdPrefix, 'next', state.currentPage + 1, config.contextData)
    )
    .setLabel(labels.next)
    .setStyle(ButtonStyle.Primary)
    .setDisabled(!hasNextPage(state));
  row.addComponents(nextButton);

  // Last button
  if (includeFirstLast) {
    const lastButton = new ButtonBuilder()
      .setCustomId(
        buildCustomId(config.customIdPrefix, 'last', state.totalPages - 1, config.contextData)
      )
      .setLabel(labels.last)
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(!hasNextPage(state));
    row.addComponents(lastButton);
  }

  return row;
}

/**
 * Parses a pagination button custom ID
 * @param customId The button's custom ID
 * @returns Parsed data or null if not a pagination button
 */
export function parsePaginationCustomId(customId: string): {
  prefix: string;
  action: 'first' | 'prev' | 'next' | 'last';
  targetPage: number;
  contextData?: string;
} | null {
  const parts = customId.split('_');
  if (parts.length < 3) return null;

  const [prefix, action, pageStr, ...contextParts] = parts;
  const validActions = ['first', 'prev', 'next', 'last'];

  if (!validActions.includes(action)) return null;

  return {
    prefix,
    action: action as 'first' | 'prev' | 'next' | 'last',
    targetPage: parseInt(pageStr, 10),
    contextData: contextParts.length > 0 ? contextParts.join('_') : undefined,
  };
}
