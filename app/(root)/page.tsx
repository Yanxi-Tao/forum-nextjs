import { fetchPosts } from '@/actions/post/fetch-post'
import { PostCardList } from '@/components/card/post-card-list'
import { POST_FETCH_SPAN } from '@/lib/constants'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Heart, Reply } from 'lucide-react'

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: { search: string | undefined }
}) {
  const search = searchParams?.search
  const data = await fetchPosts(search, undefined, 0, POST_FETCH_SPAN)
  return <PostCardList data={data} />
  // return (
  //   <div className="w-[400px]">
  //     <Card className="flex w-full space-x-4 py-2 px-4">
  //       <Avatar>
  //         <AvatarImage src="https://github.com/shadcn.png" />
  //         <AvatarFallback>CN</AvatarFallback>
  //       </Avatar>
  //       <div className="w-full">
  //         <CardHeader className="flex-row space-y-0 p-0 pt-2 justify-between">
  //           <CardTitle className="text-base">Username</CardTitle>
  //           <div>actions</div>
  //         </CardHeader>
  //         <CardContent className="p-0">
  //           <p>Card Content</p>
  //         </CardContent>
  //         <CardFooter className="flex justify-between items-center p-0">
  //           <span className="text-sm">Date</span>
  //           <div className="flex space-x-2 items-center">
  //             <span className="flex items-stretch space-x-1">
  //               <Reply size={20} />
  //               <span>Reply</span>
  //             </span>
  //             <span className="flex items-center space-x-1">
  //               <Heart size={20} fill="bg-background" />
  //               <span>15</span>
  //             </span>
  //           </div>
  //         </CardFooter>
  //       </div>
  //     </Card>
  //   </div>
  // )
}
