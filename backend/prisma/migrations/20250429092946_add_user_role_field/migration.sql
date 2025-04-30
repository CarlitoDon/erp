/*
  Warnings:

  - You are about to drop the column `buyerUsername` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `customerAddress` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `customerCity` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `customerDistrict` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `customerName` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `customerPhone` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `customerPostalCode` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `customerProvince` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `customerVillage` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `isAdmin` on the `User` table. All the data in the column will be lost.
  - Added the required column `customerId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderChannel` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'SALES_ACQUISITION', 'SALES_RETENTION', 'MARKETPLACE_MANAGER', 'WAREHOUSE_STAFF', 'FINANCE_STAFF');

-- CreateEnum
CREATE TYPE "OrderChannel" AS ENUM ('MARKETPLACE', 'WHATSAPP_ACQUISITION', 'WHATSAPP_RETENTION');

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_storeConnectionId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "buyerUsername",
DROP COLUMN "customerAddress",
DROP COLUMN "customerCity",
DROP COLUMN "customerDistrict",
DROP COLUMN "customerName",
DROP COLUMN "customerPhone",
DROP COLUMN "customerPostalCode",
DROP COLUMN "customerProvince",
DROP COLUMN "customerVillage",
ADD COLUMN     "customerId" INTEGER NOT NULL,
ADD COLUMN     "orderChannel" "OrderChannel" NOT NULL,
ADD COLUMN     "salesRepId" INTEGER,
ADD COLUMN     "shippingAddressSnapshot" JSONB,
ALTER COLUMN "storeConnectionId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isAdmin",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'SALES_ACQUISITION';

-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT,
    "province" TEXT,
    "city" TEXT,
    "district" TEXT,
    "village" TEXT,
    "postalCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_phone_key" ON "Customer"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_storeConnectionId_fkey" FOREIGN KEY ("storeConnectionId") REFERENCES "StoreConnection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_salesRepId_fkey" FOREIGN KEY ("salesRepId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
