import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'
import { DEFAULT_LOGIN_REDIRECT } from '@/constants'
import { FaGithub } from 'react-icons/fa'

export const OAuthGroup = () => {
  const onClick = (provider: 'github') => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    })
  }

  return (
    <Button
      variant="outline"
      className="w-full gap-x-4"
      type="button"
      onClick={() => onClick('github')}
    >
      <FaGithub className="h-6 w-6" />
      Github
    </Button>
  )
}
