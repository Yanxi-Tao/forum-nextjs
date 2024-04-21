// import { PostCardProps } from '@/lib/types'
// import { PostCardWrapper } from '@/components/card/post-card-wrapper'
// import { ExtendedUser } from '@/auth'
// import { PostType } from '@prisma/client'

// export const PostCard = (post: PostCardProps) => {
//   const shouldCollapse = post.content.length > 500
//   return (
//     <PostCardWrapper {...post}>
//       <div
//         className="editor"
//         dangerouslySetInnerHTML={{ __html: post.content }}
//       />
//     </PostCardWrapper>
//   )
// }

// export const optimisticAnswer = (
//   user: ExtendedUser,
//   title: string,
//   content: string
// ): PostCardProps => {
//   return {
//     community: null,
//     author: {
//       id: user.id as string,
//       name: user.name as string,
//       slug: user.slug,
//       email: user.email as string,
//       emailVerified: null,
//       image: null,
//       password: null,
//     },
//     id: 'temp-id',
//     title,
//     content,
//     type: PostType.answer,
//     authorId: user.id as string,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     upVotes: [],
//     downVotes: [],
//     views: 0,
//     bookmarks: [],
//     parentId: null,
//     communityId: null,
//     _count: { children: 0, comments: 0 },
//   }
// }
