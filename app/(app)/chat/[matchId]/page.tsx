"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { useParams } from "next/navigation"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send, Loader2, MessageCircle } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface Message {
  id: string
  sender_id: string
  content: string
  created_at: string
  profiles: {
    display_name: string | null
  } | null
}

export default function ChatRoomPage() {
  const { matchId } = useParams<{ matchId: string }>()
  const { data, isLoading, mutate } = useSWR(
    `/api/messages/${matchId}`,
    fetcher,
    { refreshInterval: 3000 }
  )

  const messages: Message[] = data?.messages ?? []
  const userId = data?.userId
  const match = data?.match

  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages.length])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || isSending) return

    setIsSending(true)
    const content = newMessage
    setNewMessage("")

    try {
      await fetch(`/api/messages/${matchId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })
      mutate()
    } catch {
      setNewMessage(content)
    } finally {
      setIsSending(false)
    }
  }

  // Determine other user name from the match
  let otherName = "Chat"
  if (match && userId) {
    otherName =
      match.liker_id === userId
        ? "Seller"
        : "Buyer"
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="mx-auto flex h-[calc(100svh-64px)] max-w-3xl flex-col md:h-[calc(100svh-57px)]">
      {/* Premium Chat Header */}
      <div className="flex items-center gap-4 border-b-2 border-border/50 bg-gradient-to-r from-card to-card/50 px-6 py-4 backdrop-blur-sm">
        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" asChild>
          <Link href="/chat">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <p className="font-display text-xl font-bold text-foreground">{otherName}</p>
          <p className="text-xs font-medium text-muted-foreground">
            {messages.length} message{messages.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto bg-gradient-to-b from-background to-background/95 p-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-foreground">Start the conversation</p>
              <p className="mt-2 text-base text-muted-foreground">
                Say hi and discuss the item details!
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((msg) => {
              const isOwn = msg.sender_id === userId
              return (
                <div
                  key={msg.id}
                  className={cn("flex animate-in fade-in slide-in-from-bottom-2", isOwn ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-5 py-3 shadow-md transition-all hover:shadow-lg",
                      isOwn
                        ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground"
                        : "bg-card border border-border/50 text-foreground"
                    )}
                  >
                    <p className="text-base leading-relaxed">{msg.content}</p>
                    <p
                      className={cn(
                        "mt-2 text-xs font-medium",
                        isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                      )}
                    >
                      {new Date(msg.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Premium Message Input */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-3 border-t-2 border-border/50 bg-gradient-to-r from-card to-card/50 p-4 backdrop-blur-sm"
      >
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="h-12 flex-1 rounded-xl border-2 text-base"
          autoComplete="off"
        />
        <Button 
          type="submit" 
          size="icon" 
          className="h-12 w-12 rounded-xl shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40" 
          disabled={!newMessage.trim() || isSending}
        >
          <Send className="h-5 w-5" />
          <span className="sr-only">Send message</span>
        </Button>
      </form>
    </div>
  )
}
