"use client"

import React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Loader2, Save, User, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import { LocationMap } from "@/components/location-map"

interface Profile {
  id: string
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  location: string | null
  latitude: number | null
  longitude: number | null
  search_radius_miles: number | null
  location_enabled: boolean | null
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isSavingLocation, setIsSavingLocation] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [locationMessage, setLocationMessage] = useState<string | null>(null)
  const [locationEnabled, setLocationEnabled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const loadProfile = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      setProfile(data)
      setLocationEnabled(data?.location_enabled || false)
      setIsLoading(false)
    }

    loadProfile()
  }, [router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!profile) return

    setIsSaving(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    const supabase = createClient()

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: formData.get("display_name") as string,
        bio: formData.get("bio") as string,
        location: formData.get("location") as string,
        avatar_url: formData.get("avatar_url") as string,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id)

    if (error) {
      setMessage("Failed to update profile.")
    } else {
      setMessage("Profile updated!")
    }
    setIsSaving(false)
  }

  const handleLocationChange = async (lat: number, lng: number, radius: number) => {
    if (!profile) return

    setProfile({
      ...profile,
      latitude: lat,
      longitude: lng,
      search_radius_miles: radius,
    })
  }

  const handleSaveLocation = async () => {
    if (!profile) return

    setIsSavingLocation(true)
    setLocationMessage(null)

    try {
      const res = await fetch("/api/profile/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: profile.latitude,
          longitude: profile.longitude,
          search_radius_miles: profile.search_radius_miles,
          location_enabled: locationEnabled,
        }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      setLocationMessage("Location settings saved successfully!")
      setTimeout(() => setLocationMessage(null), 3000)
    } catch (error) {
      setLocationMessage(error instanceof Error ? error.message : "Failed to save location")
    } finally {
      setIsSavingLocation(false)
    }
  }

  const handleLocationEnabledChange = async (checked: boolean) => {
    setLocationEnabled(checked)
    
    if (!checked) {
      // Immediately save when disabling
      try {
        await fetch("/api/profile/location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location_enabled: false,
          }),
        })
      } catch (error) {
        console.error("Failed to disable location:", error)
      }
    }
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Premium Header */}
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
          <User className="h-4 w-4" />
          Your Account
        </div>
        <h1 className="font-display text-4xl font-extrabold text-foreground">Profile & Settings</h1>
        <p className="mt-2 text-base text-muted-foreground">Manage your account and location preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 h-12">
          <TabsTrigger value="profile" className="text-base">
            <User className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="location" className="text-base">
            <MapPin className="mr-2 h-4 w-4" />
            Location
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="overflow-hidden border-2 border-border/50 shadow-xl">
            <CardHeader className="bg-gradient-to-br from-card to-card/50 border-b border-border/50 pb-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25">
                  <User className="h-8 w-8" />
                </div>
                <div>
                  <CardTitle className="font-display text-2xl font-bold">
                    {profile?.display_name || "Your Profile"}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {profile?.location || "Location not set"}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="display_name" className="text-base font-semibold">Display Name</Label>
                  <Input
                    id="display_name"
                    name="display_name"
                    className="h-11"
                    placeholder="Enter your display name"
                    defaultValue={profile?.display_name ?? ""}
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="bio" className="text-base font-semibold">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    className="resize-none"
                    placeholder="Tell the community about your style and interests..."
                    defaultValue={profile?.bio ?? ""}
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="location" className="text-base font-semibold">Location (City, State)</Label>
                  <Input
                    id="location"
                    name="location"
                    className="h-11"
                    placeholder="City, State"
                    defaultValue={profile?.location ?? ""}
                  />
                  <p className="text-xs text-muted-foreground">
                    This is just a display name. Set your precise location in the Location tab.
                  </p>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="avatar_url" className="text-base font-semibold">Avatar URL</Label>
                  <Input
                    id="avatar_url"
                    name="avatar_url"
                    type="url"
                    className="h-11"
                    placeholder="https://example.com/avatar.jpg"
                    defaultValue={profile?.avatar_url ?? ""}
                  />
                </div>

                {message && (
                  <div className="rounded-lg bg-primary/10 border border-primary/30 px-4 py-3 text-sm font-medium text-primary">
                    {message}
                  </div>
                )}

                <Button type="submit" disabled={isSaving} size="lg" className="h-12 shadow-lg shadow-primary/30">
                  <Save className="mr-2 h-5 w-5" />
                  {isSaving ? "Saving..." : "Save Profile"}
                </Button>
              </form>

              <div className="mt-8 border-t border-border pt-6">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="h-12 w-full border-2 border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground hover:border-destructive" 
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Location Tab */}
        <TabsContent value="location">
          <Card className="overflow-hidden border-2 border-border/50 shadow-xl">
            <CardHeader className="bg-gradient-to-br from-card to-card/50 border-b border-border/50 pb-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25">
                  <MapPin className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <CardTitle className="font-display text-2xl font-bold">
                    Location-Based Matching
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Find thrift items near you
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Label htmlFor="location-toggle" className="text-sm font-medium">
                    {locationEnabled ? "Enabled" : "Disabled"}
                  </Label>
                  <Switch
                    id="location-toggle"
                    checked={locationEnabled}
                    onCheckedChange={handleLocationEnabledChange}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {locationEnabled ? (
                <div className="space-y-6">
                  <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                    <p className="text-sm text-foreground">
                      <strong>Location matching is active.</strong> Only items within your search radius will appear in your discover feed.
                    </p>
                  </div>

                  <LocationMap
                    initialLat={profile?.latitude ?? undefined}
                    initialLng={profile?.longitude ?? undefined}
                    initialRadius={profile?.search_radius_miles ?? 25}
                    onLocationChange={handleLocationChange}
                  />

                  {locationMessage && (
                    <div className="rounded-lg bg-primary/10 border border-primary/30 px-4 py-3 text-sm font-medium text-primary">
                      {locationMessage}
                    </div>
                  )}

                  <Button
                    onClick={handleSaveLocation}
                    disabled={isSavingLocation || !profile?.latitude || !profile?.longitude}
                    size="lg"
                    className="h-12 w-full shadow-lg shadow-primary/30"
                  >
                    <Save className="mr-2 h-5 w-5" />
                    {isSavingLocation ? "Saving..." : "Save Location Settings"}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-6 py-12 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <MapPin className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <div className="max-w-md">
                    <h3 className="font-display text-xl font-bold text-foreground">
                      Location Matching Disabled
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Enable location-based matching to find thrift items near you. 
                      You'll only see items from sellers within your chosen radius.
                    </p>
                  </div>
                  <Button
                    onClick={() => setLocationEnabled(true)}
                    size="lg"
                    className="shadow-lg shadow-primary/30"
                  >
                    <MapPin className="mr-2 h-5 w-5" />
                    Enable Location Matching
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
