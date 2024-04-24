'use server'

import { getNotifications, getNotificationsByUserId } from '@/data/notification'
import { currentUser } from '@/lib/auth'
import { unstable_noStore } from 'next/cache'

export const fetchNofiicationCount = async () => {
  unstable_noStore()
  const user = await currentUser()
  if (!user || !user.id) {
    return 0
  }

  return await getNotificationsByUserId(user.id)
}

export const fetchNotifications = async ({
  userId,
  offset,
  take,
}: {
  userId: string | undefined
  offset: number
  take: number
}) => {
  unstable_noStore()
  const notifications = await getNotifications({
    userId,
    offset,
    take,
  })
  return {
    notifications,
    nextOffset: notifications.length
      ? offset + notifications.length
      : undefined,
  }
}
