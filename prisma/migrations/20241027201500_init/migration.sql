-- CreateEnum
CREATE TYPE "trip_types" AS ENUM ('car', 'bus', 'train', 'flight');

-- CreateTable
CREATE TABLE "Trip" (
    "id" UUID NOT NULL,
    "origin" VARCHAR(3) NOT NULL,
    "destination" VARCHAR(3) NOT NULL,
    "cost" DECIMAL(10,2) NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "type" "trip_types" NOT NULL,
    "display_name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Trip_origin_destination_idx" ON "Trip"("origin", "destination");

-- CreateIndex
CREATE UNIQUE INDEX "Trip_origin_destination_type_key" ON "Trip"("origin", "destination", "type");
