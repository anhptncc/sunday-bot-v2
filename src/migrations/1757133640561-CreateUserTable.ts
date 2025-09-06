import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1757133640561 implements MigrationInterface {
  name = 'CreateUserTable1757133640561';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum" AS ENUM('user', 'admin')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" character varying NOT NULL, "username" text, "role" "public"."user_role_enum" NOT NULL DEFAULT 'user', "balance" numeric NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );

    // Insert admin
    await queryRunner.query(
      `INSERT INTO "user" ("id", "username", "role", "balance") VALUES ('1803263641638670336', 'anh.phamtien', 'admin', 0)`,
    );
    await queryRunner.query(
      `INSERT INTO "user" ("id", "username", "role", "balance") VALUES ('1788023377328345088', 'quan.nguyenhuu', 'admin', 0)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
  }
}
