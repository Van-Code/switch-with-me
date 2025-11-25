import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ProfileHeader } from "@/components/ProfileHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ListingCard } from "@/components/ListingCard"
import Link from "next/link"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      profile: true,
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

  const activeListings = user.listings.filter(l => l.status === "ACTIVE")
  const matchedListings = user.listings.filter(l => l.status === "MATCHED")

  // Serialize listings
  const serializedActiveListings = activeListings.map(l => ({
    ...l,
    gameDate: l.gameDate.toISOString(),
    createdAt: l.createdAt.toISOString(),
    updatedAt: l.updatedAt.toISOString(),
  }))

  const serializedMatchedListings = matchedListings.map(l => ({
    ...l,
    gameDate: l.gameDate.toISOString(),
    createdAt: l.createdAt.toISOString(),
    updatedAt: l.updatedAt.toISOString(),
  }))

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <ProfileHeader
          firstName={user.profile.firstName}
          lastInitial={user.profile.lastInitial}
          avatarUrl={user.profile.avatarUrl}
          bio={user.profile.bio}
          emailVerified={user.profile.emailVerified}
          phoneVerified={user.profile.phoneVerified}
          seasonTicketHolderVerified={user.profile.seasonTicketHolderVerified}
          successfulSwapsCount={user.profile.successfulSwapsCount}
        />
        <Button variant="outline">Edit Profile</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email:</span>
            <span>{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Member since:</span>
            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total listings:</span>
            <span>{user.listings.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Active listings:</span>
            <span>{activeListings.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Completed swaps:</span>
            <span>{user.profile.successfulSwapsCount}</span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Your Active Listings</h2>
          <Link href="/listings/new">
            <Button>Create New Listing</Button>
          </Link>
        </div>

        {serializedActiveListings.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              You don't have any active listings.
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serializedActiveListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                showOwner={false}
              />
            ))}
          </div>
        )}
      </div>

      {serializedMatchedListings.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Completed Swaps</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serializedMatchedListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                showOwner={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}