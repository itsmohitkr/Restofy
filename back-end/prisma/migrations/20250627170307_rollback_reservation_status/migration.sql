/*
  Warnings:

  - Made the column `status` on table `Reservation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Reservation" ALTER COLUMN "status" SET NOT NULL;
