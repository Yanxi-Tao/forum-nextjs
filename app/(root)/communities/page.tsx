import { CommunityCard } from '@/components/card/community-card'
import { CommunityCardProps } from '@/lib/types'

import { communityTestData } from '@/testData'

export default function MyCommunitiesPage() {
  return (
    <div className="flex flex-col space-y-2">
      {[...Array(10)].map((_, i) => (
        <CommunityCard key={i} community={communityTestData()} />
      ))}
    </div>
  )
}
