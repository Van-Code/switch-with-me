import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create test users
  const password = await bcrypt.hash('password123', 10)

  const user1 = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      password,
      profile: {
        create: {
          firstName: 'Alice',
          lastInitial: 'J',
          emailVerified: true,
          phoneVerified: true,
          seasonTicketHolderVerified: true,
          successfulSwapsCount: 5,
          bio: 'Love the Valkyries! Looking to swap for better seats.',
        },
      },
    },
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      password,
      profile: {
        create: {
          firstName: 'Bob',
          lastInitial: 'S',
          emailVerified: true,
          successfulSwapsCount: 2,
          bio: 'Season ticket holder, flexible on swaps.',
        },
      },
    },
  })

  const user3 = await prisma.user.create({
    data: {
      email: 'carol@example.com',
      password,
      profile: {
        create: {
          firstName: 'Carol',
          lastInitial: 'M',
          emailVerified: true,
          phoneVerified: true,
          successfulSwapsCount: 1,
        },
      },
    },
  })

  console.log('Users created')

  // Create test listings
  const gameDate1 = new Date('2025-12-15T19:00:00')
  const gameDate2 = new Date('2025-12-20T19:30:00')

  const listing1 = await prisma.listing.create({
    data: {
      userId: user1.id,
      gameDate: gameDate1,
      haveSection: '101',
      haveRow: 'A',
      haveSeat: '5',
      haveZone: 'Lower Bowl Corner',
      faceValue: 75.00,
      wantZones: ['Lower Bowl Center', 'Club Seats'],
      wantSections: ['105', '106', '107'],
      willingToAddCash: true,
      status: 'ACTIVE',
    },
  })

  const listing2 = await prisma.listing.create({
    data: {
      userId: user2.id,
      gameDate: gameDate1,
      haveSection: '106',
      haveRow: 'C',
      haveSeat: '12',
      haveZone: 'Lower Bowl Center',
      faceValue: 95.00,
      wantZones: ['Lower Bowl Corner', 'Upper Bowl'],
      wantSections: ['101', '102', '201'],
      willingToAddCash: false,
      status: 'ACTIVE',
    },
  })

  await prisma.listing.create({
    data: {
      userId: user3.id,
      gameDate: gameDate1,
      haveSection: '215',
      haveRow: 'F',
      haveSeat: '8',
      haveZone: 'Upper Bowl',
      faceValue: 45.00,
      wantZones: ['Lower Bowl Corner'],
      wantSections: ['101', '102', '103', '108'],
      willingToAddCash: true,
      status: 'ACTIVE',
    },
  })

  await prisma.listing.create({
    data: {
      userId: user1.id,
      gameDate: gameDate2,
      haveSection: '103',
      haveRow: 'B',
      haveSeat: '15',
      haveZone: 'Lower Bowl Corner',
      faceValue: 80.00,
      wantZones: ['Lower Bowl Center'],
      wantSections: ['105', '106'],
      willingToAddCash: true,
      status: 'ACTIVE',
    },
  })

  await prisma.listing.create({
    data: {
      userId: user2.id,
      gameDate: gameDate2,
      haveSection: '105',
      haveRow: 'D',
      haveSeat: '7',
      haveZone: 'Lower Bowl Center',
      faceValue: 100.00,
      wantZones: ['Club Seats'],
      wantSections: ['C1', 'C2', 'C3'],
      willingToAddCash: true,
      status: 'ACTIVE',
    },
  })

  console.log('Listings created')

  // Create a sample conversation - link to listing2 (Bob's Section 106 listing)
  const conversation = await prisma.conversation.create({
    data: {
      listingId: listing2.id, // Use the listing variable directly
      participants: {
        create: [
          { userId: user1.id },
          { userId: user2.id },
        ],
      },
      messages: {
        create: [
          {
            senderId: user1.id,
            text: 'Hi! I saw your listing for Section 106. Would you be interested in swapping for my Section 101 seats?',
          },
          {
            senderId: user2.id,
            text: 'Hey Alice! Yes, I\'d definitely be interested. When were you thinking of doing the swap?',
          },
          {
            senderId: user1.id,
            text: 'Great! I was thinking for the December 15th game. Does that work for you?',
          },
        ],
      },
    },
  })

  console.log('Conversation created')

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })