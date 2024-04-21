'use server'

import { getNotificationsByUserId } from '@/data/notification'
import { currentUser } from '@/lib/auth'

export const fetchNofiications = async () => {
  const user = await currentUser()

  if (!user || !user.id) {
    return null
  }

  return await getNotificationsByUserId(user.id)
}
