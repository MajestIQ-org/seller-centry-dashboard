ALTER TABLE invites
  ADD COLUMN IF NOT EXISTS merchant_ids TEXT[];

-- Backfill existing rows for consistency
UPDATE invites
SET merchant_ids = ARRAY[merchant_id]
WHERE merchant_ids IS NULL;

-- Optional index for queries
CREATE INDEX IF NOT EXISTS idx_invites_merchant_ids ON invites USING GIN (merchant_ids);
