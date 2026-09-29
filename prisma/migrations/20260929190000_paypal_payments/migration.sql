-- CreateEnum
CREATE TYPE "payment_status" AS ENUM ('not_required', 'awaiting_payment', 'paid', 'failed');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN "payment_status" "payment_status" NOT NULL DEFAULT 'not_required';
ALTER TABLE "orders" ADD COLUMN "paypal_order_id" TEXT;
ALTER TABLE "orders" ADD COLUMN "paypal_capture_id" TEXT;
ALTER TABLE "orders" ADD COLUMN "paid_at" TIMESTAMP(3);

CREATE INDEX "orders_paypal_order_id_idx" ON "orders"("paypal_order_id");
