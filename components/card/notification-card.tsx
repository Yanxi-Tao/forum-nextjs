'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { NotificationCardProps } from '@/lib/types'
import Link from 'next/link'
import { AvatarCard } from './avatar-card'

export const NotificationCard = ({
  notification,
}: {
  notification: NotificationCardProps
}) => {
  const messageSuffix =
    notification.type === 'answer'
      ? notification.post?.title
      : notification.type === 'commentPost'
      ? notification.comment?.post?.title
      : notification.type === 'commentReply'
      ? notification.comment?.parent?.post?.title
      : ''
  return (
    <Card className="shadow-none border-0 p-1 hover:bg-muted">
      <Link href={''} className="flex items-center">
        <Link href={`/profile/${notification.generatedBy.slug}`}>
          <AvatarCard
            source={notification.generatedBy.image}
            name={notification.generatedBy.name}
            className="h-14 w-14 text-xl"
          />
        </Link>
        <div className="w-full">
          <CardContent className="py-0  px-3">
            <Link
              href={`/profile/${notification.generatedBy.slug}`}
              className="text-sky-700 underline-offset-4 hover:underline"
            >
              {notification.generatedBy.name}
            </Link>
            <span>{` ${notification.message} `}</span>
            <Link
              href={''}
              className="text-sky-700 underline-offset-4 hover:underline"
            >
              {messageSuffix}{' '}
            </Link>
          </CardContent>
        </div>
      </Link>
    </Card>
  )
}
