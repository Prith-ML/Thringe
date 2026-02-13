-- Add location fields to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS search_radius_miles INTEGER DEFAULT 25,
ADD COLUMN IF NOT EXISTS location_enabled BOOLEAN DEFAULT false;

-- Add index for location queries (if using PostGIS, you can create a geography column and index)
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(latitude, longitude) WHERE location_enabled = true;

-- Optional: If you have PostGIS enabled, uncomment below:
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location geography(POINT, 4326);
-- CREATE INDEX IF NOT EXISTS idx_profiles_location_geo ON profiles USING GIST(location);
