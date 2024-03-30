'use client'

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
import { CreatePostSchema } from '@/schemas'
import { createPost } from '@/actions/post/create-post'
import { FormAlertProps } from '@/lib/types'
import { useState } from 'react'
import { PulseLoader } from 'react-spinners'

export const QuestionForm = ({
  communityName,
}: {
  communityName: string | undefined
}) => {
  const [alert, setAlert] = useState<FormAlertProps>(null)
  const [isPending, setIsPending] = useState(false)
  const form = useForm<z.infer<typeof CreatePostSchema>>({
    resolver: zodResolver(CreatePostSchema),
    defaultValues: {
      title: '',
      content: '',
      type: 'question',
      parentId: undefined,
      communityId: undefined,
      communityName,
    },
  })

  const onSubmit = async (data: z.infer<typeof CreatePostSchema>) => {
    setAlert(null)
    setIsPending(true)
    const state = await createPost(data)
    setIsPending(false)
    setAlert(state)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="flex flex-col space-y-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question</FormLabel>
                <FormControl>
                  <Textarea {...field} disabled={isPending} />
                </FormControl>
                <FormDescription>Be specific</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} disabled={isPending} />
                </FormControl>
                <FormDescription>
                  Include all the information someone would need to answer your
                  question
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormAlert alert={alert} />
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? <PulseLoader color="#8585ad" /> : 'Create Question'}
        </Button>
      </form>
    </Form>
  )
}

export const AnswerForm = ({
  title,
  parentId,
  communityId,
  communityName,
}: {
  title: string
  parentId: string
  communityId: string
  communityName: string
}) => {
  const [alert, setAlert] = useState<FormAlertProps>(null)
  const [isPending, setIsPending] = useState(false)
  const form = useForm<z.infer<typeof CreatePostSchema>>({
    resolver: zodResolver(CreatePostSchema),
    defaultValues: {
      title,
      content: '',
      type: 'answer',
      parentId,
      communityName,
      communityId,
    },
  })

  const onSubmit = async (data: z.infer<typeof CreatePostSchema>) => {
    setAlert(null)
    setIsPending(true)
    const state = await createPost(data)
    setIsPending(false)
    setAlert(state)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="flex flex-col space-y-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question</FormLabel>
                <FormControl>
                  <Textarea {...field} disabled={isPending} />
                </FormControl>
                <FormDescription>Be specific</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} disabled={isPending} />
                </FormControl>
                <FormDescription>
                  Include all the information someone would need to answer your
                  question
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormAlert alert={alert} />
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? <PulseLoader color="#8585ad" /> : 'Create Question'}
        </Button>
      </form>
    </Form>
  )
}
