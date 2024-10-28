/*
  Warnings:

  - You are about to drop the column `display_name` on the `Trip` table. All the data in the column will be lost.
  - You are about to alter the column `cost` on the `Trip` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - Added the required column `displayName` to the `Trip` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Trip" DROP COLUMN "display_name",
ADD COLUMN     "displayName" VARCHAR(255) NOT NULL,
ALTER COLUMN "cost" SET DATA TYPE DOUBLE PRECISION;
