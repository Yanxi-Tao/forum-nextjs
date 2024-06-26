'use client'
import { CommentCardProps } from '@/lib/types'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { HiFlag } from 'react-icons/hi2'
import { MdDelete } from 'react-icons/md'

import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Toggle } from '@/components/ui/toggle'
import { formatNumber } from '@/lib/utils'
import { BsChatSquare, BsHeart, BsHeartFill } from 'react-icons/bs'
import { HiDotsHorizontal } from 'react-icons/hi'
import { useState } from 'react'
import { CommentForm } from '@/components/form/comment-form'
import { AvatarCard } from '@/components/card/avatar-card'
import { useCurrentUser } from '@/hooks/user'
import { DELETED_CONTENT, DELETED_USER } from '@/lib/constants'
import { useUpdateVote } from '@/hooks/post'
import { useDeleteComment } from '@/hooks/comment'
import { AddedComment } from '@/components/display/comment-display'
import { ReportForm } from '@/components/form/report-form'

export const CommentCard = ({ comment, mutate }: CommentCardProps) => {
  const {
    id,
    postId,
    upVotes,
    author,
    repliesTo,
    authorId,
    content,
    parentId,
  } = comment

  const updateVote = useUpdateVote('comment')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const deleteCurrentComment = useDeleteComment(postId)
  const user = useCurrentUser()

  const userVoteStatus = upVotes.find((vote) => vote.id === user?.id) ? 1 : 0
  const baseCount = upVotes.length - userVoteStatus
  const [voteStatus, setVoteStatus] = useState(userVoteStatus)

  const [addedComments, setAddedComments] = useState<AddedComment[] | []>([])

  return (
    <>
      <Card className="flex flex-col space-y-1 shadow-none border-0 py-1">
        <div className="flex break-words">
          {author ? (
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
              name={DELETED_USER}
              isDeleted
              className="w-7 h-7 text-sm"
            />
          )}
          <div className="w-full">
            <CardHeader className="flex flex-row justify-between items-center py-0 px-3 space-y-0">
              <CardDescription className="flex items-center space-x-1 text-sm">
                {author ? (
                  <Link href={`/profile/${author.slug}`} className="link">
                    {author.name}
                  </Link>
                ) : (
                  <span>{DELETED_USER}</span>
                )}
                {repliesTo && (
                  <>
                    <ChevronRight size={20} />
                    <Link href={`/profile/${repliesTo.slug}`} className="link">
                      {repliesTo.name}
                    </Link>
                  </>
                )}
              </CardDescription>
              <Dialog>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <HiDotsHorizontal size={20} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {user?.id && (
                      <DialogTrigger asChild>
                        <DropdownMenuItem>
                          <HiFlag size={16} className="mr-2" />
                          Report
                        </DropdownMenuItem>
                      </DialogTrigger>
                    )}
                    {user?.id === authorId && content !== DELETED_CONTENT && (
                      <DropdownMenuItem
                        onSelect={() => deleteCurrentComment(id)}
                      >
                        <MdDelete size={16} className="mr-2" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Report</DialogTitle>
                  </DialogHeader>
                  <ReportForm
                    commentId={id}
                    reportUserId={user?.id as string}
                    type="comment"
                  />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent
              className={`py-0 px-3 break-words ${
                parentId ? 'max-w-[690px]' : 'max-w-[740px]'
              }`}
            >
              {content}
            </CardContent>
            <CardFooter className="flex justify-between py-0 px-3 space-x-4">
              <span className="text-xs">
                {new Date(comment.createdAt).toDateString()}
              </span>
              <div className="flex items-center align-baseline min-h-7">
                {user?.id && content !== DELETED_CONTENT && (
                  <>
                    <Toggle
                      className="h-7 p-2 space-x-2"
                      onPressedChange={() => setIsFormOpen(!isFormOpen)}
                    >
                      <BsChatSquare size={14} />
                      <span>Reply</span>
                    </Toggle>
                    <Toggle
                      className="h-7 p-2 space-x-2"
                      onPressedChange={(value) => {
                        const voteValue = value ? 1 : 0
                        setVoteStatus(voteValue)
                        updateVote(id, user.id, voteValue)
                      }}
                    >
                      {voteStatus ? (
                        <BsHeartFill size={14} />
                      ) : (
                        <BsHeart size={14} />
                      )}
                      <span>{formatNumber(baseCount + voteStatus)}</span>
                    </Toggle>
                  </>
                )}
              </div>
            </CardFooter>
          </div>
        </div>
        {isFormOpen && (
          <div className="pl-9 pr-0.5">
            <CommentForm
              parentId={parentId ? parentId : id}
              postId={postId}
              repliesToUserId={parentId ? author?.id : undefined}
              repliesToCommentId={parentId ? id : undefined}
              setAddedComments={setAddedComments}
              mutate={mutate}
              setIsFormOpen={setIsFormOpen}
            />
          </div>
        )}
      </Card>
      <div className={`${!parentId && 'pl-12 w-full'}`}>
        {addedComments.map((addedComment) => (
          <CommentCard
            key={addedComment.newComment.id}
            comment={addedComment.newComment}
            mutate={mutate}
          />
        ))}
      </div>
    </>
  )
}
