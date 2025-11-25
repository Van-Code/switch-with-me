"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

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

interface MessageThreadProps {
  conversationId: string
  messages: Message[]
  currentUserId: string
  onSendMessage: (text: string) => Promise<void>
}

export function MessageThread({
  conversationId,
  messages,
  currentUserId,
  onSendMessage,
}: MessageThreadProps) {
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return

    setSending(true)
    try {
      await onSendMessage(newMessage)
      setNewMessage("")
    } catch (error) {
      console.error("Failed to send message:", error)
    } finally {
      setSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isOwnMessage = message.sender.id === currentUserId
          
          return (
            <div
              key={message.id}
              className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
            >
              <Card className={`max-w-[70%] ${isOwnMessage ? "bg-primary text-primary-foreground" : ""}`}>
                <CardContent className="p-3">
                  {!isOwnMessage && message.sender.profile && (
                    <p className="text-xs font-semibold mb-1">
                      {message.sender.profile.firstName} {message.sender.profile.lastInitial}.
                    </p>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p className={`text-xs mt-1 ${isOwnMessage ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {new Date(message.createdAt).toLocaleTimeString([], { 
                      hour: "2-digit", 
                      minute: "2-digit" 
                    })}
                  </p>
                </CardContent>
              </Card>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <div className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="resize-none"
            rows={2}
          />
          <Button onClick={handleSend} disabled={sending || !newMessage.trim()}>
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}