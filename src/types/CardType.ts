export enum CardType {
  Common = 0,
  Rare = 1,
  Epic = 2,
  Legendary = 3,
  Mythic = 4,
}

/** Human-readable labels for each card type */
export const CardTypeLabel: Record<CardType, string> = {
  [CardType.Common]: 'Common',
  [CardType.Rare]: 'Rare',
  [CardType.Epic]: 'Epic',
  [CardType.Legendary]: 'Legendary',
  [CardType.Mythic]: 'Mythic',
};

/** Embed colors for each card type */
export const CardTypeColor: Record<CardType, number> = {
  [CardType.Common]: 0x808080,    // Gray
  [CardType.Rare]: 0x0070dd,      // Blue
  [CardType.Epic]: 0xa335ee,      // Purple
  [CardType.Legendary]: 0xff8000, // Orange
  [CardType.Mythic]: 0xc45039,    // Red
};
