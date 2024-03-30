'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  BiSolidDownvote,
  BiUpvote,
  BiSolidUpvote,
  BiDownvote,
} from 'react-icons/bi'
import { BsChatSquare, BsBookmark, BsBookmarkFill } from 'react-icons/bs'
import { formatNumber } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Toggle } from '@/components/ui/toggle'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FetchAnswerQueryKey, QuestionDisplayProps } from '@/lib/types'
import { AnswerForm } from '../form/post-form'
import { ANSWERS_FETCH_SPAN } from '@/lib/constants'
import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchAnswers } from '@/actions/post/fetch-post'
import { useInView } from 'react-intersection-observer'
import { PostCard } from '../card/post-card'

export default function QuestionDisplay({
  id,
  title,
  content,
  author,
  community,
  updatedAt,
  _count,
  votes,
}: QuestionDisplayProps) {
  const { ref, inView } = useInView()
  const queryKey: FetchAnswerQueryKey = [
    'question-answers',
    {
      parentId: id,
      offset: 0,
      take: ANSWERS_FETCH_SPAN,
    },
  ]
  const { data, isSuccess, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => fetchAnswers(pageParam),
    initialPageParam: { queryKey },
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
      if (!lastPage.nextOffset) return undefined
      lastPageParam.queryKey[1].offset = lastPage.nextOffset

      return lastPageParam
    },
  })
  const [vote, setVote] = useState(0)
  const [bookmark, setBookmark] = useState(false)

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage])

  return (
    <div>
      <Card className="border-0 shadow-none">
        <CardHeader>
          <div className="flex flex-row justify-between items-center">
            <div className="flex space-x-1 items-center">
              {community && (
                <>
                  <Button variant="link" size="sm" className="p-0" asChild>
                    <Link href={`/communities/${community.name}`}>
                      {community.name}
                    </Link>
                  </Button>
                  <span>/</span>
                </>
              )}
              <Button variant="link" size="sm" asChild className="p-0">
                <Link href={`/profile/${author.slug}`} className="m-0">
                  {author.name}
                </Link>
              </Button>
            </div>
            <div>
              <span className="text-xs">
                {new Date(updatedAt).toDateString()}
              </span>
            </div>
          </div>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>{content}</CardContent>
        <CardFooter className="py-0 space-x-4">
          <ToggleGroup
            type="single"
            onValueChange={(value) =>
              setVote(value === 'up' ? 1 : value === 'down' ? -1 : 0)
            }
            className=" bg-muted/50 rounded-lg"
          >
            <ToggleGroupItem value="up" className="space-x-4" size="sm">
              {vote === 1 ? (
                <BiSolidUpvote size={16} />
              ) : (
                <BiUpvote size={16} />
              )}
              <span className="mx-1">{formatNumber(votes + vote)}</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="down" size="sm">
              {vote === -1 ? (
                <BiSolidDownvote size={16} />
              ) : (
                <BiDownvote size={16} />
              )}
            </ToggleGroupItem>
          </ToggleGroup>
          <Button variant="ghost">
            <BsChatSquare size={16} />
            <span className="ml-2">{formatNumber(_count.children)}</span>
          </Button>
          <Toggle size="sm" onPressedChange={setBookmark}>
            {bookmark ? <BsBookmarkFill size={16} /> : <BsBookmark size={16} />}
            <span className="ml-2">Bookmark</span>
          </Toggle>
        </CardFooter>
      </Card>
      <AnswerForm
        title={title}
        parentId={id}
        communityId={community?.id}
        communityName={community?.name}
      />
      {isSuccess &&
        data.pages.map((page) =>
          page.answers.map((post) => {
            if (page.answers.indexOf(post) === page.answers.length - 1) {
              return (
                <div key={post.id} ref={ref}>
                  <PostCard {...post} />
                </div>
              )
            } else {
              return <PostCard key={post.id} {...post} />
            }
          })
        )}
    </div>
  )
}
