'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useSession } from 'next-auth/react'

import { SettingsSchema } from '@/schemas'
import { settings } from '@/actions/settings'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { FormAlert } from '@/components/form/form-alert'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { FormAlertProps } from '@/lib/types'

export const SettingsForm = () => {
  const user = useCurrentUser()

  const { update } = useSession()
  const [isPending, setIsPending] = useState(false)
  const [alert, setAlert] = useState<FormAlertProps>(null)

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name || undefined,
      email: user?.email || undefined,
      oldPassword: undefined,
      newPassword: undefined,
    },
  })

  const onSubmit = async (data: z.infer<typeof SettingsSchema>) => {
    setAlert(null)
    setIsPending(true)
    const state = await settings(data)
    setIsPending(false)
    setAlert(state)
    if (state.type === 'success') {
      update()
    }
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
                        <Input {...field} placeholder="IBZN" disabled={isPending} />
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
                        <Input {...field} placeholder="ibzn@example.com" disabled={user.isOAuth || isPending} />
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
                            <Input {...field} type="password" placeholder="123456" disabled={isPending} />
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
                            <Input {...field} type="password" placeholder="123456" disabled={isPending} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>
              <FormAlert alert={alert} />
              <div className="flex gap-x-3">
                <Button type="reset" className="w-full" disabled={isPending} onClick={() => form.reset()}>
                  Reset Settings
                </Button>
                <Button type="submit" className="w-full" disabled={isPending}>
                  Update Settings
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <p>Settings Unavailable</p>
        )}
      </CardContent>
    </Card>
  )
}
