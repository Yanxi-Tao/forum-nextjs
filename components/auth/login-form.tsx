'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { LoginSchema } from '@/schemas'
import { login } from '@/actions/auth/login'

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
import Link from 'next/link'
import { url } from 'inspector'
import { FormAlertProps } from '@/lib/types'

export const LoginForm = () => {
  const searchParams = useSearchParams()
  const callBackUrl = searchParams.get('callBackUrl')
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? {
          type: 'error',
          message: 'Email already exists',
        }
      : null

  const [isPending, startTransition] = useTransition()
  const [alert, setAlert] = useState<FormAlertProps>(null)

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (data: z.infer<typeof LoginSchema>) => {
    setAlert({ type: '', message: '' })
    startTransition(() => {
      login(data, callBackUrl).then((data) => {
        setAlert(data || { type: 'error', message: 'An error occurred' })
      })
    })
  }

  return (
    <AuthCardWrapper
      headerLabel="Welcome back"
      redirectLabel="Dont have an account? Register here"
      redirecrPath="/auth/register"
      showProvider={!isPending}
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" disabled={isPending} />
                    </FormControl>
                    <Button
                      variant="link"
                      size="sm"
                      className="px-0 font-normal"
                      asChild
                    >
                      <Link href="/auth/reset">Forgot password?</Link>
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormAlert alert={alert || urlError} />
            <Button type="submit" className="w-full" disabled={isPending}>
              Login
            </Button>
          </form>
        </Form>
      )}
    </AuthCardWrapper>
  )
}
