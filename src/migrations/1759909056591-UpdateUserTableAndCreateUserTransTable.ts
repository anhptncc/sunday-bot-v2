import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserTable1759909056591 implements MigrationInterface {
  name = 'UpdateUserTable1759909056591';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "dharmaName" text`);
    await queryRunner.query(`ALTER TABLE "user" ADD "ordinationDate" date`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "ordinationDate"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "dharmaName"`);
  }
}
