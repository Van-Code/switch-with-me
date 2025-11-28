import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Clean up existing data (in development only!)
  console.log('🧹 Cleaning up existing data...')
  await prisma.notification.deleteMany()
  await prisma.message.deleteMany()
  await prisma.conversationParticipant.deleteMany()
  await prisma.conversation.deleteMany()
  await prisma.listing.deleteMany()
  await prisma.profile.deleteMany()
  await prisma.user.deleteMany()
  console.log('✅ Cleanup complete')

  // Create test users
  const password = await bcrypt.hash('password123', 10)

  const user1 = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      password,
      emailNotificationsEnabled: true, // Email notifications ON
      profile: {
        create: {
          firstName: 'Alice',
          lastInitial: 'J',
          emailVerified: true,
          phoneVerified: true,
          seasonTicketHolderVerified: true,
          successfulSwapsCount: 5,
          bio: 'Love the Valkyries! Looking to swap for better seats.',
          favoritePlayer: 'Kelsey Plum',
        },
      },
    },
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      password,
      emailNotificationsEnabled: false, // Email notifications OFF
      profile: {
        create: {
          firstName: 'Bob',
          lastInitial: 'S',
          emailVerified: true,
          successfulSwapsCount: 2,
          bio: 'Season ticket holder, flexible on swaps.',
          favoritePlayer: 'A\'ja Wilson',
        },
      },
    },
  })

  const user3 = await prisma.user.create({
    data: {
      email: 'carol@example.com',
      password,
      emailNotificationsEnabled: true, // Email notifications ON
      profile: {
        create: {
          firstName: 'Carol',
          lastInitial: 'M',
          emailVerified: true,
          phoneVerified: true,
          successfulSwapsCount: 1,
          favoritePlayer: 'Jackie Young',
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

  // Create conversations with multiple messages
  const conversation1 = await prisma.conversation.create({
    data: {
      listingId: listing2.id,
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
            createdAt: new Date(Date.now() - 3600000 * 24 * 2), // 2 days ago
          },
          {
            senderId: user2.id,
            text: 'Hey Alice! Yes, I\'d definitely be interested. When were you thinking of doing the swap?',
            createdAt: new Date(Date.now() - 3600000 * 24 * 2 + 3600000), // 2 days ago + 1 hour
          },
          {
            senderId: user1.id,
            text: 'Great! I was thinking for the December 15th game. Does that work for you?',
            createdAt: new Date(Date.now() - 3600000 * 24 * 2 + 7200000), // 2 days ago + 2 hours
          },
          {
            senderId: user2.id,
            text: 'Perfect timing! That works for me. My seats are Row C which should give you a great view.',
            createdAt: new Date(Date.now() - 3600000 * 24 + 3600000), // 1 day ago
          },
          {
            senderId: user1.id,
            text: 'Awesome! How should we coordinate the ticket transfer?',
            createdAt: new Date(Date.now() - 3600000 * 12), // 12 hours ago
          },
        ],
      },
    },
  })

  const conversation2 = await prisma.conversation.create({
    data: {
      listingId: listing1.id,
      participants: {
        create: [
          { userId: user2.id },
          { userId: user3.id },
        ],
      },
      messages: {
        create: [
          {
            senderId: user3.id,
            text: 'Hi Bob! I love your section 106 seats. Would you consider a swap plus cash?',
            createdAt: new Date(Date.now() - 3600000 * 24 * 5), // 5 days ago
          },
          {
            senderId: user2.id,
            text: 'Hey Carol! Thanks for reaching out. What section are you in?',
            createdAt: new Date(Date.now() - 3600000 * 24 * 5 + 1800000), // 5 days ago + 30 min
          },
          {
            senderId: user3.id,
            text: 'I\'m in section 215, upper bowl. I know it\'s not as good but I can add cash to make it fair.',
            createdAt: new Date(Date.now() - 3600000 * 24 * 4), // 4 days ago
          },
        ],
      },
    },
  })

  const conversation3 = await prisma.conversation.create({
    data: {
      participants: {
        create: [
          { userId: user1.id },
          { userId: user3.id },
        ],
      },
      messages: {
        create: [
          {
            senderId: user3.id,
            text: 'Hi Alice! Quick question - how do you usually handle the ticket transfers on this platform?',
            createdAt: new Date(Date.now() - 3600000 * 6), // 6 hours ago
          },
          {
            senderId: user1.id,
            text: 'Hey Carol! I usually use the Ticketmaster transfer feature. It\'s super easy and secure.',
            createdAt: new Date(Date.now() - 3600000 * 4), // 4 hours ago
          },
          {
            senderId: user3.id,
            text: 'That makes sense. Thanks for the tip! I\'m still learning the ropes here.',
            createdAt: new Date(Date.now() - 3600000 * 2), // 2 hours ago
          },
          {
            senderId: user1.id,
            text: 'No problem! Feel free to reach out if you have any other questions. We were all new once!',
            createdAt: new Date(Date.now() - 3600000), // 1 hour ago
          },
        ],
      },
    },
  })

  console.log('Conversations created')

  // Create sample notifications
  console.log('Creating notifications...')

  // Notification for user1 (Alice) - unread message from Bob
  await prisma.notification.create({
    data: {
      userId: user1.id,
      type: 'MESSAGE',
      data: {
        conversationId: conversation1.id,
        senderName: 'Bob S',
        preview: 'Perfect timing! That works for me. My seats are Row C which should give you a great view.',
      },
      isRead: false,
      createdAt: new Date(Date.now() - 3600000 * 24), // 1 day ago
    },
  })

  // Notification for user1 - match found (read)
  await prisma.notification.create({
    data: {
      userId: user1.id,
      type: 'MATCH',
      data: {
        listingId: listing1.id,
        matchedListingId: listing2.id,
        matchScore: 92,
        description: 'Great news! We found someone with seats you want.',
      },
      isRead: true,
      createdAt: new Date(Date.now() - 3600000 * 48), // 2 days ago
    },
  })

  // Notification for user2 (Bob) - unread message from Alice
  await prisma.notification.create({
    data: {
      userId: user2.id,
      type: 'MESSAGE',
      data: {
        conversationId: conversation1.id,
        senderName: 'Alice J',
        preview: 'Awesome! How should we coordinate the ticket transfer?',
      },
      isRead: false,
      createdAt: new Date(Date.now() - 3600000 * 12), // 12 hours ago
    },
  })

  // Notification for user3 (Carol) - multiple notifications
  await prisma.notification.create({
    data: {
      userId: user3.id,
      type: 'MESSAGE',
      data: {
        conversationId: conversation3.id,
        senderName: 'Alice J',
        preview: 'No problem! Feel free to reach out if you have any other questions. We were all new once!',
      },
      isRead: false,
      createdAt: new Date(Date.now() - 3600000), // 1 hour ago
    },
  })

  await prisma.notification.create({
    data: {
      userId: user3.id,
      type: 'MESSAGE',
      data: {
        conversationId: conversation3.id,
        senderName: 'Alice J',
        preview: 'Hey Carol! I usually use the Ticketmaster transfer feature. It\'s super easy and secure.',
      },
      isRead: true, // This one is read
      createdAt: new Date(Date.now() - 3600000 * 4), // 4 hours ago
    },
  })

  await prisma.notification.create({
    data: {
      userId: user3.id,
      type: 'MATCH',
      data: {
        listingId: listing2.id,
        matchScore: 85,
        description: 'You have a new seat match suggestion!',
      },
      isRead: false,
      createdAt: new Date(Date.now() - 3600000 * 8), // 8 hours ago
    },
  })

  console.log('Notifications created')

  // Summary
  const userCount = await prisma.user.count()
  const listingCount = await prisma.listing.count()
  const conversationCount = await prisma.conversation.count()
  const messageCount = await prisma.message.count()
  const notificationCount = await prisma.notification.count()
  const unreadCount = await prisma.notification.count({ where: { isRead: false } })

  console.log('\n📊 Seed Summary:')
  console.log('================')
  console.log(`👥 Users: ${userCount}`)
  console.log(`🎫 Listings: ${listingCount}`)
  console.log(`💬 Conversations: ${conversationCount}`)
  console.log(`📨 Messages: ${messageCount}`)
  console.log(`🔔 Notifications: ${notificationCount} (${unreadCount} unread)`)
  console.log('\n🔐 Test Credentials:')
  console.log('All users: password123')
  console.log('- alice@example.com (email notifications: ON)')
  console.log('- bob@example.com (email notifications: OFF)')
  console.log('- carol@example.com (email notifications: ON)')

  console.log('\n✨ Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })