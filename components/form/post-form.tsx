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

import { PostFormWrapper } from './post-form-wrapper'
import { useState, useTransition } from 'react'
import { CreatePostSchema } from '@/schemas'
import { createPost } from '@/actions/post/create-post'

export const QuestionForm = ({
  communityName,
}: {
  communityName: string | undefined
}) => {
  const [isPending, startTransition] = useTransition()
  const [alert, setAlert] = useState<{ type: string; message: string }>({
    type: '',
    message: '',
  })

  const form = useForm<z.infer<typeof CreatePostSchema>>({
    resolver: zodResolver(CreatePostSchema),
    defaultValues: {
      title: '',
      content: '',
      type: 'QUESTION',
      questionId: undefined,
      communityName: communityName,
    },
  })

  const onSubmit = (data: z.infer<typeof CreatePostSchema>) => {
    setAlert({ type: '', message: '' })
    startTransition(() => {
      createPost(data)
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
    <PostFormWrapper headerLabel="Ask a question">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex flex-col space-y-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Textarea {...field} disabled={isPending} />
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
                  <FormLabel>Description</FormLabel>
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
            Ask
          </Button>
        </form>
      </Form>
    </PostFormWrapper>
  )
}

export const ArticleForm = ({
  communityName,
}: {
  communityName: string | undefined
}) => {
  const [isPending, startTransition] = useTransition()
  const [alert, setAlert] = useState<{ type: string; message: string }>({
    type: '',
    message: '',
  })

  const form = useForm<z.infer<typeof CreatePostSchema>>({
    resolver: zodResolver(CreatePostSchema),
    defaultValues: {
      title: '',
      content: '',
      type: 'ARTICLE',
      questionId: undefined,
      communityName: communityName,
    },
  })

  const onSubmit = (data: z.infer<typeof CreatePostSchema>) => {
    setAlert({ type: '', message: '' })
    startTransition(() => {
      createPost(data)
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
    <PostFormWrapper headerLabel="Create an Article">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex flex-col space-y-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Textarea {...field} disabled={isPending} />
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
                  <FormLabel>Content</FormLabel>
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
            Create
          </Button>
        </form>
      </Form>
    </PostFormWrapper>
  )
}
