import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserTable1759898692992 implements MigrationInterface {
    name = 'UpdateUserTable1759898692992'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "role" character varying NOT NULL DEFAULT 'user'`);

        await queryRunner.query(`
            UPDATE "user"
            SET "role" = 'admin'
            WHERE "id" = '1803263641638670336';
        `);

        await queryRunner.query(`
            UPDATE "user"
            SET "role" = 'admin'
            WHERE "id" = '1788023377328345088';
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('user', 'admin', 'bot')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "role" "public"."user_role_enum" NOT NULL DEFAULT 'user'`);
    }

}
