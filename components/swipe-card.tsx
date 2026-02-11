"use client"

import React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { X, Heart, Tag, Ruler, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface ClothingItem {
  id: string
  title: string
  description: string | null
  size: string | null
  category: string | null
  condition: string | null
  image_url: string | null
  price: number | null
  profiles: {
    display_name: string | null
  } | null
}

interface SwipeCardProps {
  item: ClothingItem
  onSwipe: (direction: "left" | "right") => void
  isTop: boolean
}

export function SwipeCard({ item, onSwipe, isTop }: SwipeCardProps) {
  const [dragX, setDragX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startX = useRef(0)
  const cardRef = useRef<HTMLDivElement>(null)

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isTop) return
    setIsDragging(true)
    startX.current = e.clientX
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return
    setDragX(e.clientX - startX.current)
  }

  const handlePointerUp = () => {
    if (!isDragging) return
    setIsDragging(false)

    if (dragX > 100) {
      onSwipe("right")
    } else if (dragX < -100) {
      onSwipe("left")
    }
    setDragX(0)
  }

  const rotation = dragX * 0.1
  const opacity = Math.max(0, 1 - Math.abs(dragX) / 300)

  return (
    <div
      ref={cardRef}
      className={cn(
        "absolute inset-0 cursor-grab select-none overflow-hidden rounded-3xl border-2 border-border/50 bg-card shadow-2xl transition-all",
        isDragging ? "cursor-grabbing shadow-3xl" : "duration-300",
        !isTop && "scale-[0.95] opacity-50"
      )}
      style={
        isTop
          ? {
              transform: `translateX(${dragX}px) rotate(${rotation}deg)`,
              opacity,
            }
          : undefined
      }
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Swipe indicators - Enhanced */}
      {isTop && dragX > 50 && (
        <div className="absolute left-8 top-8 z-20 rounded-2xl border-4 border-primary bg-primary/30 backdrop-blur-sm px-6 py-3 font-display text-2xl font-extrabold text-primary shadow-2xl shadow-primary/50">
          LIKE
        </div>
      )}
      {isTop && dragX < -50 && (
        <div className="absolute right-8 top-8 z-20 rounded-2xl border-4 border-destructive bg-destructive/30 backdrop-blur-sm px-6 py-3 font-display text-2xl font-extrabold text-destructive shadow-2xl shadow-destructive/50">
          PASS
        </div>
      )}

      {/* Full Image Background */}
      <div className="absolute inset-0 bg-muted">
        {item.image_url ? (
          <Image
            src={item.image_url || "/placeholder.svg"}
            alt={item.title}
            fill
            className="object-cover"
            draggable={false}
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <Tag className="h-16 w-16 opacity-30" />
          </div>
        )}
      </div>

      {/* Gradient overlays for better readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none" />

      {/* Compact Info Badge - Top */}
      {item.profiles?.display_name && (
        <div className="absolute left-6 top-6 z-10 rounded-full bg-black/40 backdrop-blur-md px-4 py-2 border border-white/20">
          <p className="text-xs font-medium text-white/90">
            by {item.profiles.display_name}
          </p>
        </div>
      )}

      {/* Main Info Section - Bottom, Compact & Elegant */}
      <div className="absolute inset-x-0 bottom-20 z-10 px-6 pb-6 space-y-4">
        {/* Title and Price Row */}
        <div className="flex items-end justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="font-display text-3xl font-extrabold text-white drop-shadow-2xl truncate">
              {item.title}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              {item.category && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white border border-white/30">
                  <Tag className="h-3 w-3" />
                  {item.category}
                </span>
              )}
              {item.size && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white border border-white/30">
                  <Ruler className="h-3 w-3" />
                  {item.size}
                </span>
              )}
              {item.condition && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white border border-white/30">
                  <Sparkles className="h-3 w-3" />
                  {item.condition}
                </span>
              )}
            </div>
          </div>
          {item.price !== null && (
            <div className="flex-shrink-0 rounded-2xl bg-primary/90 backdrop-blur-sm px-5 py-3 border-2 border-white/30 shadow-xl">
              <p className="text-xs font-bold text-primary-foreground/80 uppercase tracking-wider">Price</p>
              <p className="text-2xl font-extrabold text-white">
                ${item.price}
              </p>
            </div>
          )}
        </div>

        {/* Description - Subtle */}
        {item.description && (
          <div className="rounded-xl bg-black/30 backdrop-blur-sm px-4 py-3 border border-white/20">
            <p className="text-sm text-white/90 line-clamp-2 leading-relaxed">{item.description}</p>
          </div>
        )}
      </div>

      {/* Premium Action Buttons */}
      {isTop && (
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-8 bg-gradient-to-t from-card/95 to-card/80 backdrop-blur-xl px-6 py-5 border-t border-border/50">
          <Button
            size="lg"
            variant="outline"
            className="h-16 w-16 rounded-full border-2 border-destructive/40 text-destructive hover:bg-destructive hover:text-destructive-foreground hover:border-destructive hover:scale-110 bg-background/80 shadow-lg transition-all"
            onClick={(e) => {
              e.stopPropagation()
              onSwipe("left")
            }}
          >
            <X className="h-7 w-7" />
            <span className="sr-only">Pass</span>
          </Button>
          <Button
            size="lg"
            className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground hover:scale-110 shadow-2xl shadow-primary/50 transition-all border-4 border-white/20"
            onClick={(e) => {
              e.stopPropagation()
              onSwipe("right")
            }}
          >
            <Heart className="h-8 w-8 fill-current" />
            <span className="sr-only">Like</span>
          </Button>
        </div>
      )}
    </div>
  )
}
