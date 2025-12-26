"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

interface CommunityPhoto {
  id: string
  photoUrl: string
}

interface CommunitySpotlightProps {
  limit?: number
  showViewMore?: boolean
}

export function CommunitySpotlight({ limit = 12, showViewMore = false }: CommunitySpotlightProps) {
  const [photos, setPhotos] = useState<CommunityPhoto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const response = await fetch(`/api/community-spotlight?limit=${limit}`)
        if (response.ok) {
          const data = await response.json()
          setPhotos(data.photos || [])
        }
      } catch (error) {
        console.error("Error fetching community spotlight:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPhotos()
  }, [limit])

  if (loading) {
    return (
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-6 text-center">Community</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="aspect-square bg-slate-200 animate-pulse rounded" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (photos.length === 0) {
    return null
  }

  return (
    <section className="py-12 bg-slate-50" aria-label="Community member photos">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-6 text-center">Community</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="aspect-square relative overflow-hidden rounded"
              role="img"
              aria-label="Community member photo"
            >
              <Image
                src={photo.photoUrl}
                alt="Community member photo"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 16vw"
              />
            </div>
          ))}
        </div>
        {showViewMore && photos.length >= limit && (
          <div className="mt-6 text-center">
            <Link
              href="/community"
              className="inline-block text-sm text-slate-600 hover:text-slate-900 underline"
            >
              View more
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
