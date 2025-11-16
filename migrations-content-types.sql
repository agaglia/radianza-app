-- Migration: Update content type constraint to include all supported types
-- Date: 2025-11-16
-- Description: Add support for music, image, mantra, and mediradiananza content types

-- Drop the existing constraint
ALTER TABLE content 
DROP CONSTRAINT IF EXISTS content_type_check;

-- Add the new constraint with all supported types
ALTER TABLE content 
ADD CONSTRAINT content_type_check 
CHECK (type IN ('video', 'photo', 'text', 'poem', 'letter', 'music', 'image', 'mantra', 'mediradiananza'));
