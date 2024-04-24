'use client'

import { deleteNotification } from '@/actions/notification/delete-notification'
import {
  fetchNofiicationCount,
  fetchNotifications,
} from '@/actions/notification/fetch-notification'
import {
  NOTIFICATION_COUNT_KEY,
  NOTIFICATION_FETCH_SPAN,
  NOTIFICATION_KEY,
} from '@/lib/constants'
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

export const useInfiniteNotifications = (userId: string | undefined) => {
  return useInfiniteQuery({
    queryKey: [NOTIFICATION_KEY],
    queryFn: ({ pageParam }) => fetchNotifications(pageParam),
    initialPageParam: {
      userId,
      offset: 0,
      take: NOTIFICATION_FETCH_SPAN,
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.nextOffset) return undefined
      return {
        userId,
        offset: lastPage.nextOffset,
        take: NOTIFICATION_FETCH_SPAN,
      }
    },
  })
}

export const useDeleteNotification = () => {
  const queryClient = useQueryClient()
  const { mutate } = useMutation({
    mutationFn: (id: string) => deleteNotification(id),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [NOTIFICATION_KEY],
      })
      queryClient.invalidateQueries({
        queryKey: [NOTIFICATION_COUNT_KEY],
      })
    },
  })
  return mutate
}

export const useNotificationCount = () => {
  return useQuery({
    queryKey: [NOTIFICATION_COUNT_KEY],
    queryFn: () => fetchNofiicationCount(),
  })
}
