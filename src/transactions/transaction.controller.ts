import { Controller, Get, HttpException, Inject, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransactionService } from './transaction.service.js';
import { TransactionDto } from './transaction.dto.js';
import { IEtherscanService } from '../etherscan/etherscan.interface.js';

@Controller()
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    @Inject('IEtherscanService')
    private readonly etherscanService: IEtherscanService,
  ) {}

  @Get('top-changed-address')
  @ApiTags('task')
  @ApiOperation({ summary: 'Get a top changed address' })
  @ApiResponse({
    status: 200,
    description: 'Returns a top changed address',
    schema: {
      type: 'object',
      properties: {
        topChangedAddress: { type: 'string' },
        change: { type: 'string' },
      },
    },
  })
  async findTopChangedAddress(): Promise<{
    topChangedAddress: string;
    change: string;
  }> {
    return this.transactionService.findTopChangedAddress();
  }

  @Get('transactions/:blockNumber')
  @ApiTags('etherscan-api')
  @ApiOperation({
    summary: 'Get a transactions in block',
    description: 'First block is 0x10C4B98',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns transactions in block',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          blockNumber: { type: 'string' },
          from: { type: 'string' },
          to: { type: 'string' },
          value: { type: 'string' },
        },
      },
    },
  })
  @ApiResponse({ status: 429, description: 'Too Many Requests' })
  async getTransactionsInBlock(
    @Param('blockNumber') blockNumber: string,
  ): Promise<TransactionDto[]> {
    return this.etherscanService
      .getTransactionsInBlock(blockNumber)
      .catch((err) => {
        throw new HttpException(err.message, 429);
      });
  }

  @Get('getLatestBlockNumber')
  @ApiTags('etherscan-api')
  @ApiOperation({ summary: 'Get a latest block number' })
  @ApiResponse({
    status: 200,
    description: 'Returns transactions in block',
    schema: {
      type: 'object',
      properties: {
        latestBlock: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 429, description: 'Too Many Requests' })
  async getLatestBlockNumber(): Promise<{ latestBlock: string }> {
    const latestBlock = await this.etherscanService
      .getLatestBlockNumber()
      .catch((err) => {
        throw new HttpException(err.message, 429);
      });
    return { latestBlock };
  }
}
