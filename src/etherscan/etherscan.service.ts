import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IEtherscanService, TTransaction } from './etherscan.interface.js';
import { fetchJson } from '../utils/fetch.js';

@Injectable()
export class EtherscanService implements IEtherscanService {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('API_KEY');
    this.baseUrl = 'https://api.etherscan.io';
  }

  async getTransactionsInBlock(blockNumber: string): Promise<TTransaction[]> {
    const url = this.buildUrl(this.baseUrl, 'api', {
      module: 'proxy',
      action: 'eth_getBlockByNumber',
      tag: blockNumber,
      boolean: true,
    });
    const data = await fetchJson<{
      status?: string;
      result: { transactions: TTransaction[] };
    }>(url);
    if (data?.status === '0') throw new Error(String(data.result));
    const { transactions } = data.result;
    return transactions.map((transaction) => {
      const { hash, blockNumber, from, to, value } = transaction;
      return { hash, blockNumber, from, to, value };
    });
  }

  async getLatestBlockNumber(): Promise<string> {
    const url = this.buildUrl(this.baseUrl, 'api', {
      module: 'proxy',
      action: 'eth_blockNumber',
    });
    const data = await fetchJson<{ status?: string; result: string }>(url);
    if (data.status === '0') throw new Error(data.result);
    return data.result;
  }

  private buildUrl(
    baseUrl: string,
    relativeUrl: string,
    queryParams?: object,
  ): string {
    const url = new URL(relativeUrl, baseUrl);
    if (this.apiKey) url.searchParams.append('apikey', this.apiKey);
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    return url.toString();
  }
}
