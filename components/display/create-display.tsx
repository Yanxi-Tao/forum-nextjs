import { ArticleForm, QuestionForm } from '@/components/form/post-form'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
export const CreatePostDisplay = ({ communitySlug, communityName }: { communitySlug?: string; communityName: string }) => {
  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle>WorkSpace</CardTitle>
        <CardDescription className="pt-3 text-base">{`Community: ${communityName}`}</CardDescription>
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
            <QuestionForm communitySlug={communitySlug} redirectTo={communitySlug ? `/community/${communitySlug}` : '/'} />
          </TabsContent>
          <TabsContent value="article" className="w-full">
            <ArticleForm communitySlug={communitySlug} redirectTo={communitySlug ? `/community/${communitySlug}` : '/'} />
          </TabsContent>
          <TabsContent value="answer" className="w-full">
            answer
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
