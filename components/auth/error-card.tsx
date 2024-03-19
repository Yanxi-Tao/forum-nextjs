import { AuthWrapper } from './auth-wrapper'
import { TriangleAlert } from 'lucide-react'

export const ErrorCard = () => {
  return (
    <AuthWrapper
      headerLabel="Oops! Something went wrong!"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="w-full flex justify-center items-center text-destructive">
        <TriangleAlert className="h-12 w-12" />
      </div>
    </AuthWrapper>
  )
}
