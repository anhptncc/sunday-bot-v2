import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserTableDemngayditu1759828090163
  implements MigrationInterface
{
  name = 'UpdateUserTableDemngayditu1759828090163';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "dharmaName" text`);
    await queryRunner.query(`ALTER TABLE "user" ADD "ordinationDate" date`);
    await queryRunner.query(
      `ALTER TYPE "public"."user_role_enum" RENAME TO "user_role_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum" AS ENUM('user', 'admin', 'bot')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "role" TYPE "public"."user_role_enum" USING "role"::"text"::"public"."user_role_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'user'`,
    );
    await queryRunner.query(`DROP TYPE "public"."user_role_enum_old"`);

    // Insert bot as an admin
    await queryRunner.query(
      `INSERT INTO "user" ("id", "username", "role", "balance") VALUES ('1840655383903866880', 'sunday', 'bot', 0)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum_old" AS ENUM('user', 'admin')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "role" TYPE "public"."user_role_enum_old" USING "role"::"text"::"public"."user_role_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'user'`,
    );
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."user_role_enum_old" RENAME TO "user_role_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "ordinationDate"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "dharmaName"`);
  }
}
