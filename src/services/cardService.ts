import { AxiosInstance } from 'axios';
import { api } from './api';

export interface Card {
  _id: string;
  name: string;
  type: string;
  description: string;
  author: string;
  image: string;
}

export class CardService {
  constructor(private readonly http: AxiosInstance) {}

  async buyRandomCard(discordId: string): Promise<Card> {
    const { data } = await this.http.post<Card>(`/user/${discordId}/card/random`);
    return data;
  }

  async getAllCards(): Promise<Card[]> {
    const { data } = await this.http.get<Card[]>('/card');
    return data;
  }
}

export const cardService = new CardService(api);
