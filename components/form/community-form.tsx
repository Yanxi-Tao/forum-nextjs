'use client'

import { set, z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateCommunitySchema, UpdateCommunitySchema } from '@/schemas'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { CommunityDisplayProps, FormAlertProps } from '@/lib/types'
import { createCommunity } from '@/actions/community/create-community'
import { Textarea } from '@/components/ui/textarea'
import { FormAlert } from '@/components/form/form-alert'
import PulseLoader from 'react-spinners/PulseLoader'
import { useRouter } from 'next-nprogress-bar'
import { updateCommunity } from '@/actions/community/update-community'

export const CommunityCreateForm = () => {
  const router = useRouter()
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
    if (state.type === 'success') {
      router.push(`/community/${state.message}`)
      state.message = 'Community created successfully!'
    }
    setAlert(state)
  }
  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle>Create Community</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
            autoComplete="off"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Community Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription
                    className={form.formState.errors.name && 'text-destructive'}
                  >
                    {form.getValues('name').length < 1
                      ? 'Required'
                      : `${form.getValues('name').length}/100`}
                  </FormDescription>
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
                  <FormDescription
                    className={
                      form.formState.errors.description && 'text-destructive'
                    }
                  >
                    {form.getValues('description').length < 1
                      ? 'Required'
                      : `${form.getValues('description').length}/255`}
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormAlert alert={alert} />
            <div className="flex gap-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/communities')}
                className="w-full"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending || !form.formState.isValid}
                className="w-full"
              >
                {isPending ? (
                  <PulseLoader color="#8585ad" />
                ) : (
                  'Create Community'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export const CommunityUpdateForm = ({
  community,
}: {
  community: CommunityDisplayProps
}) => {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [alert, setAlert] = useState<FormAlertProps>(null)

  const form = useForm<z.infer<typeof UpdateCommunitySchema>>({
    resolver: zodResolver(UpdateCommunitySchema),
    defaultValues: {
      id: community.id,
      name: community.name || undefined,
      description: community.description || undefined,
      isPublic: true || undefined,
    },
    mode: 'all',
  })

  const onSubmit = async (data: z.infer<typeof UpdateCommunitySchema>) => {
    setAlert(null)
    setIsPending(true)
    const state = await updateCommunity(data)
    setIsPending(false)
    if (state.type === 'success') {
      router.push(`/community/${state.message}`)
      state.message = 'Community updated!'
    }
    setAlert({ ...state, message: state.message || 'Error updating community' })
  }
  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle>Update Community</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
            autoComplete="off"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Community Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription
                    className={form.formState.errors.name && 'text-destructive'}
                  >
                    {(form.getValues('name')?.length || 0) < 1
                      ? 'Required'
                      : `${form.getValues('name')?.length || 0}/100`}
                  </FormDescription>
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
            <FormAlert alert={alert} />
            <div className="flex gap-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/community/${community.slug}`)}
                className="w-full"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending || !form.formState.isValid}
                className="w-full"
              >
                {isPending ? (
                  <PulseLoader color="#8585ad" />
                ) : (
                  'Update Community'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
