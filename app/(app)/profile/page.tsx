"use client"

import React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Save, User } from "lucide-react"
import { useRouter } from "next/navigation"

interface Profile {
  id: string
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  location: string | null
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
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
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Premium Header */}
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
          <User className="h-4 w-4" />
          Your Account
        </div>
        <h1 className="font-display text-4xl font-extrabold text-foreground">Profile</h1>
        <p className="mt-2 text-base text-muted-foreground">Manage your account settings and preferences</p>
      </div>

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
              <Label htmlFor="location" className="text-base font-semibold">Location</Label>
              <Input
                id="location"
                name="location"
                className="h-11"
                placeholder="City, State"
                defaultValue={profile?.location ?? ""}
              />
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
    </div>
  )
}
