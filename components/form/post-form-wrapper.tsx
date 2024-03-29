'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const PostFormWrapper = ({
  children,
  headerLabel,
}: {
  children: React.ReactNode
  headerLabel: string
}) => {
  return (
    <Card className="py-2 border-0 shadow-none">
      <CardHeader className="py-2">
        <CardTitle className="text-xl">{headerLabel}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
