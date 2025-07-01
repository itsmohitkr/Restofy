/*
  Warnings:

  - A unique constraint covering the columns `[tableName]` on the table `Table` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Table_tableName_key" ON "Table"("tableName");
