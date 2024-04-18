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
import { useRef, useState } from 'react'
import PulseLoader from 'react-spinners/PulseLoader'
import { $getRoot, EditorState, LexicalEditor } from 'lexical'
import { Editor } from '@/components/editor'
import { $generateHtmlFromNodes } from '@lexical/html'
import { useQueryClient } from '@tanstack/react-query'
import { EXPLORE_POSTS_KEY } from '@/lib/constants'
import { useRouter } from 'next/navigation'

export const QuestionCreateForm = ({
  communitySlug,
  redirectTo,
}: {
  communitySlug: string | undefined
  redirectTo: string
}) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [alert, setAlert] = useState<FormAlertProps>(null)
  const [isPending, setIsPending] = useState(false)
  const form = useForm<z.infer<typeof CreatePostSchema>>({
    resolver: zodResolver(CreatePostSchema),
    defaultValues: {
      title: '',
      content: '',
      type: 'question',
      parentId: undefined,
      communitySlug,
    },
    mode: 'all',
  })

  const handleOnChange = (editorState: EditorState, editor: LexicalEditor) => {
    editorState.read(() => {
      form.setValue('content', $getRoot().getTextContent(), {
        shouldValidate: true,
      })
    })
    return
  }

  const editorRef = useRef<LexicalEditor | null>(null)

  const onSubmit = async (data: z.infer<typeof CreatePostSchema>) => {
    if (!editorRef.current) return
    setAlert(null)
    setIsPending(true)
    editorRef.current?.getEditorState().read(() => {
      if (!editorRef.current) return
      data.content = $generateHtmlFromNodes(editorRef.current, null)
    })
    const state = await createPost(data)
    setIsPending(false)
    setAlert(state)
    if (state?.type === 'success') {
      queryClient.invalidateQueries({
        queryKey: [EXPLORE_POSTS_KEY, { communitySlug }],
      })
      router.push(redirectTo)
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
                <FormLabel className="text-foreground">Description</FormLabel>
                <FormControl>
                  <Editor editorRef={editorRef} onChange={handleOnChange} />
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

export const ArticleCreateForm = ({
  communitySlug,
  redirectTo,
}: {
  communitySlug: string | undefined
  redirectTo: string
}) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [alert, setAlert] = useState<FormAlertProps>(null)
  const [isPending, setIsPending] = useState(false)
  const form = useForm<z.infer<typeof CreatePostSchema>>({
    resolver: zodResolver(CreatePostSchema),
    defaultValues: {
      title: '',
      content: '',
      type: 'article',
      parentId: undefined,
      communitySlug,
    },
    mode: 'all',
  })

  const handleOnChange = (editorState: EditorState, editor: LexicalEditor) => {
    editorState.read(() => {
      form.setValue('content', $getRoot().getTextContent(), {
        shouldValidate: true,
      })
    })
    return
  }

  const editorRef = useRef<LexicalEditor | null>(null)

  const onSubmit = async (data: z.infer<typeof CreatePostSchema>) => {
    if (!editorRef.current) return
    setAlert(null)
    setIsPending(true)
    editorRef.current?.getEditorState().read(() => {
      if (!editorRef.current) return
      data.content = $generateHtmlFromNodes(editorRef.current, null)
    })
    const state = await createPost(data)
    setIsPending(false)
    setAlert(state)
    if (state?.type === 'success') {
      queryClient.invalidateQueries({
        queryKey: [EXPLORE_POSTS_KEY, { communitySlug }],
      })
      router.push(redirectTo)
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
                <FormLabel className="text-foreground">Content</FormLabel>
                <FormControl>
                  <Editor editorRef={editorRef} onChange={handleOnChange} />
                </FormControl>
                <FormMessage />
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

export const AnswerCreateForm = ({
  title,
  parentId,
  communitySlug,
  mutate,
  setIsFormOpen,
}: {
  title: string
  parentId: string
  communitySlug: string | undefined
  mutate: (data: z.infer<typeof CreatePostSchema>) => void
  setIsFormOpen: (value: boolean) => void
}) => {
  // schema
  const form = useForm<z.infer<typeof CreatePostSchema>>({
    resolver: zodResolver(CreatePostSchema),
    defaultValues: {
      title,
      content: '',
      type: 'answer',
      parentId,
      communitySlug,
    },
    mode: 'all',
  })

  const handleOnChange = (editorState: EditorState, editor: LexicalEditor) => {
    editorState.read(() => {
      form.setValue('content', $getRoot().getTextContent(), {
        shouldValidate: true,
      })
    })
    return
  }

  const editorRef = useRef<LexicalEditor | null>(null)

  // form submit handler
  const onSubmit = (data: z.infer<typeof CreatePostSchema>) => {
    if (!editorRef.current) return
    editorRef.current?.getEditorState().read(() => {
      if (!editorRef.current) return
      data.content = $generateHtmlFromNodes(editorRef.current, null)
    })
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
                <Editor editorRef={editorRef} onChange={handleOnChange} />
              </FormControl>
              <FormDescription>
                Your answer helps others learn about this topic
              </FormDescription>
              <FormMessage />
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
