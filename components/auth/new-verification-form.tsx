'use client'

import { useSearchParams } from 'next/navigation'

import { RingLoader } from 'react-spinners'

import { AuthWrapper } from './auth-wrapper'
import { useCallback, useEffect, useState } from 'react'
import { newVerification } from '@/actions/new-verification'
import { FormError, FormSuccess } from './form-alerts'

export const NewVerificationForm = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')

  const onSubmit = useCallback(() => {
    if (!token) {
      setError('Token is required')
      return
    }
    newVerification(token)
      .then((data) => {
        setSuccess(data.success)
        setError(data.error)
      })
      .catch(() => {
        setError('Something went wrong. Please try again.')
      })
  }, [token])

  useEffect(() => {
    onSubmit()
  }, [onSubmit])

  return (
    <AuthWrapper
      headerLabel="Confirming your verification"
      backButtonLabel="back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex w-full items-center justify-center">
        {!(error || success) && <RingLoader color="#2563EB" />}
        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </AuthWrapper>
  )
}
