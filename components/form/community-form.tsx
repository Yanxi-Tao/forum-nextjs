'use client'

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
import { useState, useTransition } from 'react'
import {
  CommunityDisplayProps,
  CreateCommunitySchemaTypes,
  FormAlertProps,
  UpdateCommunitySchemaTypes,
} from '@/lib/types'
import { createCommunity } from '@/actions/community/create-community'
import { Textarea } from '@/components/ui/textarea'
import { FormAlert } from '@/components/form/form-alert'
import PulseLoader from 'react-spinners/PulseLoader'
import { useRouter } from 'next-nprogress-bar'
import { updateCommunity } from '@/actions/community/update-community'

export const CommunityCreateForm = () => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [alert, setAlert] = useState<FormAlertProps>(null)

  const form = useForm<CreateCommunitySchemaTypes>({
    resolver: zodResolver(CreateCommunitySchema),
    defaultValues: {
      name: '',
      description: '',
      isPublic: true,
    },
    mode: 'onChange',
  })

  const onSubmit = (data: CreateCommunitySchemaTypes) => {
    setAlert(null)
    startTransition(() => {
      createCommunity(data).then((data) => {
        if (data.type === 'success') {
          router.push(`/community/${data.message}`)
          data.message = 'Community created successfully!'
        }
        setAlert(data)
      })
    })
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
                      : `${form.getValues('name').length}/10`}
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
                Create Community
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
  const [isPending, startTransition] = useTransition()
  const [alert, setAlert] = useState<FormAlertProps>(null)

  const form = useForm<UpdateCommunitySchemaTypes>({
    resolver: zodResolver(UpdateCommunitySchema),
    defaultValues: {
      id: community.id,
      name: community.name,
      slug: community.slug,
      description: community.description,
      isPublic: true,
    },
    mode: 'onChange',
  })

  const onSubmit = (data: UpdateCommunitySchemaTypes) => {
    setAlert(null)
    startTransition(() => {
      updateCommunity(data).then((data) => {
        if (data.type === 'success') {
          router.push(`/community/${data.message}`)
          data.message = 'Community updated successfully!'
        }
        setAlert(data)
      })
    })
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
                      : `${form.getValues('name')?.length || 0}/10`}
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
                disabled={
                  isPending ||
                  !form.formState.isValid ||
                  !form.formState.isDirty
                }
                className="w-full"
              >
                Update Community
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
