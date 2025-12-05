import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

interface PageProps {
  searchParams: {
    listingId?: string
  }
}

export default async function ListingMessagePage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions)

  // Ensure user is authenticated
  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const { listingId } = searchParams

  // If no listing ID provided, redirect to listings page
  if (!listingId) {
    redirect("/listings")
  }

  try {
    // Fetch the listing
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        team: true,
      },
    })

    // Listing doesn't exist or is inactive - redirect with appropriate message
    if (!listing || listing.status !== "ACTIVE") {
      // For now, redirect to listings page
      // In a real implementation, you'd set a toast/flash message here
      const params = new URLSearchParams()

      if (listing?.team?.slug) {
        params.set("team", listing.team.slug)
      }

      const redirectUrl = params.toString()
        ? `/listings?${params.toString()}&toast=listing-unavailable`
        : "/listings?toast=listing-unavailable"

      redirect(redirectUrl)
    }

    // Check if user is trying to message their own listing
    if (listing.userId === session.user.id) {
      redirect(`/listings?toast=own-listing`)
    }

    // Check if a conversation already exists for this listing + user combination
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        listingId: listing.id,
        participants: {
          some: {
            userId: session.user.id,
          },
        },
      },
      select: {
        id: true,
      },
    })

    if (existingConversation) {
      // Conversation already exists, redirect to it
      redirect(`/messages/${existingConversation.id}`)
    }

    // Check if conversation exists between these two users (without listing)
    const existingUserConversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          {
            participants: {
              some: {
                userId: session.user.id,
              },
            },
          },
          {
            participants: {
              some: {
                userId: listing.userId,
              },
            },
          },
        ],
      },
      select: {
        id: true,
        listingId: true,
      },
    })

    if (existingUserConversation) {
      // If the conversation doesn't have a listing, update it
      if (!existingUserConversation.listingId) {
        await prisma.conversation.update({
          where: { id: existingUserConversation.id },
          data: { listingId: listing.id },
        })
      }

      // Redirect to existing conversation
      redirect(`/messages/${existingUserConversation.id}`)
    }

    // No existing conversation - create one
    const conversation = await prisma.conversation.create({
      data: {
        listingId: listing.id,
        participants: {
          create: [
            { userId: session.user.id },
            { userId: listing.userId },
          ],
        },
      },
      select: {
        id: true,
      },
    })

    // Log free transaction for analytics (if you have credit tracking)
    await prisma.creditTransaction.create({
      data: {
        userId: session.user.id,
        amount: 0,
        note: `Free conversation about listing ${listing.id}`,
      },
    }).catch(() => {
      // Silently fail if transaction logging fails
    })

    // Redirect to the new conversation
    redirect(`/messages/${conversation.id}`)
  } catch (error) {
    console.error("Error in listing message handler:", error)
    // On error, redirect to listings page
    redirect("/listings?toast=error")
  }
}
