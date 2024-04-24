'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useTransition } from 'react'
import { useSession } from 'next-auth/react'

import { settings } from '@/actions/settings'

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
import { Input } from '@/components/ui/input'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FormAlert } from '@/components/form/form-alert'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { FormAlertProps, UpdateSettingsSchemaTypes } from '@/lib/types'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next-nprogress-bar'
import { deleteUser } from '@/actions/user/delete-user'
import RingLoader from 'react-spinners/RingLoader'
import { UpdateSettingsSchema } from '@/schemas'

import { Eye, EyeOff } from 'lucide-react'

export const SettingsForm = () => {
  const user = useCurrentUser()
  const router = useRouter()
  const { update } = useSession()
  const [isPending, setIsPending] = useState(false)
  const [isDeleting, startDeleting] = useTransition()
  const [alert, setAlert] = useState<FormAlertProps>(null)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<UpdateSettingsSchemaTypes>({
    resolver: zodResolver(UpdateSettingsSchema),
    defaultValues: {
      name: user?.name || undefined,
      email: user?.email || undefined,
      oldPassword: '',
      newPassword: '',
    },
    mode: 'onChange',
  })

  const onSubmit = async (data: UpdateSettingsSchemaTypes) => {
    setAlert(null)
    setIsPending(true)
    const state = await settings(data)
    setIsPending(false)
    setAlert(state)
    if (state.type === 'success') {
      update()
    }
  }

  const onDelete = () => {
    startDeleting(() => {
      deleteUser(user?.id as string).then((data) => {
        if (data) {
          signOut()
          router.push('/auth/register')
        }
      })
    })
  }

  if (!user) {
    return <div>Settings Unavailable</div>
  }
  return (
    <Card className="border-0 shadow-none h-full">
      {!isDeleting ? (
        <>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          {user ? (
            <>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-5"
                  >
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="IBZN"
                                disabled={isPending}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="ibzn@example.com"
                                disabled={user.isOAuth || isPending}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {!user.isOAuth && (
                        <>
                          <FormField
                            control={form.control}
                            name="oldPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Old Password</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="password"
                                    placeholder="123456"
                                    disabled={isPending}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <div className="flex space-x-3">
                                  <FormControl className="">
                                    <Input
                                      {...field}
                                      type={showPassword ? 'text' : 'password'}
                                      placeholder="123456"
                                      disabled={isPending}
                                    />
                                  </FormControl>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
                                  >
                                    {showPassword ? <Eye /> : <EyeOff />}
                                  </Button>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}
                    </div>
                    <FormAlert alert={alert} />
                    <div className="flex gap-x-3">
                      <Button
                        type="reset"
                        className="w-full"
                        variant="outline"
                        disabled={isPending}
                        onClick={() => form.reset()}
                      >
                        Reset Settings
                      </Button>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={
                          isPending ||
                          !form.formState.isValid ||
                          !form.formState.isDirty
                        }
                      >
                        Update Settings
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="justify-center">
                <Button variant="destructive" onClick={onDelete}>
                  Delete Account
                </Button>
              </CardFooter>
            </>
          ) : (
            <p>Settings Unavailable</p>
          )}
        </>
      ) : (
        <div className="flex h-full justify-center items-center">
          <RingLoader />
        </div>
      )}
    </Card>
  )
}
