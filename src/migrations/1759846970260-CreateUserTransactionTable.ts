import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTransactionTable1759846970260 implements MigrationInterface {
    name = 'CreateUserTransactionTable1759846970260'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_transactions" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "user_transactions" ADD "senderId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_transactions" ADD "receiverId" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_transactions" DROP COLUMN "receiverId"`);
        await queryRunner.query(`ALTER TABLE "user_transactions" DROP COLUMN "senderId"`);
        await queryRunner.query(`ALTER TABLE "user_transactions" ADD "userId" character varying NOT NULL`);
    }

}
