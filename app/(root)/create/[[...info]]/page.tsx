import { ArticleForm, QuestionForm } from '@/components/form/post-form'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getCommunityBySlug } from '@/data/community'
export default async function CreatePostPage({ params }: { params: { info: string[] } }) {
  const communitySlug = params.info?.[0] || undefined
  const communityName = communitySlug ? (await getCommunityBySlug(communitySlug))?.name : 'General'

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle>WorkSpace</CardTitle>
        <CardDescription>{`Community: ${communityName}`}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs className="w-full" defaultValue="question">
          <TabsList className="w-full">
            <TabsTrigger value="question" className="w-full">
              Question
            </TabsTrigger>
            <TabsTrigger value="article" className="w-full">
              Article
            </TabsTrigger>
            <TabsTrigger value="answer" className="w-full">
              Answer
            </TabsTrigger>
          </TabsList>
          <TabsContent value="question" className="w-full">
            <QuestionForm communitySlug={communitySlug} />
          </TabsContent>
          <TabsContent value="article" className="w-full">
            <ArticleForm communitySlug={communitySlug} />
          </TabsContent>
          <TabsContent value="answer" className="w-full">
            answer
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
