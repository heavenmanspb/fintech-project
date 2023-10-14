export type TTransaction = {
  hash: string;
  blockNumber: string;
  from: string;
  to: string;
  value: string;
};

export interface IEtherscanService {
  getTransactionsInBlock(blockNumber: string): Promise<TTransaction[]>;
  getLatestBlockNumber(): Promise<string>;
}
