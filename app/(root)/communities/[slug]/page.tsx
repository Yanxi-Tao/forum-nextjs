import { getCommunityBySlug } from '@/data/community'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AvatarCard } from '@/components/card/avatar-card'

export default async function CommunitiesPage({ params: { slug } }: { params: { slug: string } }) {
  const community = await getCommunityBySlug(slug)
  if (!community) return null
  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="bg-muted rounded-xl">
        <div className="relative flex justify-between">
          <AvatarCard source={community.image} name={community.name} className="h-36 w-36 text-3xl" />
          <div className="absolute left-28 top-28">
            <CardTitle className="bg-muted rounded-lg p-1 px-2">{community.name}</CardTitle>
          </div>
          <div>actions</div>
        </div>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
    </Card>
  )
}
