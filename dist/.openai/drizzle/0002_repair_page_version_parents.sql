-- The 0001 SQLite table rebuild dropped `pages` after foreign keys had been
-- re-enabled. D1 consequently applied `_pages_v.parent_id`'s ON DELETE SET
-- NULL action to existing versions. Payload's draft list uses that parent as
-- the document ID, so affected rows linked to `/admin/collections/pages/null`.
-- Restore every unambiguous version relationship from the page's unique slug.
UPDATE `_pages_v`
SET `parent_id` = (
  SELECT `pages`.`id`
  FROM `pages`
  WHERE `pages`.`slug` = `_pages_v`.`version_slug`
)
WHERE `parent_id` IS NULL
  AND `version_slug` IS NOT NULL
  AND EXISTS (
    SELECT 1
    FROM `pages`
    WHERE `pages`.`slug` = `_pages_v`.`version_slug`
  );
