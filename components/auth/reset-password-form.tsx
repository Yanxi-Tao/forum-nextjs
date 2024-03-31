'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ResetPasswordSchema } from '@/schemas'
import { resetPassword } from '@/actions/auth/reset-password'

import { RingLoader } from 'react-spinners'
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

import { AuthCardWrapper } from './auth-card-wrapper'
import { FormAlert } from '@/components/form/form-alert'
import { FormAlertProps } from '@/lib/types'

export const ResetPasswordForm = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [isPending, startTransition] = useTransition()
  const [alert, setAlert] = useState<FormAlertProps>(null)

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = (data: z.infer<typeof ResetPasswordSchema>) => {
    setAlert({ type: '', message: '' })
    startTransition(() => {
      resetPassword(data, token).then((data) => {
        setAlert(data)
      })
    })
  }

  return (
    <AuthCardWrapper
      headerLabel="Reset Password"
      redirectLabel="Back to login"
      redirecrPath="/auth/login"
      showProvider={false}
    >
      {isPending ? (
        <div className="flex justify-center">
          <RingLoader />
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="password"
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
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
            </div>
            {isPending ? (
              <div className="flex justify-center">
                <RingLoader />
              </div>
            ) : null}
            <FormAlert alert={alert} />
            <Button type="submit" className="w-full" disabled={isPending}>
              Reset Password
            </Button>
          </form>
        </Form>
      )}
    </AuthCardWrapper>
  )
}
