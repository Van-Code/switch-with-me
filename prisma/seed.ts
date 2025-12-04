import { PrismaClient, NotificationType } from "@prisma/client"

const prisma = new PrismaClient()

// Config
const NUM_USERS = 16
const NUM_LISTINGS = 200
const CONVERSATION_RATIO = 0.25 // ~25% of listings get a conversation

// Helpers
function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomFloat(min: number, max: number, decimals = 2): number {
  const v = Math.random() * (max - min) + min
  return parseFloat(v.toFixed(decimals))
}

function randomFutureDateIn2025(): Date {
  const start = new Date("2025-01-05").getTime()
  const end = new Date("2025-05-30").getTime()
  const ts = randomInt(start, end)
  return new Date(ts)
}

async function main() {
  console.log("Clearing existing data...")

  // Clean up in reverse dependency order
  await prisma.notification.deleteMany({})
  await prisma.message.deleteMany({})
  await prisma.conversationParticipant.deleteMany({})
  await prisma.conversation.deleteMany({})
  await prisma.listing.deleteMany({})
  await prisma.profile.deleteMany({})
  await prisma.account.deleteMany({})
  await prisma.session.deleteMany({})
  await prisma.team.deleteMany({})
  await prisma.user.deleteMany({})

  console.log("Seeding teams...")

  const teamsData = [
    {
      name: "Golden State Valkyries",
      slug: "valkyries",
      logoUrl: "/images/teams/valkyries.png",
      primaryColor: "#6b00d7",
      secondaryColor: "#f7f2ff"
    },
    {
      name: "Bay FC",
      slug: "bay-fc",
      logoUrl: "/images/teams/bayfc.svg",
      primaryColor: "#d20000",
      secondaryColor: "#ffe7e7"
    }
  ]

  const teams: { [slug: string]: { id: number } } = {}
  for (const t of teamsData) {
    const created = await prisma.team.create({ data: t })
    teams[created.slug] = { id: created.id }
  }

  console.log("Seeding users + profiles...")

  // Base user data; we’ll pad to NUM_USERS
  const baseUserEmails = [
    "van.acxiom@gmail.com",
    "this.props.gmail.com",
    "maya.west@example.com",
    "taylor.park@example.com",
    "alex.rios@example.com",
    "jamie.chen@example.com",
    "devon.miles@example.com",
    "sasha.lane@example.com",
    "riley.knox@example.com",
    "harper.gray@example.com",
    "jordan.wu@example.com",
    "casey.barnes@example.com",
    "morgan.lee@example.com",
    "rowan.kelly@example.com",
    "blake.santos@example.com",
    "quinn.dawson@example.com"
  ].slice(0, NUM_USERS)

  const favoritePlayers = [
    "Kelsey Plum",
    "Sabrina Ionescu",
    "A'ja Wilson",
    "Chelsea Gray",
    "Breanna Stewart",
    "Jewell Loyd",
    "Candace Parker",
    "Stephen Curry"
  ]

  const users = []
  for (let i = 0; i < baseUserEmails.length; i++) {
    const email = baseUserEmails[i]
    const firstName = email.split("@")[0].split(".")[0] || `User${i + 1}`
    const lastInitial = firstName.charAt(0).toUpperCase()

    const user = await prisma.user.create({
      data: {
        email,
        emailNotificationsEnabled: Math.random() < 0.7,
        profile: {
          create: {
            firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
            lastInitial,
            avatarUrl: null,
            bio:
              i === 0
                ? "Queer Bay Area fan who loves W+ sports and good sightlines."
                : "Loves live games, open to trying new sections.",
            favoritePlayer: randomItem(favoritePlayers),
            emailVerified: true,
            phoneVerified: false,
            seasonTicketHolderVerified: Math.random() < 0.2
          }
        }
      }
    })

    users.push(user)
  }

  console.log(`Created ${users.length} users.`)

  console.log(`Seeding ${NUM_LISTINGS} listings...`)

  const zones = [
    "Courtside",
    "Lower Midcourt",
    "Lower Sideline",
    "Lower Corner",
    "Lower End",
    "Lower Bowl",
    "Lower Baseline",
    "Club Level",
    "Upper Sideline",
    "Upper Corner",
    "Upper End"
  ]

  const sectionsValk = [
    "101",
    "102",
    "103",
    "104",
    "105",
    "106",
    "107",
    "108",
    "109",
    "110",
    "111",
    "112",
    "113",
    "114",
    "115",
    "116",
    "117",
    "118",
    "119",
    "120",
    "121",
    "122",
    "123",
    "124",
    "125",
    "126",
    "127",
    "128",
    "129",
    "130",
    "131",
    "132",
    "133",
    "134"
  ]

  const sectionsBayFC = [
    "201",
    "202",
    "203",
    "204",
    "205",
    "206",
    "207",
    "208",
    "209",
    "210",
    "211",
    "212",
    "213",
    "214",
    "215",
    "216",
    "217",
    "218",
    "219",
    "220",
    "221",
    "222",
    "223",
    "224"
  ]

  const listingsCreated = []

  for (let i = 0; i < NUM_LISTINGS; i++) {
    const user = randomItem(users)
    const teamSlug = Math.random() < 0.6 ? "valkyries" : "bay-fc"
    const teamId = teams[teamSlug].id
    const isValk = teamSlug === "valkyries"

    const haveSection = isValk ? randomItem(sectionsValk) : randomItem(sectionsBayFC)
    const haveRow = String(randomInt(1, 25))
    const haveSeat = String(randomInt(1, 20))
    const haveZone = randomItem(zones)

    const wantZones = [randomItem(zones), randomItem(zones)].filter(
      (v, idx, arr) => arr.indexOf(v) === idx
    ) // unique

    const candidateSections = isValk ? sectionsValk : sectionsBayFC
    const wantSections = [
      randomItem(candidateSections),
      randomItem(candidateSections)
    ].filter((v, idx, arr) => arr.indexOf(v) === idx)

    const faceValue = randomFloat(20, 220)
    const gameDate = randomFutureDateIn2025()

    const listing = await prisma.listing.create({
      data: {
        userId: user.id,
        teamId,
        gameDate,
        gameId: null,
        haveSection,
        haveRow,
        haveSeat,
        haveZone,
        faceValue,
        wantZones,
        wantSections,
        willingToAddCash: Math.random() < 0.4
        // status uses default ACTIVE
      }
    })

    listingsCreated.push(listing)
  }

  console.log(`Created ${listingsCreated.length} listings.`)

  console.log("Seeding conversations, messages, and notifications...")

  const conversationsCreated = []

  for (const listing of listingsCreated) {
    if (Math.random() > CONVERSATION_RATIO) continue

    // pick 2 distinct users: owner + another
    const ownerId = listing.userId
    const otherUsers = users.filter((u) => u.id !== ownerId)
    if (otherUsers.length === 0) continue

    const responder = randomItem(otherUsers)

    const convo = await prisma.conversation.create({
      data: {
        listingId: listing.id,
        participants: {
          create: [{ userId: ownerId }, { userId: responder.id }]
        },
        messages: {
          create: [
            {
              senderId: responder.id,
              text: `Hey! Is your seat in section ${listing.haveSection} still available for that game?`
            },
            {
              senderId: ownerId,
              text: `Hey! Yep, it's still available. What section are you in or what are you hoping to swap into?`
            },
            {
              senderId: responder.id,
              text: `I'm hoping for something closer to ${randomItem(
                listing.wantZones.length ? listing.wantZones : zones
              )}. Your listing looked like a good fit.`
            }
          ]
        }
      },
      include: {
        participants: true,
        messages: true
      }
    })

    conversationsCreated.push(convo)

    // Notifications for new messages to each participant
    const recipientIds = convo.participants.map((p) => p.userId)

    for (const msg of convo.messages) {
      const receivers = recipientIds.filter((id) => id !== msg.senderId)

      for (const recipientId of receivers) {
        await prisma.notification.create({
          data: {
            userId: recipientId,
            type: NotificationType.MESSAGE,
            data: {
              conversationId: convo.id,
              listingId: listing.id,
              previewText: msg.text.slice(0, 120)
            },
            isRead: false
          }
        })
      }
    }

    // Occasionally add a MATCH notification for the owner
    if (Math.random() < 0.15) {
      await prisma.notification.create({
        data: {
          userId: ownerId,
          type: NotificationType.MATCH,
          data: {
            listingId: listing.id,
            message: "You have a promising swap conversation for this listing."
          },
          isRead: false
        }
      })
    }
  }

  console.log(
    `Created ${conversationsCreated.length} conversations, messages, and notifications.`
  )

  console.log("Done seeding.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
