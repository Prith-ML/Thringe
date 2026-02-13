"use client"

import React, { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { MapPin, Loader2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface LocationMapProps {
  initialLat?: number
  initialLng?: number
  initialRadius?: number
  onLocationChange?: (lat: number, lng: number, radius: number) => void
  className?: string
}

// Dynamically import the actual map component to avoid SSR issues
const LeafletMap = dynamic(() => import("./location-map-leaflet"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full rounded-2xl border-2 border-border/50 bg-muted animate-pulse flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  ),
})

export function LocationMap({
  initialLat,
  initialLng,
  initialRadius = 25,
  onLocationChange,
  className,
}: LocationMapProps) {
  const [latitude, setLatitude] = useState<number | null>(initialLat || null)
  const [longitude, setLongitude] = useState<number | null>(initialLng || null)
  const [radius, setRadius] = useState(initialRadius)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      return
    }

    setIsLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        setLatitude(lat)
        setLongitude(lng)
        setIsLoading(false)
        onLocationChange?.(lat, lng, radius)
      },
      (error) => {
        setIsLoading(false)
        setError(
          error.code === 1
            ? "Location access denied. Please enable location permissions."
            : "Unable to retrieve your location. Please try again."
        )
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }

  const handleRadiusChange = (value: number[]) => {
    const newRadius = value[0]
    setRadius(newRadius)
    if (latitude !== null && longitude !== null) {
      onLocationChange?.(latitude, longitude, newRadius)
    }
  }

  const handleLocationUpdate = (lat: number, lng: number) => {
    setLatitude(lat)
    setLongitude(lng)
    onLocationChange?.(lat, lng, radius)
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Map Container */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-border/50 shadow-xl">
        {latitude !== null && longitude !== null ? (
          <LeafletMap
            latitude={latitude}
            longitude={longitude}
            radius={radius}
            onLocationUpdate={handleLocationUpdate}
          />
        ) : (
          <div className="h-[400px] w-full bg-muted flex items-center justify-center">
            {!isLoading && (
              <div className="flex flex-col items-center gap-4 text-center p-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">
                    Enable Location Matching
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                    Allow location access to find thrift items near you
                  </p>
                </div>
                <Button size="lg" onClick={handleGetLocation} className="shadow-lg shadow-primary/30">
                  <MapPin className="mr-2 h-5 w-5" />
                  Get My Location
                </Button>
              </div>
            )}
          </div>
        )}
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-[1000]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm font-medium text-foreground">Getting your location...</p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-destructive" />
          <div className="flex-1">
            <p className="text-sm font-medium text-destructive">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 h-8 text-destructive hover:bg-destructive/20"
              onClick={handleGetLocation}
            >
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Radius Control */}
      {latitude !== null && longitude !== null && (
        <div className="space-y-4 rounded-xl border-2 border-border/50 bg-gradient-to-br from-card to-card/50 p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-base font-semibold text-foreground">Search Radius</label>
              <p className="text-sm text-muted-foreground mt-1">
                Find items within this distance
              </p>
            </div>
            <div className="rounded-full bg-primary/10 px-4 py-2 border border-primary/30">
              <span className="font-display text-2xl font-bold text-primary">{radius}</span>
              <span className="ml-1 text-sm font-semibold text-primary">miles</span>
            </div>
          </div>

          <div className="space-y-2">
            <Slider
              value={[radius]}
              onValueChange={handleRadiusChange}
              min={5}
              max={100}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>5 miles</span>
              <span>100 miles</span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleGetLocation}
            className="w-full border-2"
          >
            <MapPin className="mr-2 h-4 w-4" />
            Update My Location
          </Button>
        </div>
      )}

      {/* Instructions */}
      {latitude !== null && longitude !== null && (
        <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">💡 Pro tip:</p>
          <ul className="mt-2 space-y-1 ml-4 list-disc">
            <li>Drag the marker to adjust your location manually</li>
            <li>Click anywhere on the map to set a new location</li>
            <li>Use the slider to change your search radius</li>
            <li>Only items within the circle will appear in your feed</li>
          </ul>
        </div>
      )}
    </div>
  )
}
