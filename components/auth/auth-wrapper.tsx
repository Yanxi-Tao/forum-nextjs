import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
type AuthWrapperProps = {
  children?: React.ReactNode
  headerLabel: string
  backButtonLabel: string
  backButtonHref: string
}

export const AuthWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
}: AuthWrapperProps) => {
  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle className="flex justify-center">{headerLabel}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="justify-center">
        <Button variant="link" asChild>
          <Link href={backButtonHref}>{backButtonLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
