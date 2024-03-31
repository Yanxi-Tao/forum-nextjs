'use client'
import Link from 'next/link'
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
import { PostCardProps } from '@/lib/types'
import { useState } from 'react'
import { formatNumber } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Toggle } from '@/components/ui/toggle'

export const PostCardWrapper = ({
  id,
  children,
  title,
  type,
  author,
  community,
  updatedAt,
  votes,
  _count,
}: PostCardProps & { children: React.ReactNode }) => {
  const [vote, setVote] = useState(0)
  const [bookmark, setBookmark] = useState(false)
  return (
    <Card className="shadow-none border-0 space-y-1 hover:bg-slate-100/50 py-1 pt-2">
      <CardHeader className="py-0 space-y-0.5">
        <CardDescription className="flex space-x-2 text-xs">
          <Link
            href={
              (type === 'question' || type === 'article') && community
                ? `/communities/${community.name}`
                : `/profile/${author.slug}`
            }
            className="text-primary underline-offset-4 hover:underline"
          >
            {(type === 'question' || type === 'article') && community
              ? `c/${community.name}`
              : `u/${author.name}`}
          </Link>
          <span className="text-muted-foreground">
            {new Date(updatedAt).toDateString()}
          </span>
        </CardDescription>
        {(type === 'question' || type === 'article') && (
          <Link href={`/${type}/${id}`}>
            <CardTitle className="text-base">{title}</CardTitle>
          </Link>
        )}
      </CardHeader>
      {type === 'question' || type === 'article' ? (
        <Link href={`/${type}/${id}`}>
          <CardContent className="py-1.5 max-h-[200px] overflow-hidden">
            {children}
          </CardContent>
        </Link>
      ) : (
        <CardContent className="py-1.5 max-h-[200px] overflow-hidden">
          {children}
        </CardContent>
      )}
      <CardFooter className="py-0 space-x-4">
        <ToggleGroup
          type="single"
          onValueChange={(value) =>
            setVote(value === 'up' ? 1 : value === 'down' ? -1 : 0)
          }
          className=" bg-muted/50 rounded-lg"
        >
          <ToggleGroupItem value="up" className="space-x-4" size="sm">
            {vote === 1 ? <BiSolidUpvote size={16} /> : <BiUpvote size={16} />}
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
        {type === 'question' || type === 'article' ? (
          <Link href={`/${type}/${id}`}>
            <Button variant="ghost" size="sm">
              <BsChatSquare size={16} />
              <span className="ml-2">{formatNumber(_count.children)}</span>
            </Button>
          </Link>
        ) : (
          <Button variant="ghost">
            <BsChatSquare size={16} />
            <span className="ml-2">{formatNumber(_count.children)}</span>
          </Button>
        )}
        <Toggle size="sm" onPressedChange={setBookmark}>
          {bookmark ? <BsBookmarkFill size={16} /> : <BsBookmark size={16} />}
          <span className="ml-2">Bookmark</span>
        </Toggle>
      </CardFooter>
    </Card>
  )
}
