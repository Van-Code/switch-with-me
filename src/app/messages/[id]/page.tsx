import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { MessageThreadClient } from "./MessageThreadClient"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function ConversationPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: params.id },
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
        include: {
          sender: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  })

  if (!conversation) {
    return <div>Conversation not found</div>
  }

  // Check if user is participant
  const isParticipant = conversation.participants.some(
    p => p.userId === session.user.id
  )

  if (!isParticipant) {
    redirect("/messages")
  }

  const otherParticipant = conversation.participants.find(
    p => p.userId !== session.user.id
  )

  // Serialize dates
  const serializedMessages = conversation.messages.map(m => ({
    ...m,
    createdAt: m.createdAt.toISOString(),
    sender: {
      ...m.sender,
      createdAt: m.sender.createdAt.toISOString(),
      updatedAt: m.sender.updatedAt.toISOString(),
      profile: m.sender.profile ? {
        ...m.sender.profile,
        createdAt: m.sender.profile.createdAt.toISOString(),
        updatedAt: m.sender.profile.updatedAt.toISOString(),
      } : null
    }
  }))

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center gap-4">
        <Link href="/messages">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">
            {otherParticipant?.user.profile
              ? `${otherParticipant.user.profile.firstName} ${otherParticipant.user.profile.lastInitial}.`
              : "Unknown User"}
          </h1>
          <p className="text-sm text-muted-foreground">Conversation</p>
        </div>
      </div>

      <MessageThreadClient
        conversationId={conversation.id}
        initialMessages={serializedMessages}
        currentUserId={session.user.id}
      />
    </div>
  )
}