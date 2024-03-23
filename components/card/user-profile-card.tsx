'use client'

import { useParams, useRouter } from 'next/navigation'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { userProfileNavs } from '@/constants'
import { useCurrentUser } from '@/hooks/useCurrentUser'

export const UserProfileCard = () => {
  const currentUser = useCurrentUser()
  const router = useRouter()
  const params = useParams()

  if (!currentUser) {
    return null
  }

  const userId = params.profile?.[0] || currentUser.id
  const activeTab = params.profile?.[1] || 'activities'

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          value={activeTab}
          onValueChange={(newTab) => {
            router.push(`/profile/${userId}/${newTab}`)
          }}
          className="w-full"
        >
          <TabsList className="w-full">
            {userProfileNavs.map((nav) => (
              <TabsTrigger key={nav.value} value={nav.value} className="w-full">
                {nav.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {userProfileNavs.map((nav) => (
            <TabsContent key={nav.value} value={nav.value} className="w-full">
              {nav.label}
            </TabsContent>
          ))}
          <TabsContent value="password">Change your password here.</TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  )
}
