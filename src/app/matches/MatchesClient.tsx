"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface MatchesClientProps {
  currentUserId: string
}

export function MatchesClient({ currentUserId }: MatchesClientProps) {
  const router = useRouter()
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [messagingLoading, setMessagingLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    try {
      const response = await fetch("/api/matches")
      if (response.ok) {
        const data = await response.json()
        setMatches(data.matches)
      }
    } catch (error) {
      console.error("Error fetching matches:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleMessageOwner = async (otherUserId: string, listingId: string) => {
    setMessagingLoading(otherUserId)
  
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          otherUserId,
          listingId // Pass the listing ID
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
      setMessagingLoading(null)
    }
  }

  if (loading) {
    return <div>Loading matches...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Your Matches</h1>
        <p className="text-muted-foreground">Potential swaps based on your listings</p>
      </div>

      {matches.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No matches found yet.</p>
            <Link href="/listings/new">
              <Button>Create a listing to find matches</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {matches.map((match: any, index: number) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Match Score: {match.score}</CardTitle>
                  <Badge>{match.reason}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-semibold mb-2">Your Listing:</p>
                    <p className="text-sm">
                      Section {match.myListing.haveSection}, Row {match.myListing.haveRow}, Seat {match.myListing.haveSeat}
                    </p>
                    <p className="text-xs text-muted-foreground">{match.myListing.haveZone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-2">Their Listing:</p>
                    <p className="text-sm">
                      Section {match.matchedListing.haveSection}, Row {match.matchedListing.haveRow}, Seat {match.matchedListing.haveSeat}
                    </p>
                    <p className="text-xs text-muted-foreground">{match.matchedListing.haveZone}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Owner: {match.matchedListing.user.profile.firstName} {match.matchedListing.user.profile.lastInitial}.
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                <Button 
                  className="w-full"
                  onClick={() => handleMessageOwner(
                    match.matchedListing.user.id,
                    match.matchedListing.id // Pass listing ID
                  )}
                  disabled={messagingLoading === match.matchedListing.user.id}
                >
                  {messagingLoading === match.matchedListing.user.id ? "Opening..." : "Message Owner"}
                </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}