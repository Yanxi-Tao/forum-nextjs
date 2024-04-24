'use client'

import { useCurrentUser } from '@/hooks/useCurrentUser'
import { NotificationCard } from '@/components/card/notification-card'
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'
import BeatLoader from 'react-spinners/BeatLoader'
import {
  useDeleteNotification,
  useInfiniteNotifications,
} from '@/hooks/notification'

export const NotificationDisplay = () => {
  const user = useCurrentUser()
  const { ref, inView } = useInView()
  const {
    data,
    fetchNextPage,
    fetchStatus,
    hasNextPage,
    isFetching,
    isSuccess,
  } = useInfiniteNotifications(user?.id)

  const deleteNotification = useDeleteNotification()

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
                    deleteNotification={deleteNotification}
                  />
                </div>
              )
            } else {
              return (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  deleteNotification={deleteNotification}
                />
              )
            }
          })
        )}
      {fetchStatus === 'fetching' && (
        <div className="flex justify-center h-10 my-4">
          <BeatLoader className="h-10" />
        </div>
      )}
      {!hasNextPage && fetchStatus !== 'fetching' && (
        <div className="flex items-center h-10 my-4 px-20">
          <div className="w-full border-b-2" />
        </div>
      )}
    </div>
  )
}
