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
  let nearbyItems: typeof filteredItems = []
  let otherItems: typeof filteredItems = []

  // Filter by location if user has location enabled
  if (
    userProfile?.location_enabled &&
    userProfile.latitude &&
    userProfile.longitude &&
    userProfile.search_radius_miles
  ) {
    // Separate items into nearby and other
    filteredItems.forEach((item) => {
      // Check if item owner has location set
      if (item.profiles?.latitude && item.profiles?.longitude) {
        // Calculate distance
        const distance = calculateDistance(
          userProfile.latitude!,
          userProfile.longitude!,
          item.profiles.latitude,
          item.profiles.longitude
        )

        if (distance <= userProfile.search_radius_miles!) {
          nearbyItems.push(item)
        } else {
          otherItems.push(item)
        }
      } else {
        // Items without location go to "other"
        otherItems.push(item)
      }
    })

    // Prioritize nearby items, but include others if needed
    filteredItems = [...nearbyItems, ...otherItems]
  }

  // Limit to 10 items after filtering
  const limitedItems = filteredItems.slice(0, 10)

  return NextResponse.json({ 
    items: limitedItems,
    hasNearbyItems: nearbyItems.length > 0,
    totalNearbyCount: nearbyItems.length 
  })
}
