'use client'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { CreateCommentSchema } from '@/schemas'

export const CommentForm = ({
  postId,
  parentId,
  repliesToId,
  repliesToName,
  repliesToSlug,
  mutate,
  setIsFormOpen,
}: {
  parentId: string | undefined
  postId: string | undefined
  repliesToId: string | undefined
  repliesToName: string | undefined
  repliesToSlug: string | undefined
  mutate: (data: z.infer<typeof CreateCommentSchema>) => void
  setIsFormOpen?: (value: boolean) => void
}) => {
  // schema
  const form = useForm<z.infer<typeof CreateCommentSchema>>({
    resolver: zodResolver(CreateCommentSchema),
    defaultValues: {
      content: '',
      postId,
      parentId,
      repliesToId,
      repliesToName,
      repliesToSlug,
    },
    mode: 'all',
  })

  // form submit handler
  const onSubmit = (data: z.infer<typeof CreateCommentSchema>) => {
    setIsFormOpen?.(false)
    mutate(data)
    form.reset()
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
                <Textarea
                  autoFocus={!!!postId}
                  {...field}
                  className=" min-h-10"
                  placeholder="Enter your comment here..."
                  onBlur={() => {
                    !form.getValues('content') && setIsFormOpen?.(false)
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={!form.formState.isValid} className="w-full">
          Comment
        </Button>
      </form>
    </Form>
  )
}
