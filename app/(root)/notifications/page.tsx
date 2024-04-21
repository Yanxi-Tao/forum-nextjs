import { fetchNofiications } from '@/actions/notification/fetch-notification'
import { NotificationCard } from '@/components/card/notification-card'

export default async function NotificationsPage() {
  const notifications = await fetchNofiications()
  if (!notifications) return null
  return (
    <div>
      {notifications.map((notification) => {
        return (
          <NotificationCard key={notification.id} notification={notification} />
        )
      })}
    </div>
  )
}
