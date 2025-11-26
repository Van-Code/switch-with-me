"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"

interface ListingStatusToggleClientProps {
  listingId: string
  currentStatus: string
}

export function ListingStatusToggleClient({ 
  listingId, 
  currentStatus 
}: ListingStatusToggleClientProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    setLoading(true)

    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE"

    try {
      const response = await fetch(`/api/listings/${listingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert("Failed to update listing status")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant={currentStatus === "ACTIVE" ? "outline" : "default"}
      size="sm"
      onClick={handleToggle}
      disabled={loading}
      className="w-full"
    >
      {loading ? "Updating..." : currentStatus === "ACTIVE" ? "Set Inactive" : "Set Active"}
    </Button>
  )
}