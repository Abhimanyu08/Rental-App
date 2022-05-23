/*
  Warnings:

  - Made the column `searchable_index_col` on table `Listing` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Listing" ALTER COLUMN "searchable_index_col" SET NOT NULL;
