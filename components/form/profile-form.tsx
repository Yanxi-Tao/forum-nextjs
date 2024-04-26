'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UpdateProfileSchema } from '@/schemas'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { useState, useTransition } from 'react'
import {
  FormAlertProps,
  UpdateProfileFormProps,
  UpdateProfileSchemaTypes,
} from '@/lib/types'
import { Textarea } from '@/components/ui/textarea'
import { FormAlert } from '@/components/form/form-alert'
import PulseLoader from 'react-spinners/PulseLoader'
import { useRouter } from 'next-nprogress-bar'
import { updateProfile } from '@/actions/profile/update-profile'
import { Switch } from '../ui/switch'

export const ProfileForm = ({
  profile,
}: {
  profile: UpdateProfileFormProps
}) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [alert, setAlert] = useState<FormAlertProps>(null)

  const form = useForm<UpdateProfileSchemaTypes>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      bio: profile.bio || undefined,
      isPublic: profile.isPublic,
    },
    mode: 'onChange',
  })

  const onSubmit = (data: UpdateProfileSchemaTypes) => {
    setAlert(null)
    startTransition(() => {
      updateProfile(data).then((state) => {
        if (state.type === 'success') {
          router.push('/profile')
        }
        setAlert(state)
      })
    })
  }
  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
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
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormDescription
                    className={form.formState.errors.bio && 'text-destructive'}
                  >
                    {`${form.getValues('bio')?.length || 0}/100`}
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div>
                    <FormLabel>isPublic</FormLabel>
                    <FormDescription>
                      Your questions, answers, etc will be public to everyone
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormAlert alert={alert} />
            <div className="flex gap-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/profile')}
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
                {isPending ? <PulseLoader color="#8585ad" /> : 'Update Profile'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
