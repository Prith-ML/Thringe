import React from "react"
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ThrinGe - Swipe. Match. Thrift.',
  description: 'Discover unique thrifted clothing through a Tinder-style swipe experience. Match with pieces you love and connect with sellers in your community.',
}

export const viewport: Viewport = {
  themeColor: '#2fa87e',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
