import { AxiosInstance, AxiosError } from 'axios';
import { api } from './api';
import { Card } from './cardService';

export interface User {
  discordId: string;
  username: string;
  balance: number;
  cards: string[];
  lastDaily: string;
}

/**
 * Extended user data including populated cards
 */
export interface UserWithCards {
  discordId: string;
  username: string;
  balance: number;
  cards: Card[];
  lastDaily: string;
}

export class UserService {
  constructor(private readonly http: AxiosInstance) {}

  /**
   * Gets or creates a user in the backend.
   * Corresponds to POST /user in the original implementation.
   */
  async createUser(user: { discordId: string; username: string }): Promise<void> {
    try {
      await this.http.post('/user', user);
    } catch (error) {
      // 409 = user already exists, which is a valid scenario
      if (error instanceof AxiosError && error.response?.status === 409) {
        return;
      }
      throw error;
    }
  }


  /**
   * Gets a user's cards with full card details
   * @param discordId Discord user ID
   * @returns User data with populated card objects
   */
  async getMyCards(discordId: string): Promise<UserWithCards | null> {
    try {
      const { data } = await this.http.get<UserWithCards>(`/user/${discordId}/cards`);
      return data;
    } catch {
      return null;
    }
  }
}

export const userService = new UserService(api);
