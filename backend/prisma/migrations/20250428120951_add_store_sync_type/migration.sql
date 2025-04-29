/*
  Warnings:

  - You are about to drop the column `product` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[storeConnectionId,platformOrderId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderId,productId,platformSkuId]` on the table `OrderItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Warehouse` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productId,warehouseId]` on the table `WarehouseStock` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderCreatedAt` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderStatus` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `platformOrderId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingFee` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storeConnectionId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Warehouse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `WarehouseStock` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StoreSyncType" AS ENUM ('API', 'MANUAL');

-- CreateEnum
CREATE TYPE "Marketplace" AS ENUM ('Shopee', 'TiktokShop', 'Tokopedia', 'Lazada');

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_warehouseId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "product",
DROP COLUMN "source",
DROP COLUMN "userId",
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "deliveredAt" TIMESTAMP(3),
ADD COLUMN     "orderCreatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "orderStatus" TEXT NOT NULL,
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "platformDiscount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "platformOrderId" TEXT NOT NULL,
ADD COLUMN     "sellerDiscount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "shippedAt" TIMESTAMP(3),
ADD COLUMN     "shippingFee" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "shippingProvider" TEXT,
ADD COLUMN     "storeConnectionId" INTEGER NOT NULL,
ADD COLUMN     "totalAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "trackingNumber" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "warehouseId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "platformSkuId" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Warehouse" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "WarehouseStock" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "stock" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "StoreConnection" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "platform" "Marketplace" NOT NULL,
    "erpStoreName" TEXT NOT NULL,
    "platformStoreId" TEXT,
    "platformStoreName" TEXT,
    "credentials" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isConnected" BOOLEAN NOT NULL DEFAULT false,
    "lastSyncAt" TIMESTAMP(3),
    "syncType" "StoreSyncType" NOT NULL DEFAULT 'MANUAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoreConnection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StoreConnection_userId_erpStoreName_key" ON "StoreConnection"("userId", "erpStoreName");

-- CreateIndex
CREATE UNIQUE INDEX "Order_storeConnectionId_platformOrderId_key" ON "Order"("storeConnectionId", "platformOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "OrderItem_orderId_productId_platformSkuId_key" ON "OrderItem"("orderId", "productId", "platformSkuId");

-- CreateIndex
CREATE UNIQUE INDEX "Warehouse_name_key" ON "Warehouse"("name");

-- CreateIndex
CREATE UNIQUE INDEX "WarehouseStock_productId_warehouseId_key" ON "WarehouseStock"("productId", "warehouseId");

-- AddForeignKey
ALTER TABLE "StoreConnection" ADD CONSTRAINT "StoreConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_storeConnectionId_fkey" FOREIGN KEY ("storeConnectionId") REFERENCES "StoreConnection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE SET NULL ON UPDATE CASCADE;
