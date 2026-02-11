"use client"

import useSWR from "swr"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, MessageCircle, Tag } from "lucide-react"
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

export default function ChatListPage() {
  const { data, isLoading } = useSWR("/api/matches", fetcher)
  const matches: Match[] = data?.matches ?? []

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Premium Header */}
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
          <MessageCircle className="h-4 w-4" />
          Chat Center
        </div>
        <h1 className="font-display text-4xl font-extrabold text-foreground">Messages</h1>
        <p className="mt-2 text-base text-muted-foreground">Chat with your matches</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-6 rounded-3xl border-2 border-dashed border-border/50 bg-gradient-to-br from-card to-card/50 p-12 text-center shadow-xl">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <MessageCircle className="h-10 w-10 text-primary" />
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-foreground">No conversations yet</p>
            <p className="mt-2 text-base text-muted-foreground">
              Match with items to start chatting with sellers.
            </p>
          </div>
          <Button size="lg" className="shadow-lg shadow-primary/30" asChild>
            <Link href="/discover">Discover Items</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {matches.map((match) => (
            <Link key={match.id} href={`/chat/${match.id}`}>
              <Card className="group overflow-hidden border-2 border-border/50 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-primary/20 to-primary/10 shadow-md transition-transform group-hover:scale-105">
                    {match.other_user?.avatar_url ? (
                      <Image
                        src={match.other_user.avatar_url || "/placeholder.svg"}
                        alt={match.other_user.display_name ?? "User"}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-lg font-bold text-primary">
                        {(match.other_user?.display_name ?? "?")[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-display text-lg font-bold text-foreground">
                      {match.other_user?.display_name ?? "Unknown"}
                    </p>
                    <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Tag className="h-3.5 w-3.5" />
                      {match.clothing_items?.title ?? "Item"}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="rounded-full bg-primary/10 p-2">
                      <MessageCircle className="h-4 w-4 text-primary" />
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
