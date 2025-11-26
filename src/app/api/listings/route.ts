import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../lib/auth"
import { prisma } from "../../../lib/prisma"

// GET /api/listings - Browse/filter listings
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const gameDate = searchParams.get("gameDate")
        const zone = searchParams.get("zone")
        const section = searchParams.get("section")
        const status = searchParams.get("status") || "ACTIVE"

        const where: any = {
            status: status as any,
        }

        if (gameDate) {
            where.gameDate = new Date(gameDate)
        }

        if (zone) {
            where.haveZone = zone
        }

        if (section) {
            where.haveSection = section
        }

        const listings = await prisma.listing.findMany({
            where,
            include: {
                user: {
                    include: {
                        profile: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        })

        return NextResponse.json({ listings })
    } catch (error) {
        console.error("Error fetching listings:", error)
        return NextResponse.json(
            { error: "Failed to fetch listings" },
            { status: 500 }
        )
    }
}

// POST /api/listings - Create a new listing
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const body = await req.json()
        const {
            gameId,
            gameDate,
            haveSection,
            haveRow,
            haveSeat,
            haveZone,
            faceValue,
            wantZones,
            wantSections,
            willingToAddCash,
        } = body

        if (!gameDate || !haveSection || !haveRow || !haveSeat || !haveZone || faceValue === undefined) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        const listing = await prisma.listing.create({
            data: {
                userId: session.user.id,
                gameId,
                gameDate: new Date(gameDate),
                haveSection,
                haveRow,
                haveSeat,
                haveZone,
                faceValue: parseFloat(faceValue),
                wantZones: wantZones || [],
                wantSections: wantSections || [],
                willingToAddCash: willingToAddCash || false,
            },
            include: {
                user: {
                    include: {
                        profile: true,
                    },
                },
            },
        })

        return NextResponse.json({ listing })
    } catch (error) {
        console.error("Error creating listing:", error)
        return NextResponse.json(
            { error: "Failed to create listing" },
            { status: 500 }
        )
    }
}