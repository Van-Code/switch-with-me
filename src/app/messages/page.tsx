import { getServerSession } from "next-auth"
import { authOptions } from "../../lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "../../lib/prisma"
import { ConversationListItem } from "../../components/ConversationListItem"

export default async function MessagesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: {
          userId: session.user.id,
        },
      },
    },
    include: {
      participants: {
        include: {
          user: {
            include: {
              profile: true,
            },
          },
        },
      },
      messages: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
      listing: true, // Include listing
    },
    orderBy: {
      updatedAt: "desc",
    },
  })

  // Serialize dates
  const serializedConversations = conversations.map(conv => ({
    ...conv,
    createdAt: conv.createdAt.toISOString(),
    updatedAt: conv.updatedAt.toISOString(),
    participants: conv.participants.map(p => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
      user: {
        ...p.user,
        createdAt: p.user.createdAt.toISOString(),
        updatedAt: p.user.updatedAt.toISOString(),
        profile: p.user.profile ? {
          ...p.user.profile,
          createdAt: p.user.profile.createdAt.toISOString(),
          updatedAt: p.user.profile.updatedAt.toISOString(),
        } : null
      }
    })),
    messages: conv.messages.map(m => ({
      ...m,
      createdAt: m.createdAt.toISOString(),
    })),
    listing: conv.listing ? {
      ...conv.listing,
      gameDate: conv.listing.gameDate.toISOString(),
      createdAt: conv.listing.createdAt.toISOString(),
      updatedAt: conv.listing.updatedAt.toISOString(),
    } : null
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground">Your conversations</p>
      </div>

      {serializedConversations.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No conversations yet. Start by messaging someone from a listing!
        </div>
      ) : (
        <div className="space-y-2">
          {serializedConversations.map((conversation) => (
            <ConversationListItem
              key={conversation.id}
              conversation={conversation}
              currentUserId={session.user.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}