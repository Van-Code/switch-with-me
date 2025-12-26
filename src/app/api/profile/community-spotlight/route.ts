import { NextResponse } from "next/server"
import { requireUserId } from "@/lib/auth-api"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

/**
 * POST /api/profile/community-spotlight
 * Updates the user's Community Spotlight opt-in preference
 */
export async function POST(req: Request) {
  try {
    const auth = await requireUserId()
    if (!auth.ok) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const userId = auth.userId

    const body = await req.json()
    const { showInCommunitySpotlight } = body

    if (typeof showInCommunitySpotlight !== "boolean") {
      return NextResponse.json(
        { error: "showInCommunitySpotlight must be a boolean" },
        { status: 400 }
      )
    }

    // Update the profile
    const profile = await prisma.profile.update({
      where: { userId },
      data: { showInCommunitySpotlight },
    })

    return NextResponse.json({ success: true, profile })
  } catch (error) {
    console.error("Error updating community spotlight setting:", error)
    return NextResponse.json(
      { error: "Failed to update community spotlight setting" },
      { status: 500 }
    )
  }
}
