/*
  Warnings:

  - You are about to drop the column `address` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `customer` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `orderStatus` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `platformDiscount` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `sellerDiscount` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `shippingFee` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `totalAmount` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `OrderItem` table. All the data in the column will be lost.
  - Added the required column `customerAddress` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerName` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `platformOrderStatus` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingFeePaidByBuyer` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmountPaidByBuyer` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitOriginalPrice` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitPriceAfterDiscount` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "address",
DROP COLUMN "customer",
DROP COLUMN "orderStatus",
DROP COLUMN "phone",
DROP COLUMN "platformDiscount",
DROP COLUMN "sellerDiscount",
DROP COLUMN "shippingFee",
DROP COLUMN "totalAmount",
ADD COLUMN     "buyerNote" TEXT,
ADD COLUMN     "buyerServiceFee" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "buyerUsername" TEXT,
ADD COLUMN     "cancellationReason" TEXT,
ADD COLUMN     "coinDiscount" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "customerAddress" TEXT NOT NULL,
ADD COLUMN     "customerCity" TEXT,
ADD COLUMN     "customerDistrict" TEXT,
ADD COLUMN     "customerName" TEXT NOT NULL,
ADD COLUMN     "customerPhone" TEXT,
ADD COLUMN     "customerPostalCode" TEXT,
ADD COLUMN     "customerProvince" TEXT,
ADD COLUMN     "customerVillage" TEXT,
ADD COLUMN     "erpOrderStatus" TEXT,
ADD COLUMN     "handlingFee" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "insuranceFee" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "orderLevelPlatformDiscount" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "orderLevelSellerDiscount" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "originalShippingFee" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "packageId" TEXT,
ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "paymentMethodDiscount" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "platformOrderStatus" TEXT NOT NULL,
ADD COLUMN     "rtsAt" TIMESTAMP(3),
ADD COLUMN     "sellerNote" TEXT,
ADD COLUMN     "shippingFeePaidByBuyer" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "shippingFeePlatformDiscount" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "shippingFeeSellerDiscount" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "totalAmountPaidByBuyer" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "voucherDiscountPlatform" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "voucherDiscountSeller" DOUBLE PRECISION DEFAULT 0;

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "price",
ADD COLUMN     "itemPlatformDiscount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "itemSellerDiscount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "productNameAtOrder" TEXT,
ADD COLUMN     "unitOriginalPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "unitPriceAfterDiscount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "variationName" TEXT;
