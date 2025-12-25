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
    // Assuming the backend endpoint is POST /user/:id/card/random or similar.
    // Based on user request: "getCard only would be making a call to the endpoint getRandomCard"
    // and "endpoint already takes care of verifying that the user has the necessary balance".
    // I'll use a hypothetical endpoint that fits the REST style: POST /store/buy-card or POST /user/:id/buy-card
    // Let's try POST /user/:id/card/random which seems consistent with other endpoints like /user/:id/dailyBalance
    const { data } = await this.http.post<Card>(`/user/${discordId}/card/random`);
    return data;
  }

  async getAllCards(): Promise<Card[]> {
    const { data } = await this.http.get<Card[]>('/card');
    return data;
  }
}

export const cardService = new CardService(api);
