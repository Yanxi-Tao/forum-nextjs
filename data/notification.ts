import { db } from '@/db/client'

export const getNotificationsByUserId = async (userId: string) => {
  try {
    const notificationCount = await db.notification.count({
      where: { notifiedUserId: userId },
    })
    return notificationCount
  } catch {
    return 0
  }
}

export const getNotifications = async ({
  userId,
  offset,
  take,
}: {
  userId: string | undefined
  offset: number
  take: number
}) => {
  try {
    const notifications = await db.notification.findMany({
      where: { notifiedUserId: userId },
      include: {
        generatedBy: {
          select: {
            name: true,
            slug: true,
            image: true,
          },
        },
        post: {
          select: {
            title: true,
            id: true,
            community: {
              select: {
                slug: true,
              },
            },
          },
        },
        comment: {
          select: {
            id: true,
            post: {
              select: {
                title: true,
                id: true,
                community: {
                  select: {
                    slug: true,
                  },
                },
              },
            },
            parent: {
              select: {
                id: true,
                post: {
                  select: {
                    title: true,
                    id: true,
                    community: {
                      select: {
                        slug: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take,
    })
    return notifications
  } catch {
    return []
  }
}

export const deleteNotificationById = async (id: string) => {
  try {
    await db.notification.delete({ where: { id } })
    return true
  } catch {
    return false
  }
}
