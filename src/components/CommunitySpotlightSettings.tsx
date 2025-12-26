"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface CommunitySpotlightSettingsProps {
  initialShowInCommunitySpotlight: boolean
  hasProfilePhotos: boolean
}

export function CommunitySpotlightSettings({
  initialShowInCommunitySpotlight,
  hasProfilePhotos,
}: CommunitySpotlightSettingsProps) {
  const [showInCommunitySpotlight, setShowInCommunitySpotlight] = useState(
    initialShowInCommunitySpotlight
  )
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  const handleToggle = async (checked: boolean) => {
    setIsUpdating(true)

    try {
      const response = await fetch("/api/profile/community-spotlight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          showInCommunitySpotlight: checked,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update community spotlight setting")
      }

      setShowInCommunitySpotlight(checked)

      toast({
        title: "Settings updated",
        description: checked
          ? "Your photo will appear in the Community section"
          : "Your photo has been removed from the Community section",
      })
    } catch (error) {
      console.error("Error updating community spotlight setting:", error)
      toast({
        title: "Error",
        description: "Failed to update community spotlight setting. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Community Spotlight</CardTitle>
        <CardDescription>
          Show your photo in the Community section as part of our fan community
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between space-x-2">
          <Label
            htmlFor="community-spotlight"
            className="flex flex-col space-y-1 cursor-pointer"
          >
            <span className="font-medium">Show in Community</span>
            <span className="font-normal text-sm text-muted-foreground">
              {hasProfilePhotos
                ? "Display your photo in the Community section on the homepage"
                : "Add a profile photo to enable this feature"}
            </span>
          </Label>
          <Switch
            id="community-spotlight"
            checked={showInCommunitySpotlight}
            onCheckedChange={handleToggle}
            disabled={isUpdating || !hasProfilePhotos}
          />
        </div>
      </CardContent>
    </Card>
  )
}
