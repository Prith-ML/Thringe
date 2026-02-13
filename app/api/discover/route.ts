import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { calculateDistance } from "@/lib/distance"

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Get user's location settings
  const { data: userProfile } = await supabase
    .from("profiles")
    .select("latitude, longitude, search_radius_miles, location_enabled")
    .eq("id", user.id)
    .single()

  // Get items the user hasn't swiped on, excluding their own items
  const { data: swipedItems } = await supabase
    .from("swipes")
    .select("item_id")
    .eq("swiper_id", user.id)

  const swipedIds = swipedItems?.map((s) => s.item_id) ?? []

  let query = supabase
    .from("clothing_items")
    .select("*, profiles(display_name, latitude, longitude)")
    .eq("is_active", true)
    .neq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50) // Fetch more items for location filtering

  if (swipedIds.length > 0) {
    query = query.not("id", "in", `(${swipedIds.join(",")})`)
  }

  const { data: items, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  let filteredItems = items ?? []

  // Filter by location if user has location enabled
  if (
    userProfile?.location_enabled &&
    userProfile.latitude &&
    userProfile.longitude &&
    userProfile.search_radius_miles
  ) {
    filteredItems = filteredItems.filter((item) => {
      // Check if item owner has location set
      if (!item.profiles?.latitude || !item.profiles?.longitude) {
        return false // Don't show items without location
      }

      // Calculate distance
      const distance = calculateDistance(
        userProfile.latitude!,
        userProfile.longitude!,
        item.profiles.latitude,
        item.profiles.longitude
      )

      return distance <= userProfile.search_radius_miles!
    })
  }

  // Limit to 10 items after filtering
  const limitedItems = filteredItems.slice(0, 10)

  return NextResponse.json({ items: limitedItems })
}
