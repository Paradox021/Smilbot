import { AxiosInstance } from 'axios';
import { api } from './api';

export interface ClaimResponse {
  ok: boolean;
  balance?: number;
  error?: string;
}

export class EconomyService {
  constructor(private readonly http: AxiosInstance) {}

  async claimDailyBalance(discordId: string): Promise<ClaimResponse> {
    try {
      const { data } = await this.http.post<ClaimResponse>(`/user/${discordId}/dailyBalance`);
      return { ok: true, balance: data.balance };
    } catch (err: any) {
      console.error('[EconomyService] claimDailyBalance error:', err.response.data.error);
      const errorMessage = err.response?.data?.error || 'Unexpected error while claiming daily balance.';
      return { ok: false, error: errorMessage };
    }
  }
}

export const economyService = new EconomyService(api);