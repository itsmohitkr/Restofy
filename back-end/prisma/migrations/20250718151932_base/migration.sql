/*
  Warnings:

  - You are about to drop the column `addedByUserId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `restaurantId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[employeeId]` on the table `Address` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "EmployeeRole" AS ENUM ('Manager', 'Staff');

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_addedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_restaurantId_fkey";

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "employeeId" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "addedByUserId",
DROP COLUMN "restaurantId";

-- CreateTable
CREATE TABLE "RestaurantEmployee" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "role" "EmployeeRole" NOT NULL DEFAULT 'Staff',
    "password" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "addedByUserId" INTEGER NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestaurantEmployee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantEmployee_email_key" ON "RestaurantEmployee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantEmployee_phoneNumber_key" ON "RestaurantEmployee"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Address_employeeId_key" ON "Address"("employeeId");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "RestaurantEmployee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantEmployee" ADD CONSTRAINT "RestaurantEmployee_addedByUserId_fkey" FOREIGN KEY ("addedByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantEmployee" ADD CONSTRAINT "RestaurantEmployee_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("restaurantId") ON DELETE CASCADE ON UPDATE CASCADE;
