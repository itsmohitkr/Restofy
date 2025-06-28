/*
  Warnings:

  - You are about to drop the column `reservationDate` on the `Reservation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_tableId_fkey";

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "reservationDate",
ALTER COLUMN "tableId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Table"("id") ON DELETE SET NULL ON UPDATE CASCADE;
