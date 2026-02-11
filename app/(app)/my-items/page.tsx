"use client"

import useSWR from "swr"
import { AddItemForm } from "@/components/add-item-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Package, Trash2, Tag, Ruler, Sparkles } from "lucide-react"
import Image from "next/image"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface Item {
  id: string
  title: string
  description: string | null
  size: string | null
  category: string | null
  condition: string | null
  image_url: string | null
  price: number | null
  is_active: boolean
  created_at: string
}

export default function MyItemsPage() {
  const { data, isLoading, mutate } = useSWR("/api/items", fetcher)
  const items: Item[] = data?.items ?? []

  const handleDelete = async (id: string) => {
    await fetch("/api/items", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    mutate()
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Premium Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            <Package className="h-4 w-4" />
            Your Listings
          </div>
          <h1 className="font-display text-4xl font-extrabold text-foreground">My Items</h1>
          <p className="mt-2 text-base text-muted-foreground">Manage your listed clothing</p>
        </div>
        <AddItemForm onItemAdded={() => mutate()} />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-6 rounded-3xl border-2 border-dashed border-border/50 bg-gradient-to-br from-card to-card/50 p-16 text-center shadow-xl">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Package className="h-10 w-10 text-primary" />
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-foreground">No items yet</p>
            <p className="mt-2 text-base text-muted-foreground">
              List your first thrifted find for others to discover.
            </p>
          </div>
          <AddItemForm onItemAdded={() => mutate()} />
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card key={item.id} className="group overflow-hidden border-2 border-border/50 transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10">
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                {item.image_url ? (
                  <Image
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <Tag className="h-12 w-12 opacity-30" />
                  </div>
                )}
                {item.category && (
                  <Badge className="absolute left-3 top-3 bg-black/60 text-white backdrop-blur-sm border border-white/20 shadow-lg">
                    {item.category}
                  </Badge>
                )}
                {!item.is_active && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <Badge variant="secondary" className="text-lg">Inactive</Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-lg font-bold text-foreground">{item.title}</h3>
                  {item.price !== null && (
                    <span className="shrink-0 rounded-lg bg-primary/10 px-3 py-1 font-display text-lg font-bold text-primary">
                      ${item.price}
                    </span>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {item.size && (
                    <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                      <Ruler className="h-3 w-3" /> {item.size}
                    </span>
                  )}
                  {item.condition && (
                    <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                      <Sparkles className="h-3 w-3" /> {item.condition}
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                )}
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="border border-destructive/30 text-destructive transition-all hover:border-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="mr-1.5 h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
