import { IsString, IsNumber } from 'class-validator';

export class TransactionDto {
  @IsString()
  hash: string;

  @IsString()
  blockNumber: string;

  @IsString()
  from: string;

  @IsString()
  to: string;

  @IsNumber()
  value: string;
}
