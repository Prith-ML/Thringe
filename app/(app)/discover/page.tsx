"use client"

import { useState, useCallback, useEffect } from "react"
import useSWR from "swr"
import { SwipeCard, type ClothingItem } from "@/components/swipe-card"
import { Loader2, RefreshCw, Sparkles, Heart, MessageCircle, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function DiscoverPage() {
  const { data, error, isLoading, mutate } = useSWR("/api/discover", fetcher)
  const { data: locationData } = useSWR("/api/profile/location", fetcher)
  const [swiped, setSwiped] = useState<string[]>([])
  const [matchInfo, setMatchInfo] = useState<{
    itemTitle: string
    ownerName: string
    matchId: string
  } | null>(null)

  const locationEnabled = locationData?.location?.location_enabled
  const searchRadius = locationData?.location?.search_radius_miles
  const hasNearbyItems = data?.hasNearbyItems
  const totalNearbyCount = data?.totalNearbyCount || 0

  const items: ClothingItem[] = data?.items ?? []
  const visibleItems = items.filter((item) => !swiped.includes(item.id))

  const handleSwipe = useCallback(
    async (itemId: string, direction: "left" | "right") => {
      setSwiped((prev) => [...prev, itemId])

      try {
        const res = await fetch("/api/swipe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ item_id: itemId, direction }),
        })
        const result = await res.json()

        if (result.match) {
          setMatchInfo({
            itemTitle: result.match.clothing_items?.title ?? "an item",
            ownerName: result.match.profiles?.display_name ?? "someone",
            matchId: result.match.id,
          })
        }
      } catch {
        // Silently handle - swipe is already reflected in UI
      }
    },
    []
  )

  const handleRefresh = () => {
    setSwiped([])
    mutate()
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
        <p className="text-muted-foreground">Something went wrong loading items.</p>
        <Button variant="outline" onClick={() => mutate()}>
          Try again
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="mx-auto max-w-md px-4 py-8">
        {/* Premium Header */}
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            <Sparkles className="h-4 w-4" />
            Discover Fashion
          </div>
          <h1 className="font-display text-4xl font-extrabold text-foreground">Discover</h1>
          <p className="mt-2 text-base text-muted-foreground">
            Swipe right to <span className="font-semibold text-primary">like</span>, left to pass
          </p>
        </div>

        {/* Location Filter Banner - Active */}
        {locationEnabled && searchRadius && (
          <div className="mb-6 rounded-xl border-2 border-primary/30 bg-gradient-to-r from-primary/10 to-primary/5 p-4 shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/20">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">
                  Location Filtering Active
                </p>
                <p className="text-xs text-muted-foreground">
                  {hasNearbyItems === false && totalNearbyCount === 0
                    ? `No items within ${searchRadius} miles - showing all items`
                    : `Prioritizing items within ${searchRadius} miles`}
                </p>
              </div>
              <Link href="/profile">
                <Button variant="ghost" size="sm" className="text-xs">
                  Adjust
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Location Suggestion Banner - Not Enabled */}
        {!isLoading && !locationEnabled && items.length > 0 && (
          <div className="mb-6 rounded-xl border-2 border-border/50 bg-muted/30 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-muted">
                <MapPin className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">
                  Find items near you
                </p>
                <p className="text-xs text-muted-foreground">
                  Enable location matching to see nearby items first
                </p>
              </div>
              <Link href="/profile">
                <Button size="sm" className="text-xs">
                  Enable
                </Button>
              </Link>
            </div>
          </div>
        )}

        {visibleItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-6 rounded-3xl border-2 border-border/50 bg-gradient-to-br from-card to-card/50 p-12 text-center shadow-xl">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-10 w-10 text-primary" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-foreground">
                {items.length === 0 
                  ? "No items available yet" 
                  : "You've seen everything!"}
              </p>
              <p className="mt-2 text-base text-muted-foreground">
                {items.length === 0
                  ? "Be the first to list a thrifted find and start the community!"
                  : "Check back later for new items, or list your own."}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button variant="outline" size="lg" onClick={handleRefresh} className="border-2">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Feed
              </Button>
              <Button size="lg" className="shadow-lg shadow-primary/30" asChild>
                <Link href="/my-items">List an Item</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative mx-auto aspect-[3/4] w-full max-w-sm">
            {visibleItems
              .slice(0, 2)
              .reverse()
              .map((item, idx) => (
                <SwipeCard
                  key={item.id}
                  item={item}
                  isTop={idx === visibleItems.slice(0, 2).length - 1}
                  onSwipe={(dir) => handleSwipe(item.id, dir)}
                />
              ))}
          </div>
        )}
      </div>

      {/* Premium Match Dialog */}
      <Dialog open={!!matchInfo} onOpenChange={() => setMatchInfo(null)}>
        <DialogContent className="text-center sm:max-w-md border-2 border-primary/30 bg-gradient-to-br from-card to-card/50">
          <DialogHeader>
            {/* Celebration Icon */}
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-2xl shadow-primary/50 animate-in zoom-in-50">
              <Heart className="h-10 w-10 fill-primary-foreground text-primary-foreground" />
            </div>
            <DialogTitle className="font-display text-4xl font-extrabold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {"It's a Match!"}
            </DialogTitle>
            <DialogDescription className="text-base leading-relaxed pt-2">
              You liked <span className="font-bold text-foreground">{matchInfo?.itemTitle}</span> from{" "}
              <span className="font-bold text-foreground">{matchInfo?.ownerName}</span>. 
              <br />
              <span className="text-primary font-semibold">Start a conversation now!</span>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 pt-4">
            <Button size="lg" className="h-12 shadow-xl shadow-primary/30" asChild>
              <Link href={`/chat/${matchInfo?.matchId}`}>
                <MessageCircle className="mr-2 h-5 w-5" />
                Send a Message
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-12 border-2" onClick={() => setMatchInfo(null)}>
              Keep Swiping
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
