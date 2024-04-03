'use client'

import Link from 'next/link'
import { useState } from 'react'
import { PostCardProps } from '@/lib/types'
import { formatNumber } from '@/lib/utils'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { BiSolidDownvote, BiUpvote, BiSolidUpvote, BiDownvote } from 'react-icons/bi'
import { BsChatSquare, BsBookmark, BsBookmarkFill } from 'react-icons/bs'
import { Button } from '@/components/ui/button'
import { Toggle } from '@/components/ui/toggle'
import { CommentDisplay } from '@/components/display/comment-display'
import { AvatarCard } from '@/components/card/avatar-card'
import { HiDotsHorizontal } from 'react-icons/hi'
import { HiFlag } from 'react-icons/hi2'
import { FiEdit } from 'react-icons/fi'
import { MdDelete } from 'react-icons/md'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { deletePost } from '@/actions/post/delete-post'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { EXPLORE_POSTS_KEY, QUESTION_ANSWERS_KEY } from '@/lib/constants'
import { useUpdateVote } from '@/hooks/useUpdateVote'
import { PostType } from '@prisma/client'

export const PostCardWrapper = ({
  id,
  children,
  title,
  type,
  author,
  community,
  updatedAt,
  upVotes,
  downVotes,
  _count,
  comments,
}: PostCardProps & { children: React.ReactNode }) => {
  const updateVote = useUpdateVote('post')
  const queryClient = useQueryClient()
  const queryKey = type === 'question' ? EXPLORE_POSTS_KEY : QUESTION_ANSWERS_KEY
  const { mutate } = useMutation({
    mutationFn: ({ id, type }: { id: string; type: PostType }) => deletePost(id, type),
    onSettled: async () => await queryClient.invalidateQueries({ queryKey: [queryKey] }),
  })

  const user = useCurrentUser()
  const userVoteStatus = upVotes.find((vote) => vote.id === user?.id) ? 1 : downVotes.find((vote) => vote.id === user?.id) ? -1 : 0
  const baseCount = upVotes.length - downVotes.length - userVoteStatus
  const [voteStatus, setVoteStatus] = useState(userVoteStatus)
  const [bookmark, setBookmark] = useState(false)

  if (!user || !user.name || !user.email || !user.id) {
    return null
  }

  const commentCount = comments.length > 0 ? comments.reduce((acc, comment) => acc + comment._count.children, 0) + comments.length : 0

  return (
    <Card className="shadow-none border-0 space-y-1 hover:bg-slate-100/50 py-1 pt-2">
      <CardHeader className="py-0 space-y-0.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            {(type === 'question' || type === 'article') && community ? (
              <Link href={`/communities/${community.slug}`}>
                <AvatarCard source={community.image} name={community.name} className="w-7 h-7 text-sm" />
              </Link>
            ) : (
              <Link href={`/profile/${author.slug}`}>
                <AvatarCard source={author.image} name={author.name} className="w-7 h-7 text-sm" />
              </Link>
            )}
            <Link
              href={(type === 'question' || type === 'article') && community ? `/communities/${community.slug}` : `/profile/${author.slug}`}
              className="text-primary underline-offset-4 hover:underline"
            >
              {(type === 'question' || type === 'article') && community ? `c/${community.name}` : `u/${author.name}`}
            </Link>
            <span className="text-muted-foreground">{new Date(updatedAt).toDateString()}</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <HiDotsHorizontal size={20} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <HiFlag size={16} className="mr-2" />
                Reprot
              </DropdownMenuItem>
              {user?.id === author.id && (
                <>
                  <DropdownMenuItem>
                    <FiEdit size={16} className="mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => mutate({ id, type })}>
                    <MdDelete size={16} className="mr-2" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {(type === 'question' || type === 'article') && (
          <Link href={`/${type}/${id}`}>
            <CardTitle className="text-base">{title}</CardTitle>
          </Link>
        )}
      </CardHeader>
      {type === 'question' || type === 'article' ? (
        <Link href={`/${type}/${id}`}>
          <CardContent className="py-1.5 max-h-[200px] overflow-hidden">{children}</CardContent>
        </Link>
      ) : (
        <CardContent className="py-1.5 max-h-[200px] overflow-hidden">{children}</CardContent>
      )}
      <Collapsible>
        <CardFooter className="py-0 space-x-4">
          <ToggleGroup
            type="single"
            onValueChange={(value) => {
              const voteValue = value === 'up' ? 1 : value === 'down' ? -1 : 0
              setVoteStatus(voteValue)
              updateVote(id, user.id as string, voteValue)
            }}
            className=" bg-muted/50 rounded-lg"
          >
            <ToggleGroupItem value="up" className="space-x-4" size="sm">
              {voteStatus === 1 ? <BiSolidUpvote size={16} /> : <BiUpvote size={16} />}
              <span className="mx-1">{formatNumber(baseCount + voteStatus)}</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="down" size="sm">
              {voteStatus === -1 ? <BiSolidDownvote size={16} /> : <BiDownvote size={16} />}
            </ToggleGroupItem>
          </ToggleGroup>
          {type === 'question' || type === 'article' ? (
            <Link href={`/${type}/${id}`}>
              <Button variant="ghost" size="sm">
                <BsChatSquare size={16} />
                <span className="ml-2">{formatNumber(_count.children)}</span>
              </Button>
            </Link>
          ) : (
            <CollapsibleTrigger asChild>
              <Button variant="ghost">
                <BsChatSquare size={16} />
                <span className="ml-2">{formatNumber(commentCount)}</span>
              </Button>
            </CollapsibleTrigger>
          )}
          <Toggle size="sm" onPressedChange={setBookmark}>
            {bookmark ? <BsBookmarkFill size={16} /> : <BsBookmark size={16} />}
            <span className="ml-2">Bookmark</span>
          </Toggle>
        </CardFooter>
        <CollapsibleContent className="bg-background hover:bg-background pt-2">
          <CommentDisplay postId={id} />
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
