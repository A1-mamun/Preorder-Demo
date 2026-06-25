-- CreateTable
CREATE TABLE "preorders" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "products" INTEGER NOT NULL,
    "preorderWhen" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "startsAt" DATETIME NOT NULL,
    "endsAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE INDEX "preorders_status_idx" ON "preorders"("status");

-- CreateIndex
CREATE INDEX "preorders_createdAt_idx" ON "preorders"("createdAt");

-- CreateIndex
CREATE INDEX "preorders_isDeleted_idx" ON "preorders"("isDeleted");

-- CreateIndex
CREATE INDEX "preorders_status_isDeleted_idx" ON "preorders"("status", "isDeleted");
