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
import { useRouter } from 'next-nprogress-bar'

export const NotificationCard = ({
  notification: { id, generatedBy, message, post, comment, redirectTo },
  mutate,
}: NotificationCardProps) => {
  const router = useRouter()
  const redirect = post ? `${redirectTo}/answer/${post.id}` : ''
  return (
    <Card
      className="flex cursor-pointer items-center shadow-none border-0 p-3 hover:bg-muted"
      onClick={() => {
        router.push(redirect)
        mutate(id)
      }}
    >
      <Link href={`/profile/${generatedBy.slug}`}>
        <AvatarCard
          source={generatedBy.image}
          name={generatedBy.name}
          className="h-10 w-10 text-xl"
        />
      </Link>
      <div className="w-full">
        <CardContent className="py-0  px-3">
          <Link
            href={`/profile/${generatedBy.slug}`}
            className="text-sky-700 underline-offset-4 hover:underline"
          >
            {generatedBy.name}
          </Link>
          <span>{` ${message} ${post?.title}`}</span>
        </CardContent>
      </div>
    </Card>
  )
}
