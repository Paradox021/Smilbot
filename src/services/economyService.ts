import { AxiosInstance } from 'axios';
import { api } from './api';

export interface ClaimResponse {
  ok: boolean;
  balance?: number;
  dailyStreak?: number;
  previousStreak?: number;
  maxDailyStreak?: number;
  previousMaxStreak?: number;
  isNewRecord?: boolean;
  totalDailiesClaimed?: number;
  error?: string;
}

export class EconomyService {
  constructor(private readonly http: AxiosInstance) {}

  async claimDailyBalance(discordId: string): Promise<ClaimResponse> {
    try {
      const { data } = await this.http.post<ClaimResponse>(`/user/${discordId}/dailyBalance`);
      return {
        ok: true,
        balance: data.balance,
        dailyStreak: data.dailyStreak,
        previousStreak: data.previousStreak,
        maxDailyStreak: data.maxDailyStreak,
        previousMaxStreak: data.previousMaxStreak,
        isNewRecord: data.isNewRecord,
        totalDailiesClaimed: data.totalDailiesClaimed,
      };
    } catch (err: any) {
      console.error('[EconomyService] claimDailyBalance error:', err.response?.data?.error || err.message);
      const errorMessage = err.response?.data?.error || 'Unexpected error while claiming daily balance.';
      return { ok: false, error: errorMessage };
    }
  }
}

export const economyService = new EconomyService(api);