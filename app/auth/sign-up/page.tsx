"use client"

import React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignUpPage() {
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
        },
      })
      if (error) throw error
      // No email confirmation needed - redirect directly to discover
      router.push("/discover")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-6 md:p-10">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <Link href="/" className="group inline-flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
              <span className="text-2xl font-bold text-primary-foreground">T</span>
            </div>
            <span className="font-display text-3xl font-bold tracking-tight text-foreground">
              Thrin<span className="text-primary">Ge</span>
            </span>
          </Link>
        </div>
        <Card className="overflow-hidden border-2 border-border/50 shadow-2xl">
          <CardHeader className="space-y-1 bg-gradient-to-br from-card to-card/50 pb-8 pt-8">
            <CardTitle className="font-display text-center text-3xl font-extrabold">Join ThrinGe</CardTitle>
            <CardDescription className="text-center text-base">Create your account and start thrifting</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-5">
                <div className="grid gap-3">
                  <Label htmlFor="display-name" className="text-base font-semibold">Display Name</Label>
                  <Input
                    id="display-name"
                    type="text"
                    placeholder="Your name"
                    className="h-12"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="email" className="text-base font-semibold">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="h-12"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password" className="text-base font-semibold">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    className="h-12"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="repeat-password" className="text-base font-semibold">Confirm Password</Label>
                  <Input
                    id="repeat-password"
                    type="password"
                    placeholder="Confirm your password"
                    className="h-12"
                    required
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                  />
                </div>
                {error && (
                  <div className="rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm font-medium text-destructive" role="alert">
                    {error}
                  </div>
                )}
                <Button type="submit" size="lg" className="h-12 w-full shadow-xl shadow-primary/30" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </div>
              <div className="mt-6 text-center text-base text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="font-semibold text-primary underline-offset-4 transition-colors hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
