import { AxiosInstance } from 'axios';
import { api } from './api';
import { Card } from './cardService';

/**
 * Market offer interface
 */
export interface MarketOffer {
  _id: string;
  seller: {
    discordId: string;
    username: string;
  };
  cardId: Card;
  price: number;
  serverId: string;
}

/**
 * Parameters for buying an offer
 */
export interface BuyOfferParams {
  serverId: string;
  offerId: string;
  buyerDiscordId: string;
}

/**
 * Parameters for adding an offer
 */
export interface AddOfferParams {
  serverId: string;
  sellerDiscordId: string;
  cardId: string;
  price: number;
}

/**
 * Parameters for removing an offer
 */
export interface RemoveOfferParams {
  serverId: string;
  offerId: string;
  sellerDiscordId: string;
}

/**
 * Market service for managing card offers
 */
export class MarketService {
  constructor(private readonly http: AxiosInstance) {}

  /**
   * Gets all offers for a server
   * @param serverId Discord server ID
   * @returns Array of market offers
   */
  async getAllOffers(serverId: string): Promise<MarketOffer[]> {
    const { data } = await this.http.get<MarketOffer[]>(`/market/${serverId}/offers`);
    return data;
  }

  /**
   * Adds a new offer to the market
   * @param params Offer parameters
   * @returns The created offer
   */
  async addOffer(params: AddOfferParams): Promise<MarketOffer> {
    const { data } = await this.http.post<MarketOffer>(
      `/market/${params.serverId}/offers`,
      {
        sellerDiscordId: params.sellerDiscordId,
        cardId: params.cardId,
        price: params.price,
      }
    );
    return data;
  }

  /**
   * Buys an offer from the market
   * @param params Purchase parameters
   */
  async buyOffer(params: BuyOfferParams): Promise<void> {
    await this.http.post(
      `/market/${params.serverId}/offers/${params.offerId}/buy`,
      {
        buyerDiscordId: params.buyerDiscordId,
      }
    );
  }

  /**
   * Removes an offer from the market
   * @param params Removal parameters
   */
  async removeOffer(params: RemoveOfferParams): Promise<void> {
    await this.http.delete(
      `/market/${params.serverId}/offers/${params.offerId}`,
      {
        data: { sellerDiscordId: params.sellerDiscordId },
      }
    );
  }

  /**
   * Gets a specific offer by ID
   * @param serverId Discord server ID
   * @param offerId Offer ID
   * @returns The market offer or null if not found
   */
  async getOfferById(serverId: string, offerId: string): Promise<MarketOffer | null> {
    try {
      const { data } = await this.http.get<MarketOffer>(
        `/market/${serverId}/offers/${offerId}`
      );
      return data;
    } catch {
      return null;
    }
  }
}

export const marketService = new MarketService(api);
