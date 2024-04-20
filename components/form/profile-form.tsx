'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UpdateProfileSchema } from '@/schemas'

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
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { FormAlertProps, UpdateProfileFormProps } from '@/lib/types'
import { Textarea } from '@/components/ui/textarea'
import { FormAlert } from '@/components/form/form-alert'
import PulseLoader from 'react-spinners/PulseLoader'
import { useRouter } from 'next/navigation'
import { updateProfile } from '@/actions/profile/update-profile'
import { UploadButton } from '@/lib/utils'

export const ProfileForm = ({
  editProfile,
}: {
  editProfile: UpdateProfileFormProps
}) => {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [alert, setAlert] = useState<FormAlertProps>(null)

  const form = useForm<z.infer<typeof UpdateProfileSchema>>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      bio: editProfile.profile?.bio || undefined,
    },
    mode: 'all',
  })

  const onSubmit = async (data: z.infer<typeof UpdateProfileSchema>) => {
    setAlert(null)
    setIsPending(true)
    const state = await updateProfile(data)
    setIsPending(false)
    if (state.type === 'success') {
      router.push('/profile')
    }
    setAlert(state)
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
            <div className="flex gap-x-3">
              <Button
                type="reset"
                variant="outline"
                onClick={() => router.push('profile')}
                className="w-full"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending || !form.formState.isValid}
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
