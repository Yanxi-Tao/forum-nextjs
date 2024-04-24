'use server'

import { deleteNotificationById } from '@/data/notification'

export const deleteNotification = async (id: string) => {
  await deleteNotificationById(id)
}
