'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import dynamic from 'next/dynamic'
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
import { CreatePostSchema, PostSchema } from '@/schemas'
import { createPost } from '@/actions/post/create-post'
import {
  CreatePostSchemaTypes,
  FormAlertProps,
  PostSchemaTypes,
  UpdatePostSchemaTypes,
} from '@/lib/types'
import { useState } from 'react'
import PulseLoader from 'react-spinners/PulseLoader'
import { useQueryClient } from '@tanstack/react-query'
import { EXPLORE_POSTS_KEY } from '@/lib/constants'
import { useRouter } from 'next-nprogress-bar'
import { updatePost } from '@/actions/post/update-post'

const Editor = dynamic(() =>
  import('@/components/editor').then((mod) => mod.Editor)
)

export const QuestionForm = ({
  communitySlug,
  postId,
  initialContent,
  initialTitle,
  redirectTo = '/',
  action,
}: {
  communitySlug?: string
  postId?: string
  initialContent?: string
  initialTitle?: string
  redirectTo?: string
  action: 'create' | 'update'
}) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [alert, setAlert] = useState<FormAlertProps>(null)
  const [editorHtml, setEditorHtml] = useState<string>('')
  const [isPending, setIsPending] = useState(false)

  const form = useForm<PostSchemaTypes>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      title: initialTitle || '',
      content: initialContent || '',
    },
  })

  const handleOnChange = (plainText: string, html: string) => {
    form.setValue('content', plainText, { shouldValidate: true })
    setEditorHtml(html)
  }

  const onSubmit = async (rawData: PostSchemaTypes) => {
    setAlert(null)
    setIsPending(true)
    rawData.content = editorHtml

    let state: FormAlertProps = null

    if (action === 'create') {
      const date: CreatePostSchemaTypes = {
        ...rawData,
        type: 'question',
        communitySlug,
      }
      state = await createPost(date)
    } else if (action === 'update' && postId) {
      const date: UpdatePostSchemaTypes = { ...rawData, postId }
      state = await updatePost(date)
    }

    setIsPending(false)
    if (state?.type === 'success') {
      queryClient.invalidateQueries({
        queryKey: [EXPLORE_POSTS_KEY, { communitySlug }],
      })
      router.push(redirectTo)
    } else {
      setAlert(state)
    }
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
                <FormLabel className="text-foreground">Question</FormLabel>
                <FormControl>
                  <Textarea {...field} disabled={isPending} autoFocus />
                </FormControl>
                <FormDescription
                  className={form.formState.errors.title && 'text-destructive'}
                >
                  {form.getValues('title').length < 1
                    ? 'Required'
                    : `Be specific: ${form.getValues('title').length}/255`}
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={() => (
              <FormItem>
                <FormLabel className="text-foreground" htmlFor={undefined}>
                  Description
                </FormLabel>
                <FormControl>
                  <Editor
                    onChange={handleOnChange}
                    initialContent={initialContent}
                  />
                </FormControl>
                <FormDescription>
                  [Required] Include all the information someone would need to
                  answer your question
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
        <FormAlert alert={alert} />
        <Button
          type="submit"
          disabled={isPending || !form.formState.isValid}
          className="w-full"
        >
          {isPending ? <PulseLoader color="#8585ad" /> : 'Create Question'}
        </Button>
      </form>
    </Form>
  )
}

export const ArticleForm = ({
  communitySlug,
  postId,
  initialContent,
  initialTitle,
  redirectTo = '/',
  action,
}: {
  communitySlug?: string
  postId?: string
  initialContent?: string
  initialTitle?: string
  redirectTo?: string
  action: 'create' | 'update'
}) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [alert, setAlert] = useState<FormAlertProps>(null)
  const [editorHtml, setEditorHtml] = useState<string>('')
  const [isPending, setIsPending] = useState(false)

  const form = useForm<PostSchemaTypes>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      title: initialTitle || '',
      content: initialContent || '',
    },
  })

  const handleOnChange = (plainText: string, html: string) => {
    form.setValue('content', plainText, { shouldValidate: true })
    setEditorHtml(html)
  }

  const onSubmit = async (rawData: PostSchemaTypes) => {
    setAlert(null)
    setIsPending(true)
    rawData.content = editorHtml

    let state: FormAlertProps = null

    if (action === 'create') {
      const date: CreatePostSchemaTypes = {
        ...rawData,
        type: 'article',
        communitySlug,
      }
      state = await createPost(date)
    } else if (action === 'update' && postId) {
      const date: UpdatePostSchemaTypes = { ...rawData, postId }
      state = await updatePost(date)
    }

    setIsPending(false)
    if (state?.type === 'success') {
      queryClient.invalidateQueries({
        queryKey: [EXPLORE_POSTS_KEY, { communitySlug }],
      })
      router.push(redirectTo)
    } else {
      setAlert(state)
    }
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
                <FormLabel className="text-foreground">Article Title</FormLabel>
                <FormControl>
                  <Textarea {...field} disabled={isPending} autoFocus />
                </FormControl>
                <FormDescription
                  className={form.formState.errors.title && 'text-destructive'}
                >
                  {form.getValues('title').length < 1
                    ? 'Required'
                    : `Be specific: ${form.getValues('title').length}/255`}
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={() => (
              <FormItem>
                <FormLabel className="text-foreground" htmlFor={undefined}>
                  Content
                </FormLabel>
                <FormControl>
                  <Editor
                    onChange={handleOnChange}
                    initialContent={initialContent}
                  />
                </FormControl>
                <FormDescription>[Required]</FormDescription>
              </FormItem>
            )}
          />
        </div>
        <FormAlert alert={alert} />
        <Button
          type="submit"
          disabled={isPending || !form.formState.isValid}
          className="w-full"
        >
          {isPending ? <PulseLoader color="#8585ad" /> : 'Create Article'}
        </Button>
      </form>
    </Form>
  )
}

export const AnswerCreateForm = ({
  title,
  parentId,
  parentUserId,
  communitySlug,
  mutate,
  setIsFormOpen,
}: {
  title: string
  parentId: string
  parentUserId: string | undefined
  communitySlug: string | undefined
  mutate: (data: CreatePostSchemaTypes) => void
  setIsFormOpen: (value: boolean) => void
}) => {
  // schema
  const [editorHtml, setEditorHtml] = useState<string>('')
  const form = useForm<CreatePostSchemaTypes>({
    resolver: zodResolver(CreatePostSchema),
    defaultValues: {
      title,
      content: '',
      type: 'answer',
      parentId,
      communitySlug,
    },
    mode: 'onChange',
  })

  const handleOnChange = (plainText: string, html: string) => {
    form.setValue('content', plainText, { shouldValidate: true })
    setEditorHtml(html)
  }

  // form submit handler
  const onSubmit = (data: CreatePostSchemaTypes) => {
    data.content = editorHtml
    mutate(data)
    setIsFormOpen(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 px-6">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Editor onChange={handleOnChange} />
              </FormControl>
              <FormDescription>
                [Required] Your answer helps others learn about this topic
              </FormDescription>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={!form.formState.isValid}
          className="w-full"
        >
          Create Answer
        </Button>
      </form>
    </Form>
  )
}
