'use client'

import { AnswerCard } from '@/components/card/feed-card'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Toggle } from '@/components/ui/toggle'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { formatNumber } from '@/lib/utils'
import { answerCardTestData, feedCardTestData } from '@/testData'
import { ArrowBigDown, ArrowBigUp, Bookmark, MessageSquare } from 'lucide-react'
import Link from 'next/link'

export default function QuestionPage() {
  const post = feedCardTestData()
  const answer = answerCardTestData()
  return (
    <div>
      <Card className="border-0 shadow-none">
        <CardHeader>
          <div className="flex flex-row justify-between items-center">
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
          </div>
          <CardTitle>{post.title}</CardTitle>
        </CardHeader>
        <CardContent>{post.content}</CardContent>
        <CardFooter className="flex items-center gap-x-2 font-medium text-sm">
          <ToggleGroup type="single">
            <ToggleGroupItem size="sm" value="up">
              <ArrowBigUp size={24} />
            </ToggleGroupItem>
            {formatNumber(post.votes)}
            <ToggleGroupItem size="sm" value="down">
              <ArrowBigDown size={24} />
            </ToggleGroupItem>
          </ToggleGroup>
          <Button variant="ghost" size="sm">
            <MessageSquare size={22} className="mr-2" />
            {formatNumber(post.commentsCount)}
          </Button>
          <Toggle size="sm">
            <Bookmark size={22} className="mr-2" />
            Bookmark
          </Toggle>
        </CardFooter>
      </Card>
      <hr className="my-10" />
      <AnswerCard post={answer} />
      <AnswerCard post={answer} />
    </div>
  )
}
