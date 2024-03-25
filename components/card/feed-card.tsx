'use client'

import Link from 'next/link'
import { useState } from 'react'
import { formatNumber } from '@/lib/utils'

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
import { Button } from '@/components/ui/button'
import { ArrowBigDown, ArrowBigUp, MessageSquare, Bookmark } from 'lucide-react'
import { QuestionOrArticleCardProps, AnswerCardProps } from '@/lib/types'

export const PostCard = ({ post }: { post: QuestionOrArticleCardProps }) => {
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
          <span className="text-xs">{post.createdAt.toDateString()}</span>
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

export const AnswerCard = ({ answer }: { answer: AnswerCardProps }) => {
  const [isCollapsed, setIsCollapsed] = useState(answer.content.length > 200)
  return (
    <Card className="hover:bg-muted/10 w-full h-fit relative">
      <CardHeader className="flex flex-row items-center py-2 justify-between space-y-0">
        <Button variant="link" size="sm" asChild className="p-0">
          <Link href={`/profile/${answer.author.slug}`} className="m-0">
            {answer.author.name}
          </Link>
        </Button>
        <div>
          <span className=" text-xs">{answer.createdAt.toDateString()}</span>
        </div>
      </CardHeader>
      <CardContent
        className={`${
          isCollapsed && 'h-[100px]'
        } overflow-hidden text-ellipsis py-2`}
      >
        {answer.content}
      </CardContent>
      {isCollapsed && (
        <div className="absolute bottom-[52px] h-[50px] flex w-full justify-center items-end py-1 bg-gradient-to-t from-background to-transparent">
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
        className={`${
          !isCollapsed && 'sticky bottom-0'
        } bg-background flex justify-between items-center py-2 font-medium text-sm`}
      >
        <div className="flex items-center gap-x-2">
          <ToggleGroup type="single">
            <ToggleGroupItem size="sm" value="up">
              <ArrowBigUp size={24} />
            </ToggleGroupItem>
            {formatNumber(answer.votes)}
            <ToggleGroupItem size="sm" value="down">
              <ArrowBigDown size={24} />
            </ToggleGroupItem>
          </ToggleGroup>
          <Button variant="ghost" size="sm" asChild>
            <Link href="">
              <MessageSquare size={22} className="mr-2" />
              {formatNumber(answer._count.comments)}
            </Link>
          </Button>
          <Toggle size="sm">
            <Bookmark size={22} className="mr-2" />
            Bookmark
          </Toggle>
        </div>
        {!isCollapsed && (
          <Button variant="link" size="sm" onClick={() => setIsCollapsed(true)}>
            Close
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
