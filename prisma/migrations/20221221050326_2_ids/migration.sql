/*
  Warnings:

  - You are about to drop the column `userUuid` on the `GuildLevel` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GuildLevel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "level" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT,
    CONSTRAINT "GuildLevel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_GuildLevel" ("id", "level") SELECT "id", "level" FROM "GuildLevel";
DROP TABLE "GuildLevel";
ALTER TABLE "new_GuildLevel" RENAME TO "GuildLevel";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "uuid" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_User" ("balance", "uuid") SELECT "balance", "uuid" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
