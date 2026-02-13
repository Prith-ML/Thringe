import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { latitude, longitude, search_radius_miles, location_enabled } = body

  // Validate inputs
  if (latitude !== undefined && (latitude < -90 || latitude > 90)) {
    return NextResponse.json({ error: "Invalid latitude" }, { status: 400 })
  }

  if (longitude !== undefined && (longitude < -180 || longitude > 180)) {
    return NextResponse.json({ error: "Invalid longitude" }, { status: 400 })
  }

  if (search_radius_miles !== undefined && (search_radius_miles < 1 || search_radius_miles > 1000)) {
    return NextResponse.json({ error: "Invalid search radius" }, { status: 400 })
  }

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }

  if (latitude !== undefined) updateData.latitude = latitude
  if (longitude !== undefined) updateData.longitude = longitude
  if (search_radius_miles !== undefined) updateData.search_radius_miles = search_radius_miles
  if (location_enabled !== undefined) updateData.location_enabled = location_enabled

  const { data, error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", user.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ profile: data })
}

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("latitude, longitude, search_radius_miles, location_enabled")
    .eq("id", user.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ location: data })
}
