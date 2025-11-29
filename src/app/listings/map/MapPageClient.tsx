"use client"

import { ChaseCenterMap } from "../../../components/ChaseCenterMap"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface MapPageClientProps {
  listings: any[]
  currentUserId?: string
}

export function MapPageClient({ listings, currentUserId }: MapPageClientProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleMessageOwner = async (listing: any) => {
    if (listing.user?.id === currentUserId) {
      alert("This is your own listing!")
      return
    }
  
    setLoading(listing.id)
  
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          otherUserId: listing.user.id,
          listingId: listing.id // Pass listing ID
        }),
      })
  
      if (response.ok) {
        const { conversation } = await response.json()
        router.push(`/messages/${conversation.id}`)
      } else {
        alert("Failed to start conversation")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("An error occurred")
    } finally {
      setLoading(null)
    }
  }
  return (
    <ChaseCenterMap
      listings={listings}
      onMessageOwner={handleMessageOwner}
      currentUserId={currentUserId}
    />
  )
}