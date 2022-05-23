/*
  Warnings:

  - Added the required column `searchable_index_col` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "searchable_index_col" tsvector GENERATED ALWAYS AS (to_tsvector('english', name || ' ' || description)) STORED;

-- CreateIndex
CREATE INDEX "Listing_searchable_index_col_idx" ON "Listing" USING GIN ("searchable_index_col") ;
