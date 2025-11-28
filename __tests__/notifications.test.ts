/**
 * Notification System Tests
 *
 * Basic tests for the notification system functionality.
 * Run with: npm test (after setting up Jest or your preferred test runner)
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals'

// Mock Prisma client
const mockPrisma = {
  notification: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    updateMany: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
}

// Mock the prisma module
jest.mock('@/lib/db', () => ({
  prisma: mockPrisma,
}))

describe('Notification System', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
  })

  describe('createMessageNotification', () => {
    it('should create a notification for a new message', async () => {
      const mockNotification = {
        id: 'notif-1',
        userId: 'user-2',
        type: 'MESSAGE',
        data: {
          conversationId: 'conv-1',
          messageId: 'msg-1',
          senderName: 'John D.',
          preview: 'Hello there!',
        },
        isRead: false,
        createdAt: new Date(),
      }

      const mockUser = {
        id: 'user-2',
        email: 'user@example.com',
        name: 'User Two',
        emailNotificationsEnabled: true,
      }

      mockPrisma.notification.create.mockResolvedValue(mockNotification)
      mockPrisma.user.findUnique.mockResolvedValue(mockUser)

      const { createMessageNotification } = await import('@/lib/notifications')

      const result = await createMessageNotification({
        recipientId: 'user-2',
        conversationId: 'conv-1',
        messageId: 'msg-1',
        senderName: 'John D.',
        messagePreview: 'Hello there!',
      })

      expect(mockPrisma.notification.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-2',
          type: 'MESSAGE',
          data: {
            conversationId: 'conv-1',
            messageId: 'msg-1',
            senderName: 'John D.',
            preview: 'Hello there!',
          },
          isRead: false,
        },
      })

      expect(result).toEqual(mockNotification)
    })
  })

  describe('createMatchNotification', () => {
    it('should create a notification for a new match', async () => {
      const mockNotification = {
        id: 'notif-2',
        userId: 'user-1',
        type: 'MATCH',
        data: {
          listingId: 'listing-1',
          matchedListingId: 'listing-2',
          matchScore: 150,
          description: 'Great news! Someone has a seat that matches your listing.',
        },
        isRead: false,
        createdAt: new Date(),
      }

      const mockUser = {
        id: 'user-1',
        email: 'user1@example.com',
        name: 'User One',
        emailNotificationsEnabled: false,
      }

      mockPrisma.notification.create.mockResolvedValue(mockNotification)
      mockPrisma.user.findUnique.mockResolvedValue(mockUser)

      const { createMatchNotification } = await import('@/lib/notifications')

      const result = await createMatchNotification({
        userId: 'user-1',
        listingId: 'listing-1',
        matchedListingId: 'listing-2',
        matchScore: 150,
        description: 'Great news! Someone has a seat that matches your listing.',
      })

      expect(mockPrisma.notification.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          type: 'MATCH',
          data: {
            listingId: 'listing-1',
            matchedListingId: 'listing-2',
            matchScore: 150,
            description: 'Great news! Someone has a seat that matches your listing.',
          },
          isRead: false,
        },
      })

      expect(result).toEqual(mockNotification)
    })
  })

  describe('getUnreadCount', () => {
    it('should return the count of unread notifications', async () => {
      mockPrisma.notification.count.mockResolvedValue(5)

      const { getUnreadCount } = await import('@/lib/notifications')

      const count = await getUnreadCount('user-1')

      expect(mockPrisma.notification.count).toHaveBeenCalledWith({
        where: {
          userId: 'user-1',
          isRead: false,
        },
      })

      expect(count).toBe(5)
    })

    it('should return 0 when there are no unread notifications', async () => {
      mockPrisma.notification.count.mockResolvedValue(0)

      const { getUnreadCount } = await import('@/lib/notifications')

      const count = await getUnreadCount('user-1')

      expect(count).toBe(0)
    })
  })

  describe('markNotificationAsRead', () => {
    it('should mark a specific notification as read', async () => {
      mockPrisma.notification.updateMany.mockResolvedValue({ count: 1 })

      const { markNotificationAsRead } = await import('@/lib/notifications')

      await markNotificationAsRead('notif-1', 'user-1')

      expect(mockPrisma.notification.updateMany).toHaveBeenCalledWith({
        where: {
          id: 'notif-1',
          userId: 'user-1',
        },
        data: {
          isRead: true,
        },
      })
    })
  })

  describe('markAllNotificationsAsRead', () => {
    it('should mark all unread notifications as read for a user', async () => {
      mockPrisma.notification.updateMany.mockResolvedValue({ count: 3 })

      const { markAllNotificationsAsRead } = await import('@/lib/notifications')

      await markAllNotificationsAsRead('user-1')

      expect(mockPrisma.notification.updateMany).toHaveBeenCalledWith({
        where: {
          userId: 'user-1',
          isRead: false,
        },
        data: {
          isRead: true,
        },
      })
    })
  })

  describe('getUserNotifications', () => {
    it('should return notifications for a user', async () => {
      const mockNotifications = [
        {
          id: 'notif-1',
          userId: 'user-1',
          type: 'MESSAGE',
          data: { conversationId: 'conv-1', senderName: 'John', preview: 'Hi' },
          isRead: false,
          createdAt: new Date(),
        },
        {
          id: 'notif-2',
          userId: 'user-1',
          type: 'MATCH',
          data: { listingId: 'listing-1', description: 'New match!' },
          isRead: true,
          createdAt: new Date(),
        },
      ]

      mockPrisma.notification.findMany.mockResolvedValue(mockNotifications)

      const { getUserNotifications } = await import('@/lib/notifications')

      const notifications = await getUserNotifications({
        userId: 'user-1',
        limit: 50,
      })

      expect(mockPrisma.notification.findMany).toHaveBeenCalledWith({
        where: {
          userId: 'user-1',
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 50,
      })

      expect(notifications).toEqual(mockNotifications)
    })

    it('should filter unread notifications when unreadOnly is true', async () => {
      const mockNotifications = [
        {
          id: 'notif-1',
          userId: 'user-1',
          type: 'MESSAGE',
          data: { conversationId: 'conv-1', senderName: 'John', preview: 'Hi' },
          isRead: false,
          createdAt: new Date(),
        },
      ]

      mockPrisma.notification.findMany.mockResolvedValue(mockNotifications)

      const { getUserNotifications } = await import('@/lib/notifications')

      const notifications = await getUserNotifications({
        userId: 'user-1',
        unreadOnly: true,
        limit: 50,
      })

      expect(mockPrisma.notification.findMany).toHaveBeenCalledWith({
        where: {
          userId: 'user-1',
          isRead: false,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 50,
      })

      expect(notifications).toEqual(mockNotifications)
    })
  })
})
