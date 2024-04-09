'use client'
import { CommentCardProps, NestedCommentCardProps } from '@/lib/types'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { HiFlag } from 'react-icons/hi2'
import { FiEdit } from 'react-icons/fi'
import { MdDelete } from 'react-icons/md'

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
import { AvatarCard } from '@/components/card/avatar-card'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { deleteComment } from '@/actions/comment/delete-comment'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { COMMENT_KEY } from '@/lib/constants'
import { useUpdateVote } from '@/hooks/useUpdateVote'

export const CommentCardWrapper = ({
  children,
  comment,
  mutate,
}: {
  children: React.ReactNode
  comment: CommentCardProps
  mutate: (data: z.infer<typeof CreateCommentSchema>) => void
}) => {
  const updateVote = useUpdateVote('comment')
  const queryClient = useQueryClient()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const { mutate: deleteCurrentComment } = useMutation({
    mutationFn: deleteComment,
    onSettled: async () => await queryClient.invalidateQueries({ queryKey: [COMMENT_KEY, comment.postId] }),
  })

  const user = useCurrentUser()

  const userVoteStatus = comment.upVotes.find((vote) => vote.id === user?.id) ? 1 : 0
  const baseCount = comment.upVotes.length - userVoteStatus
  const [voteStatus, setVoteStatus] = useState(userVoteStatus)

  if (!user || !user.name || !user.email || !user.id) {
    return null
  }
  return (
    <Card className="flex flex-col space-y-1 shadow-none border-0 py-1">
      <div className="flex">
        {comment.author ? (
          <Link href={`/profile/${comment.author.slug}`}>
            <AvatarCard source={comment.author.image} name={comment.author.name} className="w-7 h-7 text-sm" />
          </Link>
        ) : (
          <AvatarCard source={null} name="deleted user" className="w-7 h-7 text-sm" />
        )}
        <div className="w-full">
          <CardHeader className="flex flex-row justify-between items-center py-0 px-3 space-y-0">
            <CardDescription className="flex items-center space-x-1 text-sm">
              {comment.author ? (
                <Link href={`/profile/${comment.author.slug}`} className="text-primary underline-offset-4 hover:underline">
                  {comment.author.name}
                </Link>
              ) : (
                <span>deleted user</span>
              )}
              {comment.repliesTo && (
                <>
                  <ChevronRight size={20} />
                  <Link href={`/profile/${comment.repliesTo.slug}`} className="text-primary underline-offset-4 hover:underline">
                    {comment.repliesTo.name}
                  </Link>
                </>
              )}
            </CardDescription>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <HiDotsHorizontal size={20} />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <HiFlag size={16} className="mr-2" />
                  Report
                </DropdownMenuItem>
                {user?.id === comment.authorId && (
                  <>
                    <DropdownMenuItem>
                      <FiEdit size={16} className="mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => deleteCurrentComment(comment.id)}>
                      <MdDelete size={16} className="mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="py-0  px-3">{children}</CardContent>
          <CardFooter className="flex justify-between py-0 px-3 space-x-4">
            <span className="text-xs">{new Date(comment.createdAt).toDateString()}</span>
            <div className="flex items-center align-baseline">
              <Toggle className="h-7 p-2 space-x-2" onPressedChange={() => setIsFormOpen(!isFormOpen)}>
                <BsChatSquare size={14} />
                <span>Reply</span>
              </Toggle>
              <Toggle
                className="h-7 p-2 space-x-2"
                onPressedChange={(value) => {
                  const voteValue = value ? 1 : 0
                  setVoteStatus(voteValue)
                  updateVote(comment.id, user.id as string, voteValue)
                }}
              >
                {voteStatus ? <BsHeartFill size={14} /> : <BsHeart size={14} />}
                <span>{formatNumber(baseCount + voteStatus)}</span>
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
          repliesToName={undefined}
          repliesToSlug={undefined}
          mutate={mutate}
        />
      )}
    </Card>
  )
}

export const NestedCommentCardWrapper = ({
  postId,
  parentId,
  children,
  comment,
  mutate,
}: {
  postId: string
  parentId: string
  children: React.ReactNode
  comment: NestedCommentCardProps
  mutate: (data: z.infer<typeof CreateCommentSchema>) => void
}) => {
  const updateVote = useUpdateVote('comment')
  const queryClient = useQueryClient()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const { mutate: deleteCurrentComment } = useMutation({
    mutationFn: deleteComment,
    onSettled: async () => await queryClient.invalidateQueries({ queryKey: [COMMENT_KEY, postId] }),
  })

  const user = useCurrentUser()

  const userVoteStatus = comment.upVotes.find((vote) => vote.id === user?.id) ? 1 : 0
  const baseCount = comment.upVotes.length - userVoteStatus
  const [voteStatus, setVoteStatus] = useState(userVoteStatus)

  if (!user || !user.name || !user.email || !user.id) {
    return null
  }
  return (
    <Card className="flex flex-col space-y-1 shadow-none border-0 py-1">
      <div className="flex">
        {comment.author ? (
          <Link href={`/profile/${comment.author.slug}`}>
            <AvatarCard source={comment.author.image} name={comment.author.name} className="w-7 h-7 text-sm" />
          </Link>
        ) : (
          <AvatarCard source={null} name="deleted user" className="w-7 h-7 text-sm" />
        )}
        <div className="w-full">
          <CardHeader className="flex flex-row justify-between items-center py-0 px-3 space-y-0">
            <CardDescription className="flex items-center space-x-1 text-sm">
              {comment.author ? (
                <Link href={`/profile/${comment.author.slug}`} className="text-primary underline-offset-4 hover:underline">
                  {comment.author.name}
                </Link>
              ) : (
                <span>deleted user</span>
              )}
              {comment.repliesTo && (
                <>
                  <ChevronRight size={20} />
                  <Link href={`/profile/${comment.repliesTo.slug}`} className="text-primary underline-offset-4 hover:underline">
                    {comment.repliesTo.name}
                  </Link>
                </>
              )}
            </CardDescription>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <HiDotsHorizontal size={20} />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <HiFlag size={16} className="mr-2" />
                  Report
                </DropdownMenuItem>
                {user?.id === comment.authorId && (
                  <>
                    <DropdownMenuItem>
                      <FiEdit size={16} className="mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => deleteCurrentComment(comment.id)}>
                      <MdDelete size={16} className="mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="py-0  px-3">{children}</CardContent>
          <CardFooter className="flex justify-between py-0 px-3 space-x-4">
            <span className="text-xs">{new Date(comment.createdAt).toDateString()}</span>
            <div className="flex items-center align-baseline">
              <Toggle className="h-7 p-2 space-x-2" onPressedChange={() => setIsFormOpen(!isFormOpen)}>
                <BsChatSquare size={14} />
                <span>Reply</span>
              </Toggle>
              <Toggle
                className="h-7 p-2 space-x-2"
                onPressedChange={(value) => {
                  const voteValue = value ? 1 : 0
                  setVoteStatus(voteValue)
                  updateVote(comment.id, user.id as string, voteValue)
                }}
              >
                {voteStatus ? <BsHeartFill size={14} /> : <BsHeart size={14} />}
                <span>{formatNumber(baseCount + voteStatus)}</span>
              </Toggle>
            </div>
          </CardFooter>
        </div>
      </div>
      {isFormOpen && comment.author && (
        <CommentForm
          parentId={parentId}
          postId={undefined}
          repliesToId={comment.author.id}
          repliesToName={comment.author.name}
          repliesToSlug={comment.author.slug as string}
          mutate={mutate}
        />
      )}
    </Card>
  )
}
