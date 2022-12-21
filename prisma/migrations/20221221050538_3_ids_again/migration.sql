/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `GuildLevel` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "uuid" TEXT NOT NULL PRIMARY KEY DEFAULT '',
    "balance" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_User" ("balance", "uuid") SELECT "balance", "uuid" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_uuid_key" ON "User"("uuid");
CREATE TABLE "new_GuildLevel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "level" INTEGER NOT NULL DEFAULT 0,
    "userUuid" TEXT,
    CONSTRAINT "GuildLevel_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "User" ("uuid") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_GuildLevel" ("id", "level") SELECT "id", "level" FROM "GuildLevel";
DROP TABLE "GuildLevel";
ALTER TABLE "new_GuildLevel" RENAME TO "GuildLevel";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
