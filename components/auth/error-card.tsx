import { AuthCardWrapper } from './auth-card-wrapper'
import { TriangleAlert } from 'lucide-react'

export const AuthErrorCard = () => {
  return (
    <AuthCardWrapper
      headerLabel="Authentication Error"
      redirectLabel="Back to login"
      redirecrPath="/auth/login"
      showProvider={false}
    >
      <div className="flex justify-center items-center">
        <TriangleAlert className="w-16 h-16 text-destructive" />
      </div>
    </AuthCardWrapper>
  )
}
