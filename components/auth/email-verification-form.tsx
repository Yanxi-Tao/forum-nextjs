'use client'

import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { FormAlert } from '@/components/form/form-alert'
import { AuthCardWrapper } from './auth-card-wrapper'
import { emialVerification } from '@/actions/auth/email-verification'
import { RingLoader } from 'react-spinners'
import { FormAlertProps } from '@/lib/types'

export const EmailVerificationForm = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [alert, setAlert] = useState<FormAlertProps>(null)

  const onSubmit = useCallback(() => {
    if (alert) {
      return
    }

    if (!token) {
      setAlert({ type: 'error', message: 'Missing Token' })
      return
    }

    emialVerification(token)
      .then((data) => {
        setAlert(data)
      })
      .catch(() => {
        setAlert({ type: 'error', message: 'Something went wrong' })
      })
  }, [alert, token])

  useEffect(() => {
    onSubmit()
  }, [onSubmit])

  return (
    <AuthCardWrapper
      headerLabel="Email Verification"
      redirecrPath="/settings"
      redirectLabel="Back to settings"
      showProvider={false}
    >
      {!alert ? (
        <div className="flex items-center w-full justify-center">
          <RingLoader />
        </div>
      ) : (
        <FormAlert alert={alert} />
      )}
    </AuthCardWrapper>
  )
}
