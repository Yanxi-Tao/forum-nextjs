import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'

export default function CommunitiesPage() {
  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="flex-row space-y-0 justify-between">
        <CardTitle>Communities</CardTitle>
        <Button>
          <Link href="/communities/create">Create</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs className="w-full" defaultValue="subscribed">
          <TabsList className="w-full">
            <TabsTrigger value="subscribed" className="w-full">
              Subscribed
            </TabsTrigger>
            <TabsTrigger value="browse" className="w-full">
              Browse
            </TabsTrigger>
          </TabsList>
          <TabsContent value="subscribed" className="w-full">
            Subscribed
          </TabsContent>
          <TabsContent value="browse" className="w-full">
            Browse
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
