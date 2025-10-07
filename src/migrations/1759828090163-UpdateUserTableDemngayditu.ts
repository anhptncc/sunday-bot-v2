import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserTableDemngayditu1759828090163 implements MigrationInterface {
    name = 'UpdateUserTableDemngayditu1759828090163'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "dharmaName" text`);
        await queryRunner.query(`ALTER TABLE "user" ADD "ordinationDate" date`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "ordinationDate"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "dharmaName"`);
    }

}
