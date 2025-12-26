import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateViewPresignedUrl } from "@/lib/s3"

export const dynamic = "force-dynamic"

/**
 * GET /api/community-spotlight
 * Returns users who have opted into the community spotlight and have profile photos
 * Photos are randomized per request
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const limitStr = searchParams.get("limit")
    const limit = limitStr ? parseInt(limitStr) : 12 // Default to 12 photos

    // Fetch users who have opted in and have profile photos
    const users = await prisma.user.findMany({
      where: {
        profile: {
          showInCommunitySpotlight: true,
        },
        profilePhotos: {
          some: {}, // At least one photo
        },
      },
      select: {
        id: true,
        profilePhotos: {
          take: 1, // Just take the first photo for each user
          orderBy: {
            order: "asc",
          },
          select: {
            url: true,
          },
        },
      },
    })

    // Extract photo URLs and generate presigned URLs
    const photosWithUrls = await Promise.all(
      users
        .filter((user) => user.profilePhotos.length > 0)
        .map(async (user) => {
          const s3Key = user.profilePhotos[0].url
          const presignedUrl = await generateViewPresignedUrl(s3Key)
          return {
            id: user.id,
            photoUrl: presignedUrl,
          }
        })
    )

    // Randomize the order (Fisher-Yates shuffle)
    const shuffled = [...photosWithUrls]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    // Limit the results
    const limited = shuffled.slice(0, limit)

    return NextResponse.json({ photos: limited })
  } catch (error) {
    console.error("Error fetching community spotlight:", error)
    return NextResponse.json(
      { error: "Failed to fetch community spotlight" },
      { status: 500 }
    )
  }
}
