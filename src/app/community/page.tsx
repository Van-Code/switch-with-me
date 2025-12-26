import React from "react"
import { CommunitySpotlight } from "@/components/CommunitySpotlight"

export default function CommunityPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Community</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Fans who are part of this community. These are the people making swaps happen.
          </p>
        </div>
        <CommunitySpotlight limit={60} showViewMore={false} />
      </div>
    </div>
  )
}
