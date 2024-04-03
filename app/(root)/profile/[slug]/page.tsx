import { fetchProfile } from '@/actions/profile/fetch-profile'
import { AvatarCard } from '@/components/card/avatar-card'
import { PostCard } from '@/components/card/post-card'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default async function ProfilePage({ params: { slug } }: { params: { slug: string } }) {
  const profile = await fetchProfile(slug)
  if (!profile) {
    return <div>Profile not found</div>
  }
  return (
    <Card className="border-0 shadow-none flex flex-col space-y-3">
      <CardHeader className="bg-muted rounded-xl">
        <div className="relative flex justify-between">
          <AvatarCard source={profile.image} name={profile.name} className="h-36 w-36 text-3xl" />
          <div className="absolute left-28 top-28">
            <CardTitle className="bg-muted rounded-lg p-1 px-2">{profile.name}</CardTitle>
          </div>
          <div>actions</div>
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
            {profile.posts.map((post) => post.type === 'question' && <PostCard key={post.id} {...post} />)}
          </TabsContent>
          <TabsContent value="answers" className="w-full">
            {profile.posts.map((post) => post.type === 'answer' && <PostCard key={post.id} {...post} />)}
          </TabsContent>
          <TabsContent value="articles" className="w-full">
            {profile.posts.map((post) => post.type === 'article' && <PostCard key={post.id} {...post} />)}
          </TabsContent>
          <TabsContent value="bookmarks" className="w-full">
            Bookmarks
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
