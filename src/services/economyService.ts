import { AxiosInstance } from 'axios';
import { api } from './api';

export interface ClaimResponse {
  ok: boolean;
  balance?: number;
  error?: string;
}

export interface BalanceResponse {
  balance: number;
}

export class EconomyService {
  constructor(private readonly http: AxiosInstance) {}

  async claimDailyBalance(discordId: string): Promise<ClaimResponse> {
    try {
      const { data } = await this.http.post<ClaimResponse>(`/user/${discordId}/dailyBalance`);
      return { ok: true, balance: data.balance };
    } catch (err: any) {
      console.error('[EconomyService] claimDailyBalance error:', err);
      const errorMessage = err.response?.data?.error || 'Error inesperado al reclamar daily balance.';
      return { ok: false, error: errorMessage };
    }
  }

  async getBalance(discordId: string): Promise<BalanceResponse> {
    try {
      const { data } = await this.http.get<BalanceResponse>(`/economy/balance/${discordId}`);
      return data;
    } catch (err: any) {
      console.error('[EconomyService] getBalance error:', err);
      const e = err.response?.data as { message: string };
      throw { message: e?.message || 'Error inesperado al obtener balance.' };
    }
  }
}

export const economyService = new EconomyService(api);