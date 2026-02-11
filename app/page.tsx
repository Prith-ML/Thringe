"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Leaf, Heart, MessageCircle, ShoppingBag, TrendingUp, Users, Sparkles } from "lucide-react"
import Image from "next/image"

const HERO_IMAGES = [
  "https://media-photos.depop.com/b1/44801393/3377630714_50c248d07b114816ad9f3f1894fd0c8e/P8.jpg",
  "https://i.ebayimg.com/00/s/MTYwMFgxNjAw/z/UAMAAOSwewpmTsmX/$_12.JPG?set_id=880000500F",
  "https://media-photos.depop.com/b1/16723467/1884851578_4fea3bd54c84494d908f7d9d1da29441/P0.jpg",
  "https://di2ponv0v5otw.cloudfront.net/posts/2023/09/17/6507cc9b52eee182521c2723/m_6507cd0f91e053c9f85c6756.jpg",
  "https://di2ponv0v5otw.cloudfront.net/posts/2025/03/29/67e7ac81006e43b6ff7183d9/m_67e7ac81006e43b6ff7183da.jpg",
]

export default function LandingPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % HERO_IMAGES.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex min-h-svh flex-col bg-gradient-to-b from-background to-background/95">
      {/* Premium Nav */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="group flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-2xl font-bold tracking-tight text-foreground">
              Thrin<span className="text-primary">Ge</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="lg" className="hidden sm:inline-flex" asChild>
              <Link href="/auth/login">Log in</Link>
            </Button>
            <Button size="lg" className="shadow-lg shadow-primary/25" asChild>
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section - Enhanced */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          {/* Background gradient decoration */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
          <div className="absolute right-0 top-0 -z-10 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
          
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 px-6 lg:flex-row">
            <div className="flex flex-1 flex-col gap-8 text-center lg:text-left">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2 text-sm font-semibold text-primary shadow-sm mx-auto lg:mx-0">
                <Sparkles className="h-4 w-4" />
                Sustainable Fashion Marketplace
              </div>
              <h1 className="font-display text-balance text-6xl font-extrabold leading-[1.1] tracking-tight text-foreground lg:text-7xl xl:text-8xl">
                Swipe. Match.{" "}
                <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Thrift.
                </span>
              </h1>
              <p className="mx-auto max-w-2xl text-pretty text-xl leading-relaxed text-muted-foreground lg:mx-0 lg:text-2xl">
                Discover unique pre-loved clothing through an intuitive swipe experience. 
                Match with pieces that fit your style and give fashion a second life.
              </p>
              <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center">
                <Button size="lg" className="h-14 text-lg shadow-xl shadow-primary/30 transition-all hover:shadow-2xl hover:shadow-primary/40" asChild>
                  <Link href="/auth/sign-up">
                    Start Swiping
                    <Heart className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 text-lg border-2" asChild>
                  <Link href="/auth/login">Sign In</Link>
                </Button>
              </div>
              
              {/* Stats */}
              <div className="mt-8 grid grid-cols-3 gap-6 lg:gap-8">
                <div className="text-center lg:text-left">
                  <p className="font-display text-3xl font-bold text-foreground lg:text-4xl">10+</p>
                  <p className="mt-1 text-sm text-muted-foreground">Categories</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="font-display text-3xl font-bold text-foreground lg:text-4xl">100%</p>
                  <p className="mt-1 text-sm text-muted-foreground">Sustainable</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="font-display text-3xl font-bold text-foreground lg:text-4xl">Top 3</p>
                  <p className="mt-1 text-sm text-muted-foreground">Platform</p>
                </div>
              </div>
            </div>
            
            <div className="relative flex-1">
              {/* Floating card showcase */}
              <div className="relative mx-auto w-full max-w-md">
                {/* Decorative elements */}
                <div className="absolute -left-4 top-1/4 h-24 w-24 rounded-full bg-primary/20 blur-2xl" />
                <div className="absolute -right-4 bottom-1/4 h-32 w-32 rounded-full bg-primary/15 blur-3xl" />
                
                {/* Main card */}
                <div className="group relative aspect-[3/4] w-full overflow-hidden rounded-3xl border border-border/50 bg-card shadow-2xl shadow-primary/10 transition-all hover:shadow-3xl hover:shadow-primary/20">
                  {HERO_IMAGES.map((src, index) => (
                    <div
                      key={src}
                      className={`absolute inset-0 transition-opacity duration-1000 ${
                        index === currentImageIndex ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <Image
                        src={src}
                        alt={`Thrifted fashion ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority={index === 0}
                        unoptimized
                      />
                    </div>
                  ))}
                  
                  {/* Minimal gradient overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  {/* Compact info */}
                  <div className="absolute inset-x-0 bottom-0 p-6 z-10">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="font-display text-xl font-bold text-white drop-shadow-lg">Pre-loved Fashion</p>
                        <p className="text-sm text-white/90 drop-shadow">Curated • Sustainable</p>
                      </div>
                      <div className="rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 border border-white/30">
                        <p className="text-sm font-semibold text-white">Trending</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Elegant indicators */}
                  <div className="absolute bottom-24 left-0 right-0 z-10 flex justify-center gap-2">
                    {HERO_IMAGES.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-2 rounded-full transition-all ${
                          index === currentImageIndex
                            ? "w-8 bg-white shadow-lg"
                            : "w-2 bg-white/50"
                        }`}
                        aria-label={`View image ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works - Premium Design */}
        <section className="relative border-t border-border/40 bg-gradient-to-b from-card/50 to-background py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-16 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                <TrendingUp className="h-4 w-4" />
                Simple Process
              </div>
              <h2 className="font-display text-balance text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl">
                How ThrinGe Works
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Three simple steps to discover sustainable fashion and connect with your community
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3 lg:gap-12">
              <StepCard
                icon={<ShoppingBag className="h-7 w-7" />}
                step="01"
                title="List or Browse"
                description="Upload your thrifted finds or explore a curated feed of unique pieces from your local community."
              />
              <StepCard
                icon={<Heart className="h-7 w-7" />}
                step="02"
                title="Swipe & Match"
                description="Swipe right on pieces you love. When there's mutual interest between buyer and seller, it's a match!"
              />
              <StepCard
                icon={<MessageCircle className="h-7 w-7" />}
                step="03"
                title="Connect & Trade"
                description="Chat with matched users, negotiate details, and give pre-loved clothes a new home."
              />
            </div>
          </div>
        </section>

        {/* CTA Section - Enhanced */}
        <section className="relative border-t border-border/40 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
          <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          
          <div className="relative mx-auto max-w-4xl px-6 py-24 text-center lg:py-32">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-2 text-sm font-semibold text-primary">
              <Users className="h-4 w-4" />
              Join the Movement
            </div>
            <h2 className="font-display text-balance text-5xl font-extrabold tracking-tight text-foreground lg:text-6xl">
              Ready to thrift{" "}
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                smarter?
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground lg:text-xl">
              Join a community that cares about sustainable fashion. 
              Your next favorite outfit is one swipe away.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="h-14 text-lg shadow-2xl shadow-primary/30" asChild>
                <Link href="/auth/sign-up">
                  Create Free Account
                  <Sparkles className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 text-lg border-2" asChild>
                <Link href="/auth/login">Sign In Instead</Link>
              </Button>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                100% Free to Use
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                Secure Messaging
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                Local Community
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Premium Footer */}
      <footer className="border-t border-border/40 bg-gradient-to-b from-card/50 to-card">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-display text-lg font-bold text-foreground">
                  Thrin<span className="text-primary">Ge</span>
                </p>
                <p className="text-xs text-muted-foreground">Sustainable fashion marketplace</p>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-sm font-medium text-muted-foreground">
                Sustainable fashion, one swipe at a time.
              </p>
              <p className="mt-1 text-xs text-muted-foreground/70">
                © 2026 ThrinGe. Built with care for the planet.
              </p>
            </div>
          </div>
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
    <div className="group relative flex flex-col gap-6 rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/50 p-8 shadow-lg transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10">
      {/* Step number badge */}
      <div className="absolute -top-4 left-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 font-display text-xl font-bold text-primary-foreground shadow-lg shadow-primary/25">
          {step}
        </div>
      </div>
      
      {/* Icon */}
      <div className="mt-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm transition-transform group-hover:scale-110 group-hover:shadow-md group-hover:shadow-primary/20">
        {icon}
      </div>
      
      {/* Content */}
      <div className="space-y-3">
        <h3 className="font-display text-2xl font-bold text-foreground">{title}</h3>
        <p className="text-base leading-relaxed text-muted-foreground">{description}</p>
      </div>
      
      {/* Hover decoration */}
      <div className="absolute -bottom-px left-0 right-0 h-1 rounded-b-2xl bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  )
}
