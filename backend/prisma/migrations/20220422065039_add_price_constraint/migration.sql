-- This is an empty migration.

ALTER TABLE "Listing" ADD CHECK(COALESCE("pricePerDay", "pricePerWeek", "pricePerMonth") IS NOT NULL)