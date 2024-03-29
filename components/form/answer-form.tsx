import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

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

import { PostFormWrapper } from './post-form-wrapper'
import { SetStateAction, useState, useTransition } from 'react'
import { CreatePostSchema } from '@/schemas'
import { createPost } from '@/actions/post/create-post'
import { AnswersDataProps } from '@/lib/types'
import { useCurrentUser } from '@/hooks/useCurrentUser'

export const AnswerForm = ({
  communityName,
  questionId,
  title,
  addOptimisticAnswers,
  setIsAnswerFormOpen,
}: {
  communityName: string | undefined
  questionId: string
  title: string
  addOptimisticAnswers: (action: AnswersDataProps['answers'][number]) => void
  setIsAnswerFormOpen: (value: SetStateAction<boolean>) => void
}) => {
  const user = useCurrentUser()
  const [isPending, startTransition] = useTransition()
  const [alert, setAlert] = useState<{ type: string; message: string }>({
    type: '',
    message: '',
  })
  const form = useForm<z.infer<typeof CreatePostSchema>>({
    resolver: zodResolver(CreatePostSchema),
    defaultValues: {
      title: title,
      content: '',
      type: 'ANSWER',
      questionId: questionId,
      communityName: communityName,
    },
  })

  const onSubmit = async (data: z.infer<typeof CreatePostSchema>) => {
    setIsAnswerFormOpen(false) // close form immediately
    if (!user || !user.name) return

    addOptimisticAnswers({
      id: user.id,
      content: data.content,
      updatedAt: new Date(),
      votes: 0,
      author: {
        slug: user.slug,
        name: user.name,
        image: user.image || null,
      },
      _count: {
        comments: 0,
      },
    })
    setAlert({ type: '', message: '' })
    const response = await createPost(data)
    setAlert(response)
  }

  return (
    <PostFormWrapper headerLabel="Create an Answer">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex flex-col space-y-2">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormAlert message={alert.message} type={alert.type} />
          <Button type="submit" disabled={isPending} className="w-full">
            Answer
          </Button>
        </form>
      </Form>
    </PostFormWrapper>
  )
}
