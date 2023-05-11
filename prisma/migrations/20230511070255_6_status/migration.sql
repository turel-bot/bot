-- CreateTable
CREATE TABLE "Status" (
    "shard" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 0,
    "text" TEXT NOT NULL DEFAULT 'on a Razer Gaming Phone',
    "type" INTEGER NOT NULL DEFAULT 1,
    "url" TEXT DEFAULT 'https://twitch.tv/turelbot'
);

-- CreateIndex
CREATE UNIQUE INDEX "Status_shard_key" ON "Status"("shard");
