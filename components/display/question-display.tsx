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

export const QuesionDisplay = ({
  question,
  answers,
}: {
  question: NonNullable<PostDataProps>
  answers: AnswersDataProps
}) => {
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
                {question.updatedAt.toDateString()}
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
        </CardFooter>
      </Card>
    </div>
  )
}
