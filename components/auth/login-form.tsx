'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { set, z } from 'zod'
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

export const LoginForm = () => {
  const [isPending, startTransition] = useTransition()
  const [alert, setAlert] = useState<{ type: string; message: string }>({
    type: '',
    message: '',
  })

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
      login(data).then((data) => {
        setAlert(data)
      })
    })
  }

  return (
    <>
      {isPending ? (
        <RingLoader />
      ) : (
        <AuthCardWrapper
          headerLabel="Welcom back"
          redirectLabel="Dont have an account? Register here"
          redirecrPath="/auth/register"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
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
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormAlert message={alert.message} type={alert.type} />
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </Form>
        </AuthCardWrapper>
      )}
    </>
  )
}
