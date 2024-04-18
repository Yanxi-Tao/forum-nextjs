'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { PostCardProps } from '@/lib/types'
import { formatNumber } from '@/lib/utils'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  BiSolidDownvote,
  BiUpvote,
  BiSolidUpvote,
  BiDownvote,
} from 'react-icons/bi'
import { BsChatSquare, BsBookmark, BsBookmarkFill } from 'react-icons/bs'
import { MdOutlineClose } from 'react-icons/md'
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
import { useUpdateBookmark } from '@/hooks/useUpdateBookmark'
import { usePathname } from 'next/navigation'

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
  bookmarks,
  _count,
  comments,
  shouldCollapse,
}: PostCardProps & { children: React.ReactNode; shouldCollapse: boolean }) => {
  const updateVote = useUpdateVote('post')
  const updateBookmark = useUpdateBookmark()
  const queryClient = useQueryClient()
  const queryKey =
    type === 'question' ? EXPLORE_POSTS_KEY : QUESTION_ANSWERS_KEY
  const { mutate } = useMutation({
    mutationFn: ({ id, type }: { id: string; type: PostType }) =>
      deletePost(id, type),
    onSettled: async () =>
      await queryClient.invalidateQueries({ queryKey: [queryKey] }),
  })

  const user = useCurrentUser()
  const userVoteStatus = useMemo(
    () =>
      upVotes.find((vote) => vote.id === user?.id)
        ? 1
        : downVotes.find((vote) => vote.id === user?.id)
        ? -1
        : 0,
    [upVotes, downVotes, user?.id]
  )
  const userBookmarkStatus = useMemo(
    () =>
      bookmarks.find((bookmark) => bookmark.id === user?.id) ? true : false,
    [bookmarks, user?.id]
  )
  const baseCount = upVotes.length - downVotes.length - userVoteStatus
  const [voteStatus, setVoteStatus] = useState(userVoteStatus)
  const [bookmarkStatus, setBookmarkStatus] = useState(userBookmarkStatus)
  const [isCollapsed, setIsCollapsed] = useState(true)

  const commentCount = useMemo(
    () =>
      comments.length > 0
        ? comments.reduce((acc, comment) => acc + comment._count.children, 0) +
          comments.length
        : 0,
    [comments]
  )

  return (
    <Card className="relative shadow-none border-0 space-y-1 py-1 pt-2 max-w-[820px] break-words">
      <CardHeader className="py-0 space-y-0.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            {(type === 'question' || type === 'article') && community ? (
              <Link href={`/community/${community.slug}`}>
                <AvatarCard
                  source={community.image}
                  name={community.name}
                  className="w-7 h-7 text-sm"
                />
              </Link>
            ) : author ? (
              <Link href={`/profile/${author.slug}`}>
                <AvatarCard
                  source={author.image}
                  name={author.name}
                  className="w-7 h-7 text-sm"
                />
              </Link>
            ) : (
              <AvatarCard
                source={null}
                name="Deleted user"
                className="w-7 h-7 text-sm"
              />
            )}
            {(type === 'question' || type === 'article') && community ? (
              <Link
                href={`/community/${community.slug}`}
                className="text-primary underline-offset-4 hover:underline"
              >
                {`c/${community.name}`}
              </Link>
            ) : author ? (
              <Link
                href={`/profile/${author.slug}`}
                className="text-primary underline-offset-4 hover:underline"
              >
                {`u/${author.name}`}
              </Link>
            ) : (
              <span className="text-primary">Deleted user</span>
            )}
            <span className="text-muted-foreground">
              {new Date(updatedAt).toDateString()}
            </span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <HiDotsHorizontal size={20} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <HiFlag size={16} className="mr-2" />
                Report
              </DropdownMenuItem>
              {user?.id === author?.id && (
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
          <Link
            href={
              community
                ? `/community/${community.slug}/${type}/${id}`
                : `/${type}/${id}`
            }
          >
            <CardTitle className="text-base line-clamp-2">{title}</CardTitle>
          </Link>
        )}
      </CardHeader>
      {type === 'question' || type === 'article' ? (
        <Link
          href={
            community
              ? `/community/${community.slug}/${type}/${id}`
              : `/${type}/${id}`
          }
        >
          <CardContent className="py-1.5 max-h-[200px] break-words overflow-hidden line-clamp-3">
            {children}
          </CardContent>
        </Link>
      ) : (
        <CardContent
          className={`${
            isCollapsed && 'max-h-[200px] overflow-hidden'
          } py-1.5 break-words`}
        >
          {children}
        </CardContent>
      )}
      {shouldCollapse && type === 'answer' && isCollapsed && (
        <div className="absolute bottom-[40px] h-[200px] flex w-full justify-center items-end py-1 bg-gradient-to-t from-background to-transparent">
          <Button
            variant="link"
            size="sm"
            onClick={() => setIsCollapsed(false)}
            className="bg-background w-full"
          >
            Read More
          </Button>
        </div>
      )}
      <Collapsible
        className={`${!isCollapsed && 'sticky bottom-0'} bg-background`}
      >
        <CardFooter className="w-full py-1 justify-between">
          <div className="flex space-x-4 items-center">
            <ToggleGroup
              type="single"
              onValueChange={(value) => {
                if (!user) return
                const voteValue = value === 'up' ? 1 : value === 'down' ? -1 : 0
                setVoteStatus(voteValue)
                updateVote(id, user.id as string, voteValue)
              }}
              className=" bg-muted/50 rounded-lg"
            >
              <ToggleGroupItem value="up" className="space-x-4" size="sm">
                {voteStatus === 1 ? (
                  <BiSolidUpvote size={16} />
                ) : (
                  <BiUpvote size={16} />
                )}
                <span className="mx-1">
                  {formatNumber(baseCount + voteStatus)}
                </span>
              </ToggleGroupItem>
              <ToggleGroupItem value="down" size="sm">
                {voteStatus === -1 ? (
                  <BiSolidDownvote size={16} />
                ) : (
                  <BiDownvote size={16} />
                )}
              </ToggleGroupItem>
            </ToggleGroup>
            {type === 'question' || type === 'article' ? (
              <Link
                href={
                  community
                    ? `/community/${community.slug}/${type}/${id}`
                    : `/${type}/${id}`
                }
              >
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
            <Toggle
              size="sm"
              onPressedChange={(value) => {
                if (!user) return
                setBookmarkStatus(value)
                updateBookmark(id, user.id as string, value)
              }}
            >
              {bookmarkStatus ? (
                <BsBookmarkFill size={16} />
              ) : (
                <BsBookmark size={16} />
              )}
              <span className="ml-2">Bookmark</span>
            </Toggle>
          </div>
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(true)}
            >
              <span className="mr-2">Close</span>
              <MdOutlineClose size={16} />
            </Button>
          )}
        </CardFooter>
        <CollapsibleContent className="bg-background hover:bg-background pt-2">
          <CommentDisplay postId={id} />
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
