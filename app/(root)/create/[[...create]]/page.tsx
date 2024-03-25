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
import { createFeedTypes } from '@/constants'
import { QuestionOrArticleForm } from '@/components/form/feed-form'

export default function CreateFeedPage() {
  const router = useRouter()
  const params = useParams()

  const activeTab = params.create?.[0] || 'question'

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle>WorkSpace</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          value={activeTab}
          onValueChange={(newTab) => {
            router.push(`/create/${newTab}`)
          }}
          className="w-full"
        >
          <TabsList className="w-full">
            {createFeedTypes.map((nav) => (
              <TabsTrigger key={nav.value} value={nav.value} className="w-full">
                {nav.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={createFeedTypes[0].value} className="w-full">
            <QuestionOrArticleForm type="QUESTION" />
          </TabsContent>
          <TabsContent value={createFeedTypes[1].value} className="w-full">
            <QuestionOrArticleForm type="ARTICLE" />
          </TabsContent>
          <TabsContent value={createFeedTypes[2].value} className="w-full">
            <h1>List of Questions to be answered</h1>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
