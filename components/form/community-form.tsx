'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateCommunitySchema } from '@/schemas'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { FormAlertProps } from '@/lib/types'
import { createCommunity } from '@/actions/community/create-community'
import { Textarea } from '@/components/ui/textarea'
import { FormAlert } from '@/components/form/form-alert'
import PulseLoader from 'react-spinners/PulseLoader'

export const CommunityForm = () => {
  const [isPending, setIsPending] = useState(false)
  const [alert, setAlert] = useState<FormAlertProps>(null)

  const form = useForm<z.infer<typeof CreateCommunitySchema>>({
    resolver: zodResolver(CreateCommunitySchema),
    defaultValues: {
      name: '',
      description: '',
      isPublic: true,
    },
    mode: 'all',
  })

  const onSubmit = async (data: z.infer<typeof CreateCommunitySchema>) => {
    setAlert(null)
    setIsPending(true)
    const state = await createCommunity(data)
    setIsPending(false)
    setAlert(state)
    if (state.type === 'success') {
      form.reset()
    }
  }
  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle>Create Community</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Community Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Community Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex items-center space-y-0 space-x-3">
                  <FormLabel>Public</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            /> */}
            <FormAlert alert={alert} />
            <Button type="submit" disabled={isPending || !form.formState.isValid} className="w-full">
              {isPending ? <PulseLoader color="#8585ad" /> : 'Create Community'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
