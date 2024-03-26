'use client'

import { useCallback, useEffect, useState } from 'react'
import { fetchMoreAnswers } from '@/actions/post'
import Link from 'next/link'
import { formatNumber } from '@/lib/utils'
import { useInView } from 'react-intersection-observer'

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
import { ArrowBigDown, ArrowBigUp, Bookmark, MessageSquare } from 'lucide-react'
import { AnswerForm } from '@/components/form/feed-form'
import { AnswerCard } from '@/components/card/feed-card'
import { QuestionDisplayType } from '@/lib/types'
import { Separator } from '@/components/ui/separator'
import { ANSWERS_FETCH_SPAN } from '@/constants'

export const QuestionDisplay = ({
  question,
  initialAnswers,
  myCursor,
}: QuestionDisplayType) => {
  const [isAnswewrFormOpen, setAnswerFormOpen] = useState(false)
  const [answers, setAnswers] = useState(initialAnswers) // Initialize answers as an empty array of type Answer[]
  const [cursor, setCursor] = useState(myCursor)
  const { ref, inView } = useInView()

  const loadMoreAnswers = useCallback(async () => {
    if (!question.slug || !cursor) {
      return
    }
    const { newAnswers, myCursor } = await fetchMoreAnswers(
      question.slug,
      ANSWERS_FETCH_SPAN,
      cursor
    )
    setAnswers([...(answers || []), ...(newAnswers || [])])
    setCursor(myCursor)
  }, [answers, cursor, question.slug])

  useEffect(() => {
    if (inView) {
      loadMoreAnswers()
    }
  }, [inView, loadMoreAnswers])

  return (
    <div>
      <Card className="border-0 shadow-none">
        <CardHeader>
          <div className="flex flex-row justify-between items-center">
            <div className="flex space-x-1 items-center">
              {question.community && (
                <>
                  <Button variant="link" size="sm" className="p-0" asChild>
                    <Link href={`/communities/${question.community.slug}`}>
                      {question.community.name}
                    </Link>
                  </Button>
                  <span>/</span>
                </>
              )}
              <Button variant="link" size="sm" asChild className="p-0">
                <Link href={`/profile/${question.author.slug}`} className="m-0">
                  {question.author.name}
                </Link>
              </Button>
            </div>
            <div>
              <span className="text-xs">
                {question.createdAt.toDateString()}
              </span>
            </div>
          </div>
          <CardTitle>{question.title}</CardTitle>
        </CardHeader>
        <CardContent>{question.content}</CardContent>
        <CardFooter className="flex justify-between font-medium text-sm">
          <div className="flex items-center gap-x-2">
            <ToggleGroup type="single">
              <ToggleGroupItem size="sm" value="up">
                <ArrowBigUp size={24} />
              </ToggleGroupItem>
              {formatNumber(question.votes)}
              <ToggleGroupItem size="sm" value="down">
                <ArrowBigDown size={24} />
              </ToggleGroupItem>
            </ToggleGroup>
            <Button variant="ghost" size="sm">
              <MessageSquare size={22} className="mr-2" />
              {formatNumber(question._count.answers)}
            </Button>
            <Toggle size="sm">
              <Bookmark size={22} className="mr-2" />
              Bookmark
            </Toggle>
          </div>
          <Button onClick={() => setAnswerFormOpen(!isAnswewrFormOpen)}>
            {isAnswewrFormOpen ? 'Close' : 'Answer'}
          </Button>
        </CardFooter>
      </Card>
      {/* anser form render on click */}
      {isAnswewrFormOpen && (
        <AnswerForm
          questionId={question.id}
          questionSlug={question.slug}
          setAnswerFormOpen={setAnswerFormOpen}
        />
      )}
      <Separator className="mb-6" />
      {/* answers mapping */}
      <div className="flex flex-col items-center gap-y-4">
        {answers?.map((answer) => (
          <AnswerCard key={answer.id} answer={answer} />
        ))}
      </div>
      <div ref={ref} className="h-10" />
    </div>
  )
}
