'use client'
import { CommentCardProps, NestedCommentCardProps } from '@/lib/types'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Toggle } from '@/components/ui/toggle'
import { formatNumber } from '@/lib/utils'
import { BsChatSquare, BsHeart, BsHeartFill } from 'react-icons/bs'
import { HiDotsHorizontal } from 'react-icons/hi'
import { useState } from 'react'
import { CommentForm } from '@/components/form/comment-form'
import { z } from 'zod'
import { CreateCommentSchema } from '@/schemas'

export const CommentCardWrapper = ({
  children,
  comment,
  mutate,
}: {
  children: React.ReactNode
  comment: CommentCardProps
  mutate: (data: z.infer<typeof CreateCommentSchema>) => void
}) => {
  const [vote, setVote] = useState(0)
  const [isFormOpen, setIsFormOpen] = useState(false)
  return (
    <Card className="flex flex-col space-y-1 shadow-none border-0 py-1">
      <div className="flex">
        <Link href={`/profile/${comment.author.slug}`}>
          <Avatar className="h-7 w-7">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <div className="w-full">
          <CardHeader className="flex flex-row justify-between items-center py-0 px-3 space-y-0">
            <CardDescription className="flex items-center space-x-1 text-sm">
              <Link
                href={`/profile/${comment.author.slug}`}
                className="text-primary underline-offset-4 hover:underline"
              >
                {comment.author.name}
              </Link>
              {comment.repliesTo && (
                <>
                  <ChevronRight size={20} />
                  <Link
                    href={`/profile/${comment.repliesTo.slug}`}
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    {comment.repliesTo.name}
                  </Link>
                </>
              )}
            </CardDescription>
            <div>
              <HiDotsHorizontal size={20} />
            </div>
          </CardHeader>
          <CardContent className="py-0  px-3">{children}</CardContent>
          <CardFooter className="flex justify-between py-0 px-3 space-x-4">
            <span className="text-xs">
              {new Date(comment.createdAt).toDateString()}
            </span>
            <div className="flex items-center align-baseline">
              <Toggle
                className="h-7 p-2 space-x-2"
                onPressedChange={() => setIsFormOpen(!isFormOpen)}
              >
                <BsChatSquare size={14} />
                <span>Reply</span>
              </Toggle>
              <Toggle
                className="h-7 p-2 space-x-2"
                onPressedChange={(value) => setVote(value ? 1 : 0)}
              >
                {vote ? <BsHeartFill size={14} /> : <BsHeart size={14} />}
                <span>{formatNumber(comment.votes + vote)}</span>
              </Toggle>
            </div>
          </CardFooter>
        </div>
      </div>
      {isFormOpen && (
        <CommentForm
          parentId={comment.id}
          postId={undefined}
          repliesToId={undefined}
          setIsFormOpen={setIsFormOpen}
          mutate={mutate}
        />
      )}
    </Card>
  )
}

export const NestedCommentCardWrapper = ({
  parentId,
  children,
  comment,
  mutate,
}: {
  parentId: string
  children: React.ReactNode
  comment: NestedCommentCardProps
  mutate: (data: z.infer<typeof CreateCommentSchema>) => void
}) => {
  const [vote, setVote] = useState(0)
  const [isFormOpen, setIsFormOpen] = useState(false)
  return (
    <Card className="flex flex-col space-y-1 shadow-none border-0 py-1">
      <div className="flex">
        <Link href={`/profile/${comment.author.slug}`}>
          <Avatar className="h-7 w-7">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <div className="w-full">
          <CardHeader className="flex flex-row justify-between items-center py-0 px-3 space-y-0">
            <CardDescription className="flex items-center space-x-1 text-sm">
              <Link
                href={`/profile/${comment.author.slug}`}
                className="text-primary underline-offset-4 hover:underline"
              >
                {comment.author.name}
              </Link>
              {comment.repliesTo && (
                <>
                  <ChevronRight size={20} />
                  <Link
                    href={`/profile/${comment.repliesTo.slug}`}
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    {comment.repliesTo.name}
                  </Link>
                </>
              )}
            </CardDescription>
            <div>
              <HiDotsHorizontal size={20} />
            </div>
          </CardHeader>
          <CardContent className="py-0  px-3">{children}</CardContent>
          <CardFooter className="flex justify-between py-0 px-3 space-x-4">
            <span className="text-xs">
              {new Date(comment.createdAt).toDateString()}
            </span>
            <div className="flex items-center align-baseline">
              <Toggle
                className="h-7 p-2 space-x-2"
                onPressedChange={() => setIsFormOpen(!isFormOpen)}
              >
                <BsChatSquare size={14} />
                <span>Reply</span>
              </Toggle>
              <Toggle
                className="h-7 p-2 space-x-2"
                onPressedChange={(value) => setVote(value ? 1 : 0)}
              >
                {vote ? <BsHeartFill size={14} /> : <BsHeart size={14} />}
                <span>{formatNumber(comment.votes + vote)}</span>
              </Toggle>
            </div>
          </CardFooter>
        </div>
      </div>
      {isFormOpen && (
        <CommentForm
          parentId={parentId}
          postId={undefined}
          repliesToId={comment.author.id}
          setIsFormOpen={setIsFormOpen}
          mutate={mutate}
        />
      )}
    </Card>
  )
}
