"use client"

import React, { useEffect, useRef } from "react"
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix for default marker icon in Leaflet with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

interface LeafletMapProps {
  latitude: number
  longitude: number
  radius: number
  onLocationUpdate: (lat: number, lng: number) => void
}

// Component to handle map clicks
function MapClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onClick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

// Draggable marker component
function DraggableMarker({
  position,
  onDragEnd,
}: {
  position: [number, number]
  onDragEnd: (lat: number, lng: number) => void
}) {
  const markerRef = useRef<L.Marker>(null)

  useEffect(() => {
    const marker = markerRef.current
    if (marker) {
      marker.on("dragend", () => {
        const newPos = marker.getLatLng()
        onDragEnd(newPos.lat, newPos.lng)
      })
    }
  }, [onDragEnd])

  return <Marker position={position} draggable={true} ref={markerRef} />
}

export default function LeafletMap({
  latitude,
  longitude,
  radius,
  onLocationUpdate,
}: LeafletMapProps) {
  // Convert miles to meters for the circle
  const radiusInMeters = radius * 1609.34

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={10}
      className="h-[400px] w-full"
      scrollWheelZoom={true}
      style={{ zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <DraggableMarker
        position={[latitude, longitude]}
        onDragEnd={onLocationUpdate}
      />
      
      <Circle
        center={[latitude, longitude]}
        radius={radiusInMeters}
        pathOptions={{
          color: "#10b981",
          fillColor: "#10b981",
          fillOpacity: 0.15,
          weight: 2,
        }}
      />
      
      <MapClickHandler onClick={onLocationUpdate} />
    </MapContainer>
  )
}
