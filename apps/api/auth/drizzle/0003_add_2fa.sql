-- Add phone and 2FA fields to users table
ALTER TABLE users
ADD COLUMN phone_number VARCHAR(20),
ADD COLUMN is_2fa_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN phone_verified BOOLEAN DEFAULT FALSE;

-- Create verification_codes table
CREATE TABLE verification_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code VARCHAR(6) NOT NULL,
    type VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    CONSTRAINT valid_type CHECK (type IN ('SMS_2FA', 'PHONE_VERIFICATION'))
);

-- Create indexes for better query performance
CREATE INDEX idx_verification_codes_user_type ON verification_codes(user_id, type);
CREATE INDEX idx_verification_codes_expires_at ON verification_codes(expires_at);
CREATE INDEX idx_users_phone ON users(phone_number) WHERE phone_number IS NOT NULL;
