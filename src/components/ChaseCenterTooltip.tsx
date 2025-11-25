"use client"

import { useEffect, useState } from "react"

interface ChaseCenterTooltipProps {
  section: string | null
  zone: string
  listingCount: number
  mouseX: number
  mouseY: number
}

export function ChaseCenterTooltip({
  section,
  zone,
  listingCount,
  mouseX,
  mouseY,
}: ChaseCenterTooltipProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setPosition({ x: mouseX + 15, y: mouseY + 15 })
  }, [mouseX, mouseY])

  if (!section) return null

  return (
    <div
      className="fixed z-50 pointer-events-none bg-popover text-popover-foreground px-3 py-2 rounded-md shadow-lg border"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className="text-sm font-semibold">Section {section}</div>
      <div className="text-xs text-muted-foreground">{zone}</div>
      <div className="text-xs mt-1">
        {listingCount > 0 ? (
          <span className="text-green-600 font-medium">
            {listingCount} listing{listingCount !== 1 ? 's' : ''} available
          </span>
        ) : (
          <span className="text-muted-foreground">No listings</span>
        )}
      </div>
    </div>
  )
}