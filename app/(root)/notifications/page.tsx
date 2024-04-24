import { fetchNotifications } from '@/actions/notification/fetch-notification'
import { NotificationDisplay } from '@/components/display/notification-display'
import { currentUser } from '@/lib/auth'
import { NOTIFICATION_FETCH_SPAN, NOTIFICATION_KEY } from '@/lib/constants'
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query'

export default async function NotificationsPage() {
  const queryClient = new QueryClient()
  const user = await currentUser()

  if (!user) return <div>Not logged in</div>

  await queryClient.prefetchInfiniteQuery({
    queryKey: [NOTIFICATION_KEY],
    queryFn: ({ pageParam }) => fetchNotifications(pageParam),
    initialPageParam: {
      userId: user?.id,
      offset: 0,
      take: NOTIFICATION_FETCH_SPAN,
    },
    staleTime: Infinity,
  })
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotificationDisplay />
    </HydrationBoundary>
  )
}
