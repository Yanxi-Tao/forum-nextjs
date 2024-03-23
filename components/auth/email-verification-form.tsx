'use client'

import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { FormAlert } from '@/components/form/form-alert'
import { AuthCardWrapper } from './auth-card-wrapper'
import { emialVerification } from '@/actions/auth/email-verification'
import { RingLoader } from 'react-spinners'

export const EmailVerificationForm = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [alert, setAlert] = useState<{ type: string; message: string }>({
    type: '',
    message: '',
  })

  const onSubmit = useCallback(() => {
    if (alert.type || alert.message) {
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
      {!alert.type || !alert.message ? (
        <div className="flex items-center w-full justify-center">
          <RingLoader />
        </div>
      ) : (
        <FormAlert type={alert.type} message={alert.message} />
      )}
    </AuthCardWrapper>
  )
}
