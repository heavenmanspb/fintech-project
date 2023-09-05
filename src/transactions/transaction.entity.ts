import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('transactions', { schema: 'fintech' })
export class Transaction {
  @PrimaryColumn({ type: 'varchar' })
  hash: string;

  @Column({ type: 'varchar', name: 'block_number' })
  blockNumber: string;

  @Column({ type: 'varchar' })
  from: string;

  @Column({ type: 'varchar' })
  to: string;

  @Column({ type: 'varchar' })
  value: string;
}
