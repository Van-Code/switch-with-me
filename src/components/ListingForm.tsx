"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { useRouter } from "next/navigation"

export function ListingForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    gameDate: "",
    haveSection: "",
    haveRow: "",
    haveSeat: "",
    haveZone: "",
    faceValue: "",
    wantZones: "",
    wantSections: "",
    willingToAddCash: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          gameDate: new Date(formData.gameDate).toISOString(),
          faceValue: parseFloat(formData.faceValue),
          wantZones: formData.wantZones.split(",").map(z => z.trim()).filter(Boolean),
          wantSections: formData.wantSections.split(",").map(s => s.trim()).filter(Boolean),
        }),
      })

      if (response.ok) {
        router.push("/listings")
      } else {
        alert("Failed to create listing")
      }
    } catch (error) {
      console.error("Error creating listing:", error)
      alert("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Listing</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="gameDate">Game Date</Label>
            <Input
              id="gameDate"
              type="date"
              required
              value={formData.gameDate}
              onChange={(e) => setFormData({ ...formData, gameDate: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="haveSection">Section</Label>
              <Input
                id="haveSection"
                required
                placeholder="101"
                value={formData.haveSection}
                onChange={(e) => setFormData({ ...formData, haveSection: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="haveRow">Row</Label>
              <Input
                id="haveRow"
                required
                placeholder="A"
                value={formData.haveRow}
                onChange={(e) => setFormData({ ...formData, haveRow: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="haveSeat">Seat</Label>
              <Input
                id="haveSeat"
                required
                placeholder="1"
                value={formData.haveSeat}
                onChange={(e) => setFormData({ ...formData, haveSeat: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="haveZone">Zone</Label>
            <Input
              id="haveZone"
              required
              placeholder="Lower Bowl Corner"
              value={formData.haveZone}
              onChange={(e) => setFormData({ ...formData, haveZone: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="faceValue">Face Value ($)</Label>
            <Input
              id="faceValue"
              type="number"
              step="0.01"
              required
              placeholder="75.00"
              value={formData.faceValue}
              onChange={(e) => setFormData({ ...formData, faceValue: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="wantZones">Want Zones (comma-separated)</Label>
            <Input
              id="wantZones"
              placeholder="Lower Bowl Center, Lower Bowl Corner"
              value={formData.wantZones}
              onChange={(e) => setFormData({ ...formData, wantZones: e.target.value })}
            />
            <p className="text-xs text-muted-foreground mt-1">Leave empty to accept any zone</p>
          </div>

          <div>
            <Label htmlFor="wantSections">Want Sections (comma-separated)</Label>
            <Input
              id="wantSections"
              placeholder="101, 102, 103"
              value={formData.wantSections}
              onChange={(e) => setFormData({ ...formData, wantSections: e.target.value })}
            />
            <p className="text-xs text-muted-foreground mt-1">Leave empty to accept any section</p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="willingToAddCash"
              checked={formData.willingToAddCash}
              onChange={(e) => setFormData({ ...formData, willingToAddCash: e.target.checked })}
              className="h-4 w-4"
            />
            <Label htmlFor="willingToAddCash" className="font-normal">
              Willing to add cash for upgrade
            </Label>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating..." : "Create Listing"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}