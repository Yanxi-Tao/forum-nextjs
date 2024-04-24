'use client'

import { Card, CardContent } from '@/components/ui/card'
import { NotificationCardProps } from '@/lib/types'
import { AvatarCard } from './avatar-card'
import { useRouter } from 'next-nprogress-bar'

export const NotificationCard = ({
  notification: { id, generatedBy, message, post, comment, redirectTo },
  deleteNotification,
}: NotificationCardProps) => {
  const router = useRouter()
  const redirect = post ? `${redirectTo}/answer/${post.id}` : ''

  return (
    <Card
      className="flex cursor-pointer items-center shadow-none border-0 p-3 hover:bg-muted max-[820px] break-words"
      onClick={() => {
        deleteNotification(id)
        router.push(redirect)
      }}
    >
      <AvatarCard
        source={generatedBy.image}
        name={generatedBy.name}
        className="h-10 w-10 text-xl"
      />
      <CardContent className="w-full flex items-center py-0 px-3 space-x-2">
        <span
          className="link !text-cyan-600"
          onClick={(e) => {
            e.stopPropagation()
            router.push(`/profile/${generatedBy.slug}`)
          }}
        >
          {generatedBy.name}
        </span>
        <span>{message}</span>
        <span className="link !text-cyan-600">{post.title}</span>
      </CardContent>
    </Card>
  )
}
