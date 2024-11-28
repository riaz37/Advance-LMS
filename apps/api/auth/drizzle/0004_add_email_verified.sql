-- Drop and recreate email_verified field in users table
DO $$ 
BEGIN 
    -- Drop the column if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'users' 
              AND column_name = 'email_verified') THEN
        ALTER TABLE users DROP COLUMN email_verified;
    END IF;

    -- Add the column as boolean
    ALTER TABLE users
    ADD COLUMN email_verified BOOLEAN DEFAULT FALSE NOT NULL;
-- Add email_verified field to users table
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'users' 
                  AND column_name = 'email_verified') THEN
        ALTER TABLE users
        ADD COLUMN email_verified BOOLEAN DEFAULT FALSE NOT NULL;
    END IF;
END $$;
