/*
  Warnings:

  - You are about to drop the column `shippingProvider` on the `Order` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserRole" ADD VALUE 'MARKETING_PERFORMANCE_MANAGER';
ALTER TYPE "UserRole" ADD VALUE 'ADVERTISER';

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "shippingProvider",
ADD COLUMN     "shippingProviderId" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "advertiserId" INTEGER,
ADD COLUMN     "mpmId" INTEGER,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "ShippingProvider" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ShippingProvider_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShippingProvider_name_key" ON "ShippingProvider"("name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_advertiserId_fkey" FOREIGN KEY ("advertiserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_mpmId_fkey" FOREIGN KEY ("mpmId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_shippingProviderId_fkey" FOREIGN KEY ("shippingProviderId") REFERENCES "ShippingProvider"("id") ON DELETE SET NULL ON UPDATE CASCADE;
