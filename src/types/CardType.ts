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
