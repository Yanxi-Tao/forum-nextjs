import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useTransition,
} from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { createAnswer, createPost } from '@/actions/post'
import { CreateAnswerScheme, CreateQuestionOrArticleSchema } from '@/schemas'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { FormAlert } from '@/components/form/form-alert'
import { CreatePostType } from '@/lib/types'

export const QuestionOrArticleForm = ({ type }: { type: CreatePostType }) => {
  const [isPending, startTransition] = useTransition()
  const [alert, setAlert] = useState<{ type: string; message: string }>({
    type: '',
    message: '',
  })

  const form = useForm<z.infer<typeof CreateQuestionOrArticleSchema>>({
    resolver: zodResolver(CreateQuestionOrArticleSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  })

  const onSubmit = (data: z.infer<typeof CreateQuestionOrArticleSchema>) => {
    setAlert({ type: '', message: '' })
    startTransition(() => {
      createPost(data, type)
        .then((data) => {
          setAlert(data)
          if (data.type === 'success') {
            form.reset()
          }
        })
        .catch(() => {
          setAlert({ type: 'error', message: 'An error occurred' })
        })
    })
  }
  return (
    <Card className="py-6">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="flex flex-col space-y-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title (Required)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={isPending}
                        className="resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {type === 'QUESTION' ? 'Description' : 'Content'}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={isPending}
                        className="resize-none min-h-[200px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormAlert message={alert.message} type={alert.type} />
            <Button type="submit" disabled={isPending} className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export const AnswerForm = ({
  questionId,
  questionSlug,
  setAnswerFormOpen,
}: {
  questionId: string
  questionSlug: string | null
  setAnswerFormOpen: Dispatch<SetStateAction<boolean>>
}) => {
  const [isPending, startTransition] = useTransition()
  const [alert, setAlert] = useState<{ type: string; message: string }>({
    type: '',
    message: '',
  })

  const form = useForm<z.infer<typeof CreateAnswerScheme>>({
    resolver: zodResolver(CreateAnswerScheme),
    defaultValues: {
      content: '',
    },
  })

  const onSubmit = (data: z.infer<typeof CreateAnswerScheme>) => {
    setAlert({ type: '', message: '' })
    startTransition(() => {
      createAnswer(data, questionId, questionSlug)
        .then((data) => {
          setAlert(data)
          if (data.type === 'success') {
            form.reset()
            setAnswerFormOpen(false)
          }
        })
        .catch(() => {
          setAlert({ type: 'error', message: 'An error occurred' })
        })
    })
  }
  return (
    <Card className="py-2 border-0 shadow-none">
      <CardHeader className="py-2">
        <CardTitle className="text-xl">Your Answer</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="flex flex-col space-y-2">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={isPending}
                        className="resize-none min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormAlert message={alert.message} type={alert.type} />
            <Button type="submit" disabled={isPending} className="w-full">
              Post Answer
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
