-- Migration 0011 rebuilt both the pages and page-version tables after the
-- original repair had already run. On D1, that rebuild can leave draft
-- versions without their document relationship, which makes Payload link the
-- row to `/admin/collections/pages/null`. Restore the relationship from the
-- page slug, which is unique in the pages collection.
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
