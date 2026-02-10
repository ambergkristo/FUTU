-- Add start_time and end_time columns to booking table
-- Backfill data from slot_template where possible
-- Keep slot_template_id column to avoid migration issues

ALTER TABLE booking ADD COLUMN start_time TIME;
ALTER TABLE booking ADD COLUMN end_time TIME;

-- Make slot_template_id nullable first
ALTER TABLE booking ALTER COLUMN slot_template_id BIGINT NULL;

-- Migrate data from slot_template to booking columns
UPDATE booking b 
SET start_time = (
    SELECT st.start_time 
    FROM slot_template st 
    WHERE st.id = b.slot_template_id
),
end_time = (
    SELECT st.end_time 
    FROM slot_template st 
    WHERE st.id = b.slot_template_id
);

-- Make new columns not nullable after data migration
ALTER TABLE booking ALTER COLUMN start_time TIME NOT NULL;
ALTER TABLE booking ALTER COLUMN end_time TIME NOT NULL;

-- Add new unique constraint (keep old one to avoid conflicts)
ALTER TABLE booking ADD CONSTRAINT uk_booking_room_date_start_time UNIQUE (room_id, booking_date, start_time);
