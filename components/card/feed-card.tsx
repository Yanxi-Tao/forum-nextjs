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
import { Toggle } from '@/components/ui/toggle'
import { ArrowBigDown, ArrowBigUp, MessageSquare, Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FeedCardProps } from '@/lib/types'
import { formatNumber } from '@/lib/utils'

export const FeedCard = ({ post }: { post: FeedCardProps }) => {
  return (
    <Card className="hover:bg-muted/10 w-full h-fit py-1">
      <CardHeader className="px-4 py-0 flex flex-row items-center justify-between space-y-0">
        <div className="flex space-x-1 items-center">
          {post.communityId && (
            <>
              <Button variant="link" size="sm" className="p-0" asChild>
                <Link href={`/communities/${post.communitySlug}`}>
                  {post.communityName}
                </Link>
              </Button>
              <span>/</span>
            </>
          )}
          <Button variant="link" size="sm" asChild className="p-0">
            <Link href={`/profile/${post.authorSlug}`} className="m-0">
              {post.authorName}
            </Link>
          </Button>
        </div>
        <div>
          <span className=" text-xs" suppressHydrationWarning>
            {post.createdAt.toDateString()}
          </span>
        </div>
      </CardHeader>
      <Link href={`/${post.type.toLowerCase()}/${post.slug}`}>
        <CardHeader className="px-4 py-0">
          <CardTitle className=" text-lg">{post.title}</CardTitle>
        </CardHeader>
        <CardContent className="px-4 py-1">
          <p>{post.preview}</p>
        </CardContent>
      </Link>
      <CardFooter className="px-4 py-0 flex items-center gap-x-2 font-medium text-sm">
        <ToggleGroup type="single">
          <ToggleGroupItem size="sm" value="up">
            <ArrowBigUp size={24} />
          </ToggleGroupItem>
          {formatNumber(post.votes)}
          <ToggleGroupItem size="sm" value="down">
            <ArrowBigDown size={24} />
          </ToggleGroupItem>
        </ToggleGroup>
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/${post.type.toLowerCase()}/${post.questionId}`}>
            <MessageSquare size={22} className="mr-2" />
            {formatNumber(post.commentsCount)}
          </Link>
        </Button>
        <Toggle size="sm">
          <Bookmark size={22} className="mr-2" />
          Bookmark
        </Toggle>
        {/* todo: report dialog */}
      </CardFooter>
    </Card>
  )
}
