import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCountdownTable1755678697013 implements MigrationInterface {
    name = 'CreateCountdownTable1755678697013'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "countdown" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "type" character varying NOT NULL, "targetDate" date NOT NULL, "isFinished" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_f7cf818eea441890243008e506c" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "countdown"`);
    }

}
