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
import { CreateCommentSchema } from '@/schemas'

export const CommentForm = ({
  parentId,
  postId,
  repliesToId,
  mutate,
  setIsFormOpen,
}: {
  parentId: string | undefined
  postId: string | undefined
  repliesToId: string | undefined
  mutate: (data: z.infer<typeof CreateCommentSchema>) => void
  setIsFormOpen: (value: boolean) => void
}) => {
  // schema
  const form = useForm<z.infer<typeof CreateCommentSchema>>({
    resolver: zodResolver(CreateCommentSchema),
    defaultValues: {
      content: '',
      postId,
      parentId,
      repliesToId,
    },
    mode: 'onChange',
  })

  // form submit handler
  const onSubmit = (data: z.infer<typeof CreateCommentSchema>) => {
    mutate(data)
    setIsFormOpen(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={!form.formState.isValid}
          className="w-full"
        >
          Comment
        </Button>
      </form>
    </Form>
  )
}
