import { QuestionForm } from '@/components/form/post-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
export default function CreatePostPage({
  params,
}: {
  params: { info: string[] }
}) {
  const postType = params.info?.[0] || 'question'
  const communityName = params.info?.[1] || undefined
  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle>WorkSpace</CardTitle>
        <CardDescription>{`Community: ${
          communityName ? communityName : 'General'
        }`}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs className="w-full" defaultValue={postType}>
          <TabsList className="w-full">
            <TabsTrigger value="question" className="w-full" asChild>
              <Link href={`/create/question/${communityName ?? ''}`}>
                Question
              </Link>
            </TabsTrigger>
            <TabsTrigger value="article" className="w-full" asChild>
              <Link href={`/create/article/${communityName ?? ''}`}>
                Article
              </Link>
            </TabsTrigger>
            <TabsTrigger value="answer" className="w-full" asChild>
              <Link href={`/create/answer/${communityName ?? ''}`}>Answer</Link>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="question" className="w-full">
            <QuestionForm communityName={communityName} />
          </TabsContent>
          <TabsContent value="article" className="w-full">
            article
          </TabsContent>
          <TabsContent value="answer" className="w-full">
            answer
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
