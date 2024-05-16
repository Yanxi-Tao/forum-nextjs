'use client'

import { AvatarCard, EditableAvatarCard } from '@/components/card/avatar-card'
import { PostCard } from '@/components/card/post-card'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { HiDotsHorizontal } from 'react-icons/hi'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileDisplayProps } from '@/lib/types'
import { useCurrentUser } from '@/hooks/user'
import Link from 'next/link'
import { HiFlag } from 'react-icons/hi2'
import { ReportForm } from '@/components/form/report-form'

export const ProfileDisplay = ({ profile }: ProfileDisplayProps) => {
  const user = useCurrentUser()
  if (!user) return null
  return (
    <Card className="border-0 shadow-none flex flex-col space-y-3">
      <CardHeader className="bg-muted rounded-xl">
        <div className="flex space-x-4">
          {user.id === profile.id ? (
            <EditableAvatarCard
              source={user.image}
              name={profile.name}
              slug={user.slug}
              type="user"
              className="h-36 w-36 text-3xl"
            />
          ) : (
            <AvatarCard
              source={profile.image}
              name={profile.name}
              className="h-36 w-36 text-3xl"
            />
          )}
          <div className="w-full mt-4 flex flex-col space-y-2">
            <CardTitle className="bg-muted rounded-lg">
              {profile.name}
            </CardTitle>
            <CardDescription>
              {profile.profile?.bio || 'user has no bio yet ~'}
            </CardDescription>
          </div>
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger className="h-fit focus:outline-none">
                <HiDotsHorizontal size={20} />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {user?.id && (
                  <DialogTrigger asChild>
                    <DropdownMenuItem>
                      <HiFlag size={16} className="mr-2" />
                      Report
                    </DropdownMenuItem>
                  </DialogTrigger>
                )}
                {user.id === profile.id && (
                  <DropdownMenuItem>
                    <Link href={`/profile/edit`}>Edit Profile</Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Report</DialogTitle>
              </DialogHeader>
              <ReportForm
                reportedUserId={profile.id}
                reportUserId={user?.id as string}
              />
            </DialogContent>
          </Dialog>
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
          {profile.profile?.isPublic ? (
            <>
              <TabsContent value="activities" className="w-full">
                {profile.upVotedPosts.map((post) => (
                  <PostCard key={post.id} post={post} showCommunity />
                ))}
              </TabsContent>
              <TabsContent value="questions" className="w-full">
                {profile.posts.map(
                  (post) =>
                    post.type === 'question' && (
                      <PostCard key={post.id} post={post} showCommunity />
                    )
                )}
              </TabsContent>
              <TabsContent value="answers" className="w-full">
                {profile.posts.map(
                  (post) =>
                    post.type === 'answer' && (
                      <PostCard key={post.id} post={post} showCommunity />
                    )
                )}
              </TabsContent>
              <TabsContent value="articles" className="w-full">
                {profile.posts.map(
                  (post) =>
                    post.type === 'article' && (
                      <PostCard key={post.id} post={post} showCommunity />
                    )
                )}
              </TabsContent>
              <TabsContent value="bookmarks" className="w-full">
                {profile.bookmarkedPosts.map((post) => (
                  <PostCard key={post.id} post={post} showCommunity />
                ))}
              </TabsContent>
            </>
          ) : (
            <div className="flex justify-center items-center h-20">
              Profile is private
            </div>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}
