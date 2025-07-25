import { AxiosInstance } from 'axios';
import { api } from './api';

export interface ClaimResponse {
  ok: boolean;
  balance: number;
  message?: string;
}

export interface BalanceResponse {
  balance: number;
}

export class EconomyService {
  constructor(private readonly http: AxiosInstance) {}

  async claimDailyBalance(discordId: string): Promise<ClaimResponse> {
    try {
      const { data } = await this.http.post<ClaimResponse>(`/user/${discordId}/daily`);
      return data;
    } catch (err: any) {
      console.error('[EconomyService] claimDailyBalance error:', err);
      const e = err.response?.data as ClaimResponse;
      throw e?.message
        ? e
        : { ok: false, message: 'Error inesperado al reclamar daily balance.', balance: 0 };
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