'use client'

import { ReportFormProps, ReportSchemaTypes } from '@/lib/types'
import { ReportSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { reportOptions } from '@/lib/constants'
import { useTransition } from 'react'
import { Textarea } from '../ui/textarea'
import { createReport } from '@/actions/report/create-report'
import { DialogClose } from '@radix-ui/react-dialog'

export const ReportForm = ({
  postId,
  reportUserId,
  userId,
  commentId,
  communitySlug,
  type,
}: ReportFormProps) => {
  const [isPending, startTransition] = useTransition()
  const form = useForm<ReportSchemaTypes>({
    resolver: zodResolver(ReportSchema),
    defaultValues: {
      type,
      reportUserId,
      postId,
      userId,
      commentId,
      communitySlug,
      reason: [],
      description: '',
    },
    mode: 'onChange',
  })

  const onSubmit = async (data: ReportSchemaTypes) => {
    startTransition(() => {
      createReport(data)
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="reason"
          render={() => (
            <FormItem>
              <FormLabel>Reasons</FormLabel>
              {reportOptions.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="reason"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className="flex items-center space-x-4 space-y-2"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item.id
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="!my-0">{item.label}</FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Report Reason Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormDescription
                className={
                  form.formState.errors.description && 'text-destructive'
                }
              >
                {(form.getValues('description')?.length || 0) < 1
                  ? 'Required'
                  : `${form.getValues('description')?.length || 0}/255`}
              </FormDescription>
            </FormItem>
          )}
        />
        <div className="flex gap-x-3">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="w-full">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type="submit"
              disabled={isPending || !form.formState.isValid}
              className="w-full"
            >
              Report
            </Button>
          </DialogClose>
        </div>
      </form>
    </Form>
  )
}
