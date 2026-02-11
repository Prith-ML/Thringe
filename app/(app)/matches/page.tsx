"use client"

import useSWR from "swr"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Heart, MessageCircle, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface Match {
  id: string
  created_at: string
  clothing_items: {
    title: string
    image_url: string | null
  } | null
  other_user: {
    id: string
    display_name: string | null
    avatar_url: string | null
  } | null
}

export default function MatchesPage() {
  const { data, isLoading } = useSWR("/api/matches", fetcher)
  const matches: Match[] = data?.matches ?? []

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Premium Header */}
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
          <Heart className="h-4 w-4" />
          Your Connections
        </div>
        <h1 className="font-display text-4xl font-extrabold text-foreground">Matches</h1>
        <p className="mt-2 text-base text-muted-foreground">Your liked items and connections</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-6 rounded-3xl border-2 border-dashed border-border/50 bg-gradient-to-br from-card to-card/50 p-12 text-center shadow-xl">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Heart className="h-10 w-10 text-primary" />
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-foreground">No matches yet</p>
            <p className="mt-2 text-base text-muted-foreground">
              Start swiping to find pieces you love!
            </p>
          </div>
          <Button size="lg" className="shadow-lg shadow-primary/30" asChild>
            <Link href="/discover">Go Discover</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {matches.map((match) => (
            <Link key={match.id} href={`/chat/${match.id}`}>
              <Card className="group overflow-hidden border-2 border-border/50 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted shadow-md transition-transform group-hover:scale-105">
                    {match.clothing_items?.image_url ? (
                      <Image
                        src={match.clothing_items.image_url || "/placeholder.svg"}
                        alt={match.clothing_items.title ?? "Item"}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        <Tag className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-display text-lg font-bold text-foreground">
                      {match.clothing_items?.title ?? "Item"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      with <span className="font-semibold text-foreground">{match.other_user?.display_name ?? "Unknown"}</span>
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <MessageCircle className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">
                      {formatDistanceToNow(new Date(match.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
