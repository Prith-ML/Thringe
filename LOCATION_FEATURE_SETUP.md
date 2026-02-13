# Location-Based Matching Feature - Setup Guide

This guide will help you set up the **100% FREE** location-based matching feature for ThrinGe using Leaflet and OpenStreetMap.

## Overview

The location feature allows users to:
- Enable/disable location-based matching
- Set their current location using browser geolocation
- Adjust search radius (5-100 miles)
- Only see items from sellers within their chosen radius
- Drag the map marker to manually adjust location
- Click anywhere on the map to set location
- View a visual representation of their search area on an interactive map

## Prerequisites

1. **Supabase Access**: Admin access to your Supabase project
2. **That's it!** No API keys or external accounts needed ✅

## Why Leaflet + OpenStreetMap?

- ✅ **100% Free** - No usage limits, no credit card, no API keys
- ✅ **Open Source** - Fully open source mapping solution
- ✅ **No Sign-Up** - Works immediately without registration
- ✅ **Privacy Friendly** - No third-party tracking
- ✅ **Reliable** - Used by thousands of production apps

## Step 1: Run Database Migration

Execute the migration script in your Supabase SQL Editor:

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Open `scripts/002_location_feature.sql`
4. Run the migration:

```sql
-- Add location fields to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS search_radius_miles INTEGER DEFAULT 25,
ADD COLUMN IF NOT EXISTS location_enabled BOOLEAN DEFAULT false;

-- Add index for location queries
CREATE INDEX IF NOT EXISTS idx_profiles_location 
ON profiles(latitude, longitude) 
WHERE location_enabled = true;
```

## Step 2: Test the Feature

1. Restart your development server:
   ```bash
   pnpm dev
   ```

2. Log in to your account

3. Go to Profile → Location tab

4. Toggle "Enable Location Matching"

5. Click "Get My Location"
   - Your browser will ask for location permissions
   - Allow location access
   - Map will load with your current location

6. Adjust the search radius using the slider

7. Drag the marker to fine-tune your location, or click anywhere on the map

8. Click "Save Location Settings"

9. Go to Discover page - you should now only see items within your radius

## How It Works

### Frontend
- **LocationMap Component** (`components/location-map.tsx`):
  - Main wrapper component that handles state and geolocation
  - Dynamic imports to avoid SSR issues
  - Provides radius slider control and location updates

- **LeafletMap Component** (`components/location-map-leaflet.tsx`):
  - Integrates Leaflet with React
  - Uses OpenStreetMap tiles (free, no API key)
  - Renders draggable marker and radius circle
  - Handles map click events

### Backend
- **Distance Calculation** (`lib/distance.ts`):
  - Uses Haversine formula to calculate distances
  - Filters items based on user's location and radius

- **API Endpoints**:
  - `POST /api/profile/location` - Update user location settings
  - `GET /api/profile/location` - Fetch user location settings
  - `GET /api/discover` - Modified to filter by distance

### Database
- New columns in `profiles` table:
  - `latitude` - User's latitude (-90 to 90)
  - `longitude` - User's longitude (-180 to 180)
  - `search_radius_miles` - Search radius in miles (default: 25)
  - `location_enabled` - Toggle for location-based matching

## Privacy & User Control

- Location matching is **opt-in** (disabled by default)
- Users can disable location matching anytime
- Location data is only used for matching, never shared publicly
- Users who disable location won't appear in other users' feeds
- Items from users without location data are filtered out when location matching is enabled

## Troubleshooting

### "Location access denied"
- User needs to grant browser location permissions
- Check browser settings → Privacy → Location
- Clear site data and try again

### Items not filtering by location
- Ensure migration ran successfully
- Check that user has `location_enabled = true`
- Verify latitude/longitude are set
- Check discover API logs for errors

### Map not loading
- Check browser console for JavaScript errors
- Ensure Leaflet CSS is loading correctly
- Clear browser cache and reload
- Check that you're viewing the page in a browser (not SSR)

### Distance calculations seem off
- Haversine formula is accurate for most use cases
- For extremely precise calculations at large scales, consider PostGIS
- Earth's radius is set to 3959 miles in calculations

## Optional: Enable PostGIS (Advanced)

For better performance with large datasets, you can enable PostGIS in Supabase:

1. In Supabase SQL Editor, run:
```sql
-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Add geography column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS location geography(POINT, 4326);

-- Update existing records
UPDATE profiles 
SET location = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Create spatial index
CREATE INDEX IF NOT EXISTS idx_profiles_location_geo 
ON profiles USING GIST(location);
```

2. Update the discover API to use PostGIS queries instead of Haversine

## Future Enhancements

Consider implementing:
- Neighborhood/city boundaries
- "Expand search" option when no items found
- Distance display on item cards
- Sort by distance
- Heatmap of item density
- Location history/favorites

## Support

If you encounter issues, check:
1. Browser console for JavaScript errors
2. Vercel deployment logs
3. Supabase SQL logs
4. Network tab for failed API requests
