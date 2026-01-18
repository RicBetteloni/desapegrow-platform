-- AlterTable: Adicionar coluna isAdmin
ALTER TABLE "users" ADD COLUMN "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- Migrar dados: usuários com role='ADMIN' viram isAdmin=true
UPDATE "users" SET "isAdmin" = true WHERE "role" = 'ADMIN';

-- AlterTable: Remover coluna role
ALTER TABLE "users" DROP COLUMN "role";

-- DropEnum: Remover enum Role
DROP TYPE "Role";
