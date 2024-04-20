'use client'

import { AvatarCard, EditableAvatarCard } from '@/components/card/avatar-card'
import { PostCard } from '@/components/card/post-card'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { HiDotsHorizontal } from 'react-icons/hi'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileDisplayProps } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { currentUser } from '@/lib/auth'
import { useCurrentUser } from '@/hooks/useCurrentUser'

export const ProfileDisplay = ({
  profile,
}: {
  profile: ProfileDisplayProps
}) => {
  const router = useRouter()
  const user = useCurrentUser()
  if (!user) return null
  return (
    <Card className="border-0 shadow-none flex flex-col space-y-3">
      <CardHeader className="bg-muted rounded-xl">
        <div className="relative flex space-x-4">
          <EditableAvatarCard
            source={user.image}
            name={profile.name}
            className="h-36 w-36 text-3xl"
          />
          <div className="w-full mt-4 flex flex-col space-y-2">
            <CardTitle className="bg-muted rounded-lg">
              {profile.name}
            </CardTitle>
            <CardDescription>{profile.profile?.bio}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="h-fit focus:outline-none">
              <HiDotsHorizontal size={20} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => router.push('/profile/edit')}>
                Edit Profile
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="w-full px-0">
        <Tabs className="w-full" defaultValue="activities">
          <TabsList className="w-full">
            <TabsTrigger value="activities" className="w-full">
              Activities
            </TabsTrigger>
            <TabsTrigger value="questions" className="w-full">
              Questions
            </TabsTrigger>
            <TabsTrigger value="answers" className="w-full">
              Answers
            </TabsTrigger>
            <TabsTrigger value="articles" className="w-full">
              Articles
            </TabsTrigger>
            <TabsTrigger value="bookmarks" className="w-full">
              Bookmarks
            </TabsTrigger>
          </TabsList>
          <TabsContent value="activities" className="w-full">
            {profile.upVotedPosts.map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
          </TabsContent>
          <TabsContent value="questions" className="w-full">
            {profile.posts.map(
              (post) =>
                post.type === 'question' && <PostCard key={post.id} {...post} />
            )}
          </TabsContent>
          <TabsContent value="answers" className="w-full">
            {profile.posts.map(
              (post) =>
                post.type === 'answer' && <PostCard key={post.id} {...post} />
            )}
          </TabsContent>
          <TabsContent value="articles" className="w-full">
            {profile.posts.map(
              (post) =>
                post.type === 'article' && <PostCard key={post.id} {...post} />
            )}
          </TabsContent>
          <TabsContent value="bookmarks" className="w-full">
            {profile.bookmarkedPosts.map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
