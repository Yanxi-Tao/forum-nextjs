import { db } from '@/db/client'

export const getNotificationsByUserId = async (userId: string) => {
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
    })
    return notifications
  } catch {
    return []
  }
}
