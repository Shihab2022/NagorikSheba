-- Migration: 22_fix-swapped-notice-dates.sql
-- Fix legacy notice published_at values where dates with day <= 12 were parsed in US MM-DD-YYYY format,
-- causing day and month to be swapped.
UPDATE notices
SET published_at = make_timestamptz(
      extract(year from (published_at AT TIME ZONE 'Asia/Dhaka'))::int,
      extract(day from (published_at AT TIME ZONE 'Asia/Dhaka'))::int,
      extract(month from (published_at AT TIME ZONE 'Asia/Dhaka'))::int,
      0, 0, 0, 'UTC'
    )
WHERE published_at IS NOT NULL
  AND published_at::text LIKE '%18:00:00%'
  AND extract(day from (published_at AT TIME ZONE 'Asia/Dhaka')) <= 12;
