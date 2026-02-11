"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Leaf, Heart, MessageCircle, ShoppingBag } from "lucide-react"
import Image from "next/image"

const HERO_IMAGES = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0nMh2p7FYffIDqDAGwQnrzvUTatQ9WcJmFA&s",
  "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSdIByAyM_8HhbUdjImiEKc2hdN3_GGoQVY1N4DmW4pnzVMq2ixLSdQd5GO2_UvS6NK5s3PB6-Twssjngp4Hi9zOFS3YwZrElqxS72Vdp0epxEFsbHRYpWN&usqp=CAc",
  "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQ3DSBXOD3uD9CY2feHOYPFgsdLzUowd9uFobYJ_b-8IiM4Q4y_uREklnJ1l9aSUMtI_9YtKUgk55RMK3FFgqqgcLJGPJi0NuXpVeoxTFWGs5Ug2Q9mn6WEwF9IXv7Q_H1InC5PYO8&usqp=CAc",
  "https://di2ponv0v5otw.cloudfront.net/posts/2023/09/17/6507cc9b52eee182521c2723/m_6507cd0f91e053c9f85c6756.jpg",
  "https://di2ponv0v5otw.cloudfront.net/posts/2025/03/29/67e7ac81006e43b6ff7183d9/m_67e7ac81006e43b6ff7183da.jpg",
]

export default function LandingPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % HERO_IMAGES.length)
    }, 3000) // Change image every 3 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex min-h-svh flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-2xl font-bold tracking-tight text-foreground">
            Thrin<span className="text-primary">Ge</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-6 py-20 lg:flex-row lg:py-28">
            <div className="flex flex-1 flex-col gap-6">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                <Leaf className="h-4 w-4" />
                Sustainable Fashion
              </div>
              <h1 className="font-display text-balance text-5xl font-bold leading-tight tracking-tight text-foreground lg:text-6xl">
                Swipe. Match.{" "}
                <span className="text-primary">Thrift.</span>
              </h1>
              <p className="max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground">
                Discover unique pre-loved clothing through a swipe experience you already love.
                Match with pieces that fit your style, connect with sellers, and give fashion a second life.
              </p>
              <div className="flex gap-3 pt-2">
                <Button size="lg" asChild>
                  <Link href="/auth/sign-up">Start Swiping</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/auth/login">I have an account</Link>
                </Button>
              </div>
            </div>
            <div className="relative flex-1">
              <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl border border-border shadow-2xl shadow-primary/10">
                {HERO_IMAGES.map((src, index) => (
                  <div
                    key={src}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                      index === currentImageIndex ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <Image
                      src={src}
                      alt={`Thrifted clothing item ${index + 1}`}
                      fill
                      className="object-cover"
                      priority={index === 0}
                      unoptimized
                    />
                  </div>
                ))}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/80 to-transparent p-6 z-10">
                  <p className="font-display text-lg font-semibold text-card">Pre-loved Fashion</p>
                  <p className="text-sm text-card/80">Curated &middot; Sustainable</p>
                </div>
                {/* Carousel indicators */}
                <div className="absolute bottom-20 left-0 right-0 z-10 flex justify-center gap-2">
                  {HERO_IMAGES.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-1.5 rounded-full transition-all ${
                        index === currentImageIndex
                          ? "w-8 bg-card"
                          : "w-1.5 bg-card/40"
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="border-t border-border bg-card">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="mb-14 text-center">
              <h2 className="font-display text-balance text-3xl font-bold tracking-tight text-card-foreground lg:text-4xl">
                How ThrinGe Works
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-pretty text-muted-foreground">
                Three simple steps to find your next favorite piece
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <StepCard
                icon={<ShoppingBag className="h-6 w-6" />}
                step="01"
                title="List or Browse"
                description="Upload your thrifted finds or browse a curated feed of unique pieces from your community."
              />
              <StepCard
                icon={<Heart className="h-6 w-6" />}
                step="02"
                title="Swipe & Match"
                description="Swipe right on pieces you love. When there's mutual interest, it's a match!"
              />
              <StepCard
                icon={<MessageCircle className="h-6 w-6" />}
                step="03"
                title="Connect & Trade"
                description="Chat with matched sellers, negotiate details, and give pre-loved clothes a new home."
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-6xl px-6 py-20 text-center">
            <h2 className="font-display text-balance text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
              Ready to thrift smarter?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-pretty text-muted-foreground">
              Join a community that cares about sustainable fashion. Your next favorite outfit is one swipe away.
            </p>
            <Button size="lg" className="mt-8" asChild>
              <Link href="/auth/sign-up">Create Free Account</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <p className="font-display text-sm font-semibold text-card-foreground">
            Thrin<span className="text-primary">Ge</span>
          </p>
          <p className="text-sm text-muted-foreground">Sustainable fashion, one swipe at a time.</p>
        </div>
      </footer>
    </div>
  )
}

function StepCard({
  icon,
  step,
  title,
  description,
}: {
  icon: React.ReactNode
  step: string
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-background p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <span className="font-display text-sm font-bold text-muted-foreground">{step}</span>
      </div>
      <h3 className="font-display text-xl font-semibold text-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  )
}
