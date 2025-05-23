-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create simplified users table
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    clerk_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create simplified malware_scans table
CREATE TABLE malware_scans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    file_name TEXT NOT NULL,
    file_hash TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    scan_status TEXT NOT NULL CHECK (scan_status IN ('pending', 'completed', 'failed')),
    threat_level TEXT CHECK (threat_level IN ('clean', 'low', 'medium', 'high', 'critical')),
    scan_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Add basic index
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);

-- Enable RLS with simple true policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE malware_scans ENABLE ROW LEVEL SECURITY;

-- Simple RLS policies that allow all operations
CREATE POLICY "Full access to users"
ON users FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Full access to malware_scans"
ON malware_scans FOR ALL
USING (true)
WITH CHECK (true);

-- Simple function to create or get user
CREATE OR REPLACE FUNCTION create_or_get_user(
    p_clerk_id TEXT,
    p_email TEXT,
    p_full_name TEXT,
    p_avatar_url TEXT
) RETURNS users AS $$
DECLARE
    v_user users;
BEGIN
    SELECT * INTO v_user FROM users WHERE clerk_id = p_clerk_id;
    IF v_user.id IS NULL THEN
        INSERT INTO users (clerk_id, email, full_name, avatar_url)
        VALUES (p_clerk_id, p_email, p_full_name, p_avatar_url)
        RETURNING * INTO v_user;
    END IF;
    RETURN v_user;
END;
$$ LANGUAGE plpgsql;

