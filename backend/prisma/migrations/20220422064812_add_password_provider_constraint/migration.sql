-- This is an empty migration.

ALTER TABLE "User"
ADD CHECK (("password" IS NULL) <> ("provider" IS NULL))