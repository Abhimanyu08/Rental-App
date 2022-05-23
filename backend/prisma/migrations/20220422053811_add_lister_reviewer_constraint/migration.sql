-- This is an empty migration.

CREATE FUNCTION getLister(listingId INTEGER)
RETURNS INTEGER AS $$
DECLARE answer INTEGER;
BEGIN 
    SELECT "userId" INTO answer
    FROM "Listing" 
    WHERE id = $1;

    RETURN answer;
END;
$$ LANGUAGE plpgsql;

ALTER TABLE "Review"
ADD CONSTRAINT "lister_reviewer_contraint" CHECK(("listerId" <> "reviewerId") AND getLister("listingId") = "listerId") 