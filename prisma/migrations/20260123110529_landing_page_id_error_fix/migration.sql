-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_landingPageId_fkey";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "landingPageId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_landingPageId_fkey" FOREIGN KEY ("landingPageId") REFERENCES "LandingPage"("_id") ON DELETE SET NULL ON UPDATE CASCADE;
