import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity.js';
import { TransactionDto } from './transaction.dto.js';
import { ConfigService } from '@nestjs/config';
import { IEtherscanService } from '../etherscan/etherscan.interface.js';

@Injectable()
export class TransactionService {
  private readonly firstBlock: string;
  private readonly logger = new Logger(TransactionService.name);
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @Inject('IEtherscanService')
    private readonly etherscanService: IEtherscanService,
  ) {
    this.firstBlock =
      this.configService.get<string>('FIRST_BLOCK') ??
      `0x${Number('17583000').toString(16)}`;
  }

  private nextBlock(blockNumber: string): string {
    if (!blockNumber) return this.firstBlock;
    const blockDecimal = parseInt(blockNumber, 16);
    const newBlockDecimal = blockDecimal + 1;
    return '0x' + newBlockDecimal.toString(16);
  }

  @Cron('*/1 * * * *')
  async cronJob() {
    const lastSavedBlock = await this.findLastSavedBlock();
    const blockNumber = this.nextBlock(lastSavedBlock);

    const lastNetworkBlock = await this.etherscanService.getLatestBlockNumber();
    if (blockNumber > lastNetworkBlock) {
      this.logger.log(
        `No new blocks to insert into db. Last block is ${lastNetworkBlock}`,
      );
      return;
    }

    const transactions =
      await this.etherscanService.getTransactionsInBlock(blockNumber);

    const filteredTransactions = transactions.filter((transaction) => {
      const { hash, to, from, value } = transaction;
      return hash !== null && to != null && from != null && value != null;
    });

    const countInsertedTransactions =
      await this.addTransactions(filteredTransactions);

    this.logger.log(
      `Block ${blockNumber} | Received transactions: ${transactions.length} | Inserted to database: ${countInsertedTransactions}`,
    );
  }

  async addTransactions(transactions: TransactionDto[]): Promise<number> {
    const { generatedMaps } = await this.transactionRepository
      .createQueryBuilder()
      .insert()
      .values(transactions)
      .orIgnore()
      .returning('*')
      .execute();

    return generatedMaps.filter((obj) => obj.hasOwnProperty('hash')).length;
  }

  async findLastSavedBlock(): Promise<string> {
    const query = this.transactionRepository
      .createQueryBuilder()
      .select(`MAX("block_number")`, 'maxBlockNumber');

    const result = await query.getRawOne();

    return result.maxBlockNumber;
  }

  async findTopChangedAddress(): Promise<{
    topChangedAddress: string | null;
    change: string;
  }> {
    const blockNumbers = await this.transactionRepository
      .createQueryBuilder('tr')
      .select('DISTINCT tr.block_number')
      .orderBy('block_number', 'DESC')
      .limit(100)
      .getRawMany();

    if (blockNumbers.length === 0)
      return { topChangedAddress: null, change: null };

    const blockNumberValues = blockNumbers.map((block) => block.block_number);

    const transactions = await this.transactionRepository
      .createQueryBuilder('tr')
      .where('tr.block_number IN (:...blockNumberValues)', {
        blockNumberValues,
      })
      .getMany();

    const hashMap = transactions.reduce((accumulator, transaction) => {
      if (accumulator[transaction.from])
        accumulator[transaction.from] -= BigInt(transaction.value);
      else accumulator[transaction.from] = -BigInt(transaction.value);

      if (accumulator[transaction.to])
        accumulator[transaction.to] += BigInt(transaction.value);
      else accumulator[transaction.to] = BigInt(transaction.value);

      return accumulator;
    }, {});

    const hashMapAbs: Record<string, bigint> = Object.fromEntries(
      Object.entries(hashMap).map(([key, value]) => [
        key,
        BigInt(Math.abs(Number(value))),
      ]),
    );

    const topChangedAddress = Object.keys(hashMapAbs).reduce((a, b) =>
      hashMapAbs[a] > hashMapAbs[b] ? a : b,
    );

    return {
      topChangedAddress,
      change: `0x${hashMapAbs[topChangedAddress].toString(16)}`,
    };
  }
}
