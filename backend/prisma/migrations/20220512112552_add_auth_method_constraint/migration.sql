-- This is an empty migration.

ALTER TABLE "User"
ADD CHECK ("auth_method" ='google' OR "auth_method" = 'email')