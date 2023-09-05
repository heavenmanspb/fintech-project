import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Transactions1693728452263 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createSchema('fintech', true);

    await queryRunner.createTable(
      new Table({
        name: 'transactions',
        schema: 'fintech',
        columns: [
          {
            name: 'hash',
            type: 'varchar',
            isPrimary: true,
            isUnique: true,
          },
          {
            name: 'block_number',
            type: 'varchar',
          },
          {
            name: 'from',
            type: 'varchar',
          },
          {
            name: 'to',
            type: 'varchar',
          },
          {
            name: 'value',
            type: 'varchar',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(
      new Table({
        name: 'transactions',
        schema: 'fintech',
      }),
    );

    await queryRunner.dropSchema('fintech');
  }
}
