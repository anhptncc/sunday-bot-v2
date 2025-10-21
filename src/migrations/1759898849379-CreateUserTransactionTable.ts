import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTransactionTable1759898849379 implements MigrationInterface {
    name = 'CreateUserTransactionTable1759898849379'

    public async up(queryRunner: QueryRunner): Promise<void> {
      // insert bot sunday as admin
      await queryRunner.query(
        `INSERT INTO "user" ("id", "username", "role", "balance") VALUES ('1840655383903866880', 'Sunday', 'admin', 0)`,
      );

      // insert homcongduc
      await queryRunner.query(
        `INSERT INTO "user" ("id", "username", "role", "balance") VALUES ('d4db138d-816c-4fb6-a39e-94c1997f5d5a', 'Homcongduc', 'homcongduc', 0)`,
      );

      await queryRunner.query(
        `CREATE TABLE "user_transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "senderId" character varying NOT NULL, "receiverId" character varying NOT NULL, "amount" numeric NOT NULL, CONSTRAINT "PK_21325240e8a1f55f22a6f35df4f" PRIMARY KEY ("id"))`,
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user_transactions"`);
    }

}
