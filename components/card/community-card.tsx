import { CommunityCardProps } from '@/lib/types'

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import { AvatarCard } from '@/components/card/avatar-card'

export const CommunityCard = ({
  community: { name, description, image, slug },
}: CommunityCardProps) => {
  return (
    <Card className="flex justify-between shadow-none border-0 p-2 hover:bg-muted">
      <Link href={`/communities/${slug}`}>
        <AvatarCard source={image} name={name} className="h-14 w-14 text-xl" />
      </Link>
      <div className="w-full">
        <Link href={`/community/${slug}`}>
          <CardHeader className="py-0 px-3">
            <CardTitle className=" text-lg">{name}</CardTitle>
            <CardDescription className="text-sm">{description}</CardDescription>
          </CardHeader>
        </Link>
      </div>
    </Card>
  )
}
