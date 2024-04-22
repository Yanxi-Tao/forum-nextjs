'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ResetSchema } from '@/schemas'
import { reset } from '@/actions/auth/reset'

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

export const ResetForm = () => {
  const [isPending, startTransition] = useTransition()
  const [alert, setAlert] = useState<FormAlertProps>(null)

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = (data: z.infer<typeof ResetSchema>) => {
    setAlert(null)
    startTransition(() => {
      reset(data).then((data) => {
        setAlert(data)
      })
    })
  }

  return (
    <AuthCardWrapper
      headerLabel="Forgot your password?"
      redirectLabel="Back to login"
      redirecrPath="/auth/login"
      showProvider={false}
    >
      {isPending ? (
        <div className="flex justify-center">
          <RingLoader />
        </div>
      ) : alert?.type === 'success' ? (
        <FormAlert alert={alert} />
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
            </div>
            {isPending ? (
              <div className="flex justify-center">
                <RingLoader />
              </div>
            ) : null}
            <FormAlert alert={alert} />
            <Button type="submit" className="w-full" disabled={isPending}>
              Send reset password email
            </Button>
          </form>
        </Form>
      )}
    </AuthCardWrapper>
  )
}
