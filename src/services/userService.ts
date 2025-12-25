import { AxiosInstance } from 'axios';
import { api } from './api';
import { Card } from './cardService';

export interface User {
  discordId: string;
  username: string;
  balance: number;
  cards: string[];
  lastDaily: string;
}

export class UserService {
  constructor(private readonly http: AxiosInstance) {}

  /**
   * Gets or creates a user in the backend.
   * Corresponds to POST /user in the original implementation.
   */
  async createUser(user: { discordId: string; username: string }): Promise<User> {
      const { data } = await this.http.post<User>('/user', user);
      return data;
  }
  
}

export const userService = new UserService(api);
