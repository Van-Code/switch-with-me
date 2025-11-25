import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ArrowRight, Shield, MessageSquare, Search } from "lucide-react"

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <div className="space-y-12">
      <section className="text-center space-y-4 py-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Valkyries Seat Swap
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Connect with fellow Golden State Valkyries fans to swap tickets and find your perfect seats
        </p>
        <div className="flex gap-4 justify-center pt-4">
          {session ? (
            <>
              <Link href="/listings">
                <Button size="lg">Browse Listings</Button>
              </Link>
              <Link href="/listings/new">
                <Button size="lg" variant="outline">Create Listing</Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/signup">
                <Button size="lg">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button size="lg" variant="outline">Sign In</Button>
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <Card>
          <CardHeader>
            <Search className="h-8 w-8 mb-2 text-purple-600" />
            <CardTitle>Find Matches</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              List the seats you have and specify what you want. Our matching system finds compatible swaps.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <MessageSquare className="h-8 w-8 mb-2 text-purple-600" />
            <CardTitle>Direct Messaging</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Connect directly with other fans through our secure in-app messaging system.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Shield className="h-8 w-8 mb-2 text-purple-600" />
            <CardTitle>Trust & Safety</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Verified badges and swap history help you make informed decisions about who to swap with.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="bg-muted/50 rounded-lg p-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">How It Works</h2>
        <ol className="space-y-3">
          <li className="flex gap-3">
            <span className="font-bold text-purple-600">1.</span>
            <span>Create an account and list the seats you have</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-purple-600">2.</span>
            <span>Specify what sections or zones you'd like to swap for</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-purple-600">3.</span>
            <span>Browse matches or let others find you</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-purple-600">4.</span>
            <span>Message potential swap partners to coordinate</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-purple-600">5.</span>
            <span>Complete your swap through Ticketmaster (we don't handle transfers or payments)</span>
          </li>
        </ol>
      </section>
    </div>
  )
}