import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service.js';
import { EtherscanService } from '../etherscan/etherscan.service.js';
import { TransactionController } from './transaction.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    {
      provide: 'IEtherscanService',
      useClass: EtherscanService,
    },
  ],
})
export class TransactionModule {}
