'use client'

import { useEffect, useState, useTransition } from 'react'
import { fetchQuestionInitial } from '@/actions/post'
import Link from 'next/link'
import { formatNumber } from '@/lib/utils'
import { GetQuestionBySlugType } from '@/db/post'
import { GetAnswersByQuestionSlugType } from '@/db/answer'

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

export default function QuestionPage({
  params,
}: {
  params: { questionSlug: string }
}) {
  const questionSlug = params.questionSlug
  const [answers, setAnswers] = useState<GetAnswersByQuestionSlugType | null>(
    null
  )
  const [question, setQuestion] = useState<GetQuestionBySlugType | null>(null)
  const [isInitalLoading, startInitialLoading] = useTransition()
  const [myCursor, setMyCursor] = useState<string | undefined>(undefined)

  useEffect(() => {
    startInitialLoading(() => {
      fetchQuestionInitial(questionSlug, 5)
        .then((data) => {
          const { question, answers, myCursor } = data
          setQuestion(question)
          setAnswers(answers)
          setMyCursor(myCursor)
        })
        .catch(() => {
          console.log('Failed to fetch question')
        })
    })
  }, [questionSlug])

  return (
    <div>
      {question && !isInitalLoading ? (
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
                  <Link
                    href={`/profile/${question.author.slug}`}
                    className="m-0"
                  >
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
          <CardFooter className="flex items-center gap-x-2 font-medium text-sm">
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
          </CardFooter>
        </Card>
      ) : (
        <div>Loading</div>
      )}
    </div>
  )
}
