import { requireUserId } from "@/lib/auth-api"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { NotificationSettings } from "@/components/notification-settings"
import { CommunitySpotlightSettings } from "@/components/CommunitySpotlightSettings"
import { DeleteAccountSection } from "@/components/DeleteAccountSection"

export default async function SettingsPage() {
  const auth = await requireUserId()
  if (!auth.ok) {
    redirect("/auth/signin")
  }
  const userId = auth.userId
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      profilePhotos: true,
      listings: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  })

  if (!user || !user.profile) {
    redirect("/auth/signin")
  }

  const activeListings = user.listings.filter(
    (l: { status: string }) => l.status === "ACTIVE"
  )
  const inactiveListings = user.listings.filter(
    (l: { status: string }) => l.status === "INACTIVE"
  )
  const matchedListings = user.listings.filter(
    (l: { status: string }) => l.status === "MATCHED"
  )

  const hasProfilePhotos = user.profilePhotos.length > 0

  return (
    <div className="space-y-8">
      <NotificationSettings
        initialEmailNotificationsEnabled={user.emailNotificationsEnabled}
      />

      <CommunitySpotlightSettings
        initialShowInCommunitySpotlight={user.profile.showInCommunitySpotlight}
        hasProfilePhotos={hasProfilePhotos}
      />

      <DeleteAccountSection />
    </div>
  )
}
