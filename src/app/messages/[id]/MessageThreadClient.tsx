"use client"

import { useState } from "react"
import { MessageThread } from "@/components/MessageThread"
import { useRouter } from "next/navigation"

interface Message {
  id: string
  text: string
  createdAt: Date | string
  sender: {
    id: string
    profile: {
      firstName: string
      lastInitial: string
    } | null
  }
}

interface MessageThreadClientProps {
  conversationId: string
  initialMessages: Message[]
  currentUserId: string
}

export function MessageThreadClient({
  conversationId,
  initialMessages,
  currentUserId,
}: MessageThreadClientProps) {
  const router = useRouter()

  const handleSendMessage = async (text: string) => {
    const response = await fetch(`/api/conversations/${conversationId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })

    if (!response.ok) {
      throw new Error("Failed to send message")
    }
  }

  return (
    <MessageThread
      conversationId={conversationId}
      messages={initialMessages}
      currentUserId={currentUserId}
      onSendMessage={handleSendMessage}
    />
  )
}