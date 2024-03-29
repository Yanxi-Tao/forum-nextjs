'use client'

import { AnswersDataProps, PostDataProps } from '@/lib/types'

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
import Link from 'next/link'
import { formatNumber } from '@/lib/utils'
import { useState, useOptimistic } from 'react'
import { AnswerForm } from '@/components/form/answer-form'
import { Separator } from '@/components/ui/separator'
import { AnswerCardList } from '../card/post-card-list'

export const QuesionDisplay = ({
  question,
  answers,
  offset,
}: {
  question: NonNullable<PostDataProps>
  answers: AnswersDataProps['answers']
  offset: number
}) => {
  const [isAnswerFormOpen, setIsAnswerFormOpen] = useState(false)
  const [optimisticAnswers, addOptimisticAnswers] = useOptimistic<
    AnswersDataProps['answers'],
    AnswersDataProps['answers'][number]
  >(answers, (prev, next: AnswersDataProps['answers'][number]) => {
    return [next, ...prev]
  })

  return (
    <div>
      <Card className="border-0 shadow-none">
        <CardHeader>
          <div className="flex flex-row justify-between items-center">
            <div className="flex space-x-1 items-center">
              {question.community && (
                <>
                  <Button variant="link" size="sm" className="p-0" asChild>
                    <Link href={`/communities/${question.community.name}`}>
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
                {new Date(question.updatedAt).toDateString()}
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
          <Button
            size="sm"
            onClick={() => setIsAnswerFormOpen(!isAnswerFormOpen)}
          >
            Answer
          </Button>
        </CardFooter>
      </Card>
      {isAnswerFormOpen && (
        <AnswerForm
          title={question.title}
          communityName={question.community?.name}
          questionId={question.id}
          addOptimisticAnswers={addOptimisticAnswers}
          setIsAnswerFormOpen={setIsAnswerFormOpen}
        />
      )}
      <Separator className="my-3" />
      <AnswerCardList
        answers={optimisticAnswers}
        offset={offset}
        questionSlug={question.slug}
      />
    </div>
  )
}
