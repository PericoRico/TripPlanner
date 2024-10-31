/*
  Warnings:

  - You are about to drop the column `displayName` on the `Trip` table. All the data in the column will be lost.
  - Added the required column `display_name` to the `Trip` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Trip" DROP COLUMN "displayName",
ADD COLUMN     "display_name" VARCHAR(255) NOT NULL;
