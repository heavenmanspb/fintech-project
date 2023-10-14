import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EtherscanService } from './etherscan.service';

describe('EtherscanService', () => {
  let etherscanService: EtherscanService;

  const configServiceMock = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EtherscanService,
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
      ],
    }).compile();

    etherscanService = module.get<EtherscanService>(EtherscanService);
  });

  it('should be defined', () => {
    expect(etherscanService).toBeDefined();
  });

  describe('getTransactionsInBlock', () => {
    it('should return an array of transactions', async () => {
      const blockNumber = '0x113a344';
      const transactions =
        await etherscanService.getTransactionsInBlock(blockNumber);
      expect(Array.isArray(transactions)).toBe(true);
      transactions.forEach((transaction) => {
        expect(typeof transaction).toBe('object');
        expect(transaction).toHaveProperty('from');
        expect(transaction).toHaveProperty('to');
        expect(transaction).toHaveProperty('value');
      });
    });
  });

  describe('getLatestBlockNumber', () => {
    it('should return the latest block number as a number', async () => {
      const latestBlockNumber = await etherscanService.getLatestBlockNumber();
      expect(typeof latestBlockNumber).toBe('string');
    });
  });
});
