'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { RegisterSchema } from '@/schemas'
import { register } from '@/actions/auth/register'

import { RingLoader, PuffLoader } from 'react-spinners'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { AuthCardWrapper } from './auth-card-wrapper'
import { FormAlert } from '@/components/form/form-alert'

export const RegisterForm = () => {
  const [submitType, setSubmitType] = useState<'register' | 'token'>('token')
  const [isPending, startTransition] = useTransition()
  const [alert, setAlert] = useState<{ type: string; message: string }>({
    type: '',
    message: '',
  })

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      token: '',
    },
  })

  const onSubmit = (data: z.infer<typeof RegisterSchema>) => {
    setAlert({ type: '', message: '' })
    startTransition(() => {
      register(data, submitType).then((data) => {
        setAlert(data || { type: 'error', message: 'An error occurred' })
        if (data?.message === 'Invalid token, please resend code') {
          form.setValue('token', '')
        }
      })
    })
  }
  return (
    <AuthCardWrapper
      headerLabel="Create an account"
      redirectLabel="Already have an account? Login here"
      redirecrPath="/auth/login"
      showProvider={!isPending}
    >
      {isPending && submitType === 'register' ? (
        <div className="flex justify-center">
          <RingLoader />
        </div>
      ) : (
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
                        disabled={isPending}
                      />
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
                    <FormLabel>Confirm Password</FormLabel>
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
                name="token"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Verification Code</FormLabel>
                    <FormControl>
                      <div className="flex gap-x-4">
                        <InputOTP maxLength={6} {...field} disabled={isPending}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                        <Button
                          onClick={() => setSubmitType('token')}
                          variant="outline"
                          disabled={isPending}
                        >
                          Send code
                        </Button>
                        {isPending && submitType === 'token' && (
                          <div className="flex justify-center">
                            <PuffLoader size={40} />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormAlert message={alert.message} type={alert.type} />
            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
              onClick={() => setSubmitType('register')}
            >
              Create Account
            </Button>
          </form>
        </Form>
      )}
    </AuthCardWrapper>
  )
}
