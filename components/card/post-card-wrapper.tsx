'use client'

import Link from 'next/link'

import { PostType } from '@prisma/client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Toggle } from '@/components/ui/toggle'
import { ArrowBigDown, ArrowBigUp, MessageSquare, Bookmark } from 'lucide-react'
import { formatNumber } from '@/lib/utils'
import { forwardRef, useState } from 'react'

export type PostCardWrapperProps = {
  children: React.ReactNode
  title: string
  slug: string
  shouldCollapse: boolean
  communityName: string | undefined
  authorName: string
  authorSlug: string
  votes: number
  counts: number
  type: PostType
}

export const PostCardWrapper = forwardRef<HTMLDivElement, PostCardWrapperProps>(
  (
    {
      children,
      title,
      slug,
      shouldCollapse,
      communityName,
      authorName,
      authorSlug,
      votes,
      counts,
      type,
    },
    ref
  ) => {
    const [isCollapsed, setIsCollapsed] = useState(true)

    return (
      <Card className="relative hover:bg-muted/10 w-full h-fit py-1" ref={ref}>
        <CardHeader className="px-4 py-0 flex flex-row items-center space-y-0 space-x-1">
          {communityName && (
            <>
              <Button variant="link" size="sm" className="p-0" asChild>
                <Link href={`/communities/${communityName}`}>
                  {communityName}
                </Link>
              </Button>
              <span>/</span>
            </>
          )}
          <Button variant="link" size="sm" asChild className="p-0">
            <Link href={`/profile/${authorSlug}`} className="m-0">
              {authorName}
            </Link>
          </Button>
        </CardHeader>
        <CardHeader className="px-4 py-0">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent
          className={`${
            isCollapsed && shouldCollapse && 'h-[100px]'
          } overflow-hidden text-ellipsis px-4 py-2`}
        >
          {children}
        </CardContent>
        {isCollapsed && shouldCollapse && (
          <div className="absolute bottom-[40px] h-[50px] flex w-full justify-center items-end py-1 bg-gradient-to-t from-background to-transparent">
            <Button
              variant="link"
              size="sm"
              onClick={() => setIsCollapsed(false)}
            >
              Read More
            </Button>
          </div>
        )}
        <CardFooter
          className={`px-4 py-0 flex justify-between items-center gap-x-2 font-medium text-sm ${
            !isCollapsed && 'sticky bottom-0'
          }`}
        >
          <div className="flex items-center gap-x-2">
            <ToggleGroup type="single">
              <ToggleGroupItem size="sm" value="up">
                <ArrowBigUp size={24} />
              </ToggleGroupItem>
              {formatNumber(votes)}
              <ToggleGroupItem size="sm" value="down">
                <ArrowBigDown size={24} />
              </ToggleGroupItem>
            </ToggleGroup>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/${type.toLowerCase()}/${slug}`}>
                <MessageSquare size={22} className="mr-2" />
                {formatNumber(counts)}
              </Link>
            </Button>
            <Toggle size="sm">
              <Bookmark size={22} className="mr-2" />
              Bookmark
            </Toggle>
          </div>
          {!isCollapsed && (
            <Button
              variant="link"
              size="sm"
              onClick={() => setIsCollapsed(true)}
            >
              Close
            </Button>
          )}
        </CardFooter>
      </Card>
    )
  }
)

PostCardWrapper.displayName = 'PostCardWrapper'
