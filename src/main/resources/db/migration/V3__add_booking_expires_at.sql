ALTER TABLE booking ADD COLUMN expires_at TIMESTAMP;

-- Add index for performance on expiry queries
CREATE INDEX idx_booking_expires_at ON booking(expires_at);
