import { fetchPosts } from '@/actions/post/fetch-post'
import { CommentCard } from '@/components/card/comment-card'
import { PostCardList } from '@/components/card/post-card-list'
import { POST_FETCH_SPAN } from '@/lib/constants'

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: { search: string | undefined }
}) {
  // const search = searchParams?.search
  // const data = await fetchPosts(search, undefined, 0, POST_FETCH_SPAN)
  // return <PostCardList data={data} />
  return (
    <div>
      <CommentCard
        comment={{
          children: [],
          id: 'random-id',
          content: `To kick things off, I'll throw in my personal favorite: "The Man from Earth." It's not your typical space opera, but it's a mind-bending journey that delves deep into the realms of philosophy and existentialism. Set almost entirely in a single room, this low-budget indie film manages to captivate with its thought-provoking dialogue and intriguing premise.`,
          likes: 1000000,
          createdAt: new Date(),
          author: {
            name: 'authorName',
            slug: 'authorSlug',
            image: 'authorImage',
          },
          // replyTo: {
          //   name: 'replyToName',
          //   slug: 'replyToSlug',
          // },
          replyTo: null,
          authorId: 'authorId',
          _count: {
            children: 0,
          },
        }}
      />
    </div>
  )
}
