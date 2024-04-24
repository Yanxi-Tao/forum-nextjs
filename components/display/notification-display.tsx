'use client'

import { fetchNotifications } from '@/actions/notification/fetch-notification'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import {
  NOTIFICATION_COUNT_KEY,
  NOTIFICATION_FETCH_SPAN,
  NOTIFICATION_KEY,
} from '@/lib/constants'
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { NotificationCard } from '../card/notification-card'
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'
import { deleteNotification } from '@/actions/notification/delete-notification'

export const NotificationDisplay = () => {
  const user = useCurrentUser()
  const queryClient = useQueryClient()
  const { ref, inView } = useInView()
  const { data, fetchNextPage, hasNextPage, isFetching, isSuccess } =
    useInfiniteQuery({
      queryKey: [NOTIFICATION_KEY],
      queryFn: ({ pageParam }) => fetchNotifications(pageParam),
      initialPageParam: {
        userId: user?.id,
        offset: 0,
        take: NOTIFICATION_FETCH_SPAN,
      },
      getNextPageParam: (lastPage) => {
        if (!lastPage.nextOffset) return undefined
        return {
          userId: user?.id,
          offset: lastPage.nextOffset,
          take: NOTIFICATION_FETCH_SPAN,
        }
      },
    })

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

  useEffect(() => {
    if (!isFetching && inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage, isFetching])

  if (!user || !user.id) return null

  return (
    <div>
      {isSuccess &&
        data.pages.map((page) =>
          page.notifications.map((notification) => {
            if (
              page.notifications.indexOf(notification) ===
              (page.notifications.length < 2
                ? page.notifications.length - 1
                : page.notifications.length - 2)
            ) {
              return (
                <div key={notification.id} ref={ref}>
                  <NotificationCard
                    notification={notification}
                    mutate={mutate}
                  />
                </div>
              )
            } else {
              return (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  mutate={mutate}
                />
              )
            }
          })
        )}
    </div>
  )
}
