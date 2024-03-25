import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { formatNumber } from '@/lib/utils'
import { Community } from '@prisma/client'
import { CommunityCardProps } from '@/lib/types'

export const CommunityCard = ({
  community,
}: {
  community: CommunityCardProps
}) => {
  return (
    <Card className="hover:bg-muted/10 py-1">
      <Link href={`/communities/${community.slug}`}>
        <CardHeader className="px-4 py-0">
          <CardTitle className=" text-lg">{community.name}</CardTitle>
          <CardDescription className="flex space-x-2 text-sm">
            <span>{`Posts ${formatNumber(community.postsCount)}`}</span>
            <span>|</span>
            <span>{`Members ${formatNumber(community.membersCount)}`}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 py-1">{community.description}</CardContent>
      </Link>
    </Card>
  )
}
