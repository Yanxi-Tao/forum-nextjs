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
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { FormAlert } from '@/components/form/form-alert'
import { PostSchema } from '@/schemas'
import { createPost } from '@/actions/post/create-post'
import {
  CreatePostSchemaTypes,
  FormAlertProps,
  PostFormProps,
  PostSchemaTypes,
  UpdatePostSchemaTypes,
} from '@/lib/types'
import { useState } from 'react'
import PulseLoader from 'react-spinners/PulseLoader'
import { useQueryClient } from '@tanstack/react-query'
import { EXPLORE_POSTS_KEY, MY_ANSWER_KEY } from '@/lib/constants'
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
  action,
  pathname,
}: PostFormProps) => {
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
      const date: UpdatePostSchemaTypes = {
        ...rawData,
        postId,
        pathname,
        type: 'question',
      }
      state = await updatePost(date)
    }

    setIsPending(false)
    if (state?.type === 'success') {
      queryClient.invalidateQueries({
        queryKey: [EXPLORE_POSTS_KEY, { communitySlug }],
      })
      router.push(pathname ?? '/')
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
                <FormDescription>
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
                  {form.getValues('content').length < 1
                    ? 'Required'
                    : 'Include all the information someone would need to answer your question'}
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
        <FormAlert alert={alert} />
        <div className="flex gap-x-3">
          {action === 'update' && (
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(pathname ?? '/')}
              className="w-full"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={isPending || !form.formState.isValid}
            className="w-full"
          >
            {isPending ? (
              <PulseLoader color="#8585ad" />
            ) : (
              `${action === 'create' ? 'Create' : 'Update'} Question`
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export const ArticleForm = ({
  communitySlug,
  postId,
  initialContent,
  initialTitle,
  action,
  pathname,
}: PostFormProps) => {
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
      const date: UpdatePostSchemaTypes = {
        ...rawData,
        postId,
        pathname,
        type: 'article',
      }
      state = await updatePost(date)
    }
    setIsPending(false)
    if (state?.type === 'success') {
      queryClient.invalidateQueries({
        queryKey: [EXPLORE_POSTS_KEY, { communitySlug }],
      })
      router.push(pathname ?? '/')
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
                <FormDescription>
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
                <FormDescription>
                  {form.getValues('content').length < 1
                    ? 'Required'
                    : 'Share your knowledge with the community'}
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
        <FormAlert alert={alert} />
        <div className="flex gap-x-3">
          {action === 'update' && (
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(pathname ?? '/')}
              className="w-full"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={isPending || !form.formState.isValid}
            className="w-full"
          >
            {isPending ? (
              <PulseLoader color="#8585ad" />
            ) : (
              `${action === 'create' ? 'Create' : 'Update'} Article`
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export const AnswerForm = ({
  communitySlug,
  pathname,
  postId,
  initialContent,
  initialTitle,
  parentId,
  action,
  setIsFormOpen,
  parentUserId,
}: PostFormProps) => {
  const queryClient = useQueryClient()
  const [alert, setAlert] = useState<FormAlertProps>(null)
  const [editorHtml, setEditorHtml] = useState<string>('')
  const [isPending, setIsPending] = useState(false)

  const handleOnChange = (plainText: string, html: string) => {
    form.setValue('content', plainText, { shouldValidate: true })
    setEditorHtml(html)
  }

  const form = useForm<PostSchemaTypes>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      title: initialTitle || '',
      content: initialContent || '',
    },
  })

  const onSubmit = async (rawData: PostSchemaTypes) => {
    setAlert(null)
    setIsPending(true)
    rawData.content = editorHtml
    let state: FormAlertProps = null
    if (action === 'create') {
      const date: CreatePostSchemaTypes = {
        ...rawData,
        type: 'answer',
        communitySlug,
        parentId,
        parentUserId,
        pathname,
      }
      state = await createPost(date)
    } else if (action === 'update' && postId) {
      const date: UpdatePostSchemaTypes = {
        ...rawData,
        postId,
        parentUserId,
        pathname,
        type: 'answer',
      }
      state = await updatePost(date)
    }
    if (state?.type === 'success') {
      queryClient
        .invalidateQueries({
          queryKey: [MY_ANSWER_KEY],
        })
        .then(() => setIsFormOpen?.(false))
    } else {
      setIsPending(false)
      setAlert(state)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 px-6">
        <FormField
          control={form.control}
          name="content"
          render={() => (
            <FormItem>
              <FormLabel className="text-foreground" htmlFor={undefined}>
                Your Answer
              </FormLabel>
              <FormControl>
                <Editor
                  onChange={handleOnChange}
                  initialContent={initialContent}
                />
              </FormControl>
              <FormDescription>
                {form.getValues('content').length < 1
                  ? 'Required'
                  : 'Answer the question with your knowledge and expertise'}
              </FormDescription>
            </FormItem>
          )}
        />
        <FormAlert alert={alert} />
        <div className="flex gap-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsFormOpen?.(false)}
            className="w-full"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending || !form.formState.isValid}
            className="w-full"
          >
            {`${action === 'create' ? 'Create' : 'Update'} Answer`}
          </Button>
        </div>
      </form>
    </Form>
  )
}
