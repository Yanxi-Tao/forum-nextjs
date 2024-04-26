'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { CreateCommentSchema } from '@/schemas'
import { CreateCommentSchemaTypes } from '@/lib/types'
import { Dispatch, SetStateAction, useState } from 'react'
import {
  AddedComment,
  CreateCommentMutate,
} from '@/components/display/comment-display'

export const CommentForm = ({
  postId,
  parentId,
  repliesToUserId,
  repliesToCommentId,
  mutate,
  setAddedComments,
}: Omit<CreateCommentSchemaTypes, 'content'> & {
  mutate: CreateCommentMutate
  setAddedComments: Dispatch<SetStateAction<[] | AddedComment[]>>
}) => {
  const [isPending, setIsPending] = useState(false)
  const form = useForm<CreateCommentSchemaTypes>({
    resolver: zodResolver(CreateCommentSchema),
    defaultValues: {
      content: '',
      postId,
      parentId,
      repliesToUserId,
      repliesToCommentId,
    },
    mode: 'onChange',
  })

  const onSubmit = (data: CreateCommentSchemaTypes) => {
    setIsPending(true)
    mutate(data, {
      onSuccess: (data) => {
        if (!data) return
        setAddedComments((prev) => [
          {
            newComment: data.newComment,
            replyId: data.replyId,
          },
          ...prev,
        ])
        form.reset()
      },
      onSettled: () => setIsPending(false),
    })
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
                  // onBlur={() => {
                  //   !form.getValues('content') && setIsFormOpen?.(false)
                  // }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isPending || !form.formState.isValid}
          className="w-full"
        >
          Comment
        </Button>
      </form>
    </Form>
  )
}
