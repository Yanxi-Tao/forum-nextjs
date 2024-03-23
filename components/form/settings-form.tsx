'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useTransition } from 'react'
import { useSession } from 'next-auth/react'

import { SettingsSchema } from '@/schemas'
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
import { FormAlert } from './form-alert'
import { useCurrentUser } from '@/hooks/useCurrentUser'

export const SettingsForm = () => {
  const user = useCurrentUser()

  const { update } = useSession()
  const [isPending, startTransition] = useTransition()
  const [alert, setAlert] = useState<{ type: string; message: string }>({
    type: '',
    message: '',
  })

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name || undefined,
      email: user?.email || undefined,
      oldPassword: undefined,
      newPassword: undefined,
    },
  })

  const onSubmit = (data: z.infer<typeof SettingsSchema>) => {
    setAlert({ type: '', message: '' })
    startTransition(() => {
      settings(data)
        .then((data) => {
          setAlert(data)
          if (data.type === 'success') {
            update()
          }
        })
        .catch(() => {
          setAlert({
            type: 'error',
            message: 'An error occurred. Please try again.',
          })
        })
    })
  }
  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent>
        {user ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                  </>
                )}
              </div>
              <FormAlert message={alert.message} type={alert.type} />
              <Button type="submit" className="w-full" disabled={isPending}>
                Update Settings
              </Button>
            </form>
          </Form>
        ) : (
          <p>Settings Unavailable</p>
        )}
      </CardContent>
    </Card>
  )
}
