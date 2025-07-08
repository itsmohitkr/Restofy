-- AlterTable
ALTER TABLE "MenuItem" ADD COLUMN     "isAvailable" BOOLEAN DEFAULT true,
ADD COLUMN     "itemCategory" TEXT NOT NULL DEFAULT 'General',
ADD COLUMN     "itemRating" DOUBLE PRECISION DEFAULT 0.0,
ADD COLUMN     "itemStatus" TEXT NOT NULL DEFAULT 'Available',
ADD COLUMN     "itemType" TEXT;
