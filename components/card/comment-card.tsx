import { formatNumber } from '@/lib/utils'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Heart, ChevronRight } from 'lucide-react'
import { FaComment } from 'react-icons/fa'
import { GoHeartFill } from 'react-icons/go'
import { CommentCardProps } from '@/lib/types'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Toggle } from '@/components/ui/toggle'

export const CommentCard = ({ comment }: { comment: CommentCardProps }) => {
  return (
    <Card className="flex w-full space-x-4 py-2 px-4">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="w-full">
        <div className="flex justify-between">
          <CardHeader className="p-0 py-0 flex flex-row items-center space-y-0 space-x-1">
            <Button variant="link" size="sm" className="p-0" asChild>
              <Link href={`/profile/${comment.author.slug}`}>
                {comment.author.name}
              </Link>
            </Button>
            {comment.replyTo && (
              <>
                <ChevronRight size={20} />
                <Button variant="link" size="sm" className="p-0" asChild>
                  <Link href={`/profile/${comment.replyTo.slug}`}>
                    {comment.replyTo.name}
                  </Link>
                </Button>
              </>
            )}
          </CardHeader>
          <div>actions</div>
        </div>
        <CardContent className="p-0">{comment.content}</CardContent>
        <CardFooter className="flex justify-between items-center p-0 py-2">
          <span className="text-sm">
            {new Date(comment.createdAt).toDateString()}
          </span>
          <div className="flex items-center align-baseline">
            <Toggle size="sm" className="flex items-center space-x-1">
              <FaComment size={20} className="mr-1" />
              <span>Reply</span>
            </Toggle>
            <Toggle size="sm" className="flex items-center space-x-1">
              <GoHeartFill size={20} className="mr-1" />
              <span>{formatNumber(comment.likes)}</span>
            </Toggle>
          </div>
        </CardFooter>
      </div>
    </Card>
  )
}
