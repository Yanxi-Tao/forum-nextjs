import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import dynamic from 'next/dynamic'
import PulseLoader from 'react-spinners/PulseLoader'

const QuestionForm = dynamic(
  () => import('@/components/form/post-form').then((mod) => mod.QuestionForm),
  {
    loading: () => (
      <div className="flex justify-center my-10">
        <PulseLoader color="#8585ad" />
      </div>
    ),
  }
)

const ArticleForm = dynamic(
  () => import('@/components/form/post-form').then((mod) => mod.ArticleForm),
  {
    loading: () => (
      <div className="flex justify-center my-10">
        <PulseLoader color="#8585ad" />
      </div>
    ),
  }
)

export const CreatePostDisplay = ({
  communitySlug,
  communityName,
}: {
  communitySlug?: string
  communityName: string
}) => {
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
            <QuestionForm
              communitySlug={communitySlug}
              pathname={
                communitySlug ? `/community/${communitySlug}` : undefined
              }
              action="create"
            />
          </TabsContent>
          <TabsContent value="article" className="w-full">
            <ArticleForm
              communitySlug={communitySlug}
              pathname={
                communitySlug ? `/community/${communitySlug}` : undefined
              }
              action="create"
            />
          </TabsContent>
          <TabsContent value="answer" className="w-full">
            answer
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
