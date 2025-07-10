-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_reservationId_fkey";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "reservationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
