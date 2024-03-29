'use client'

import { AnswersDataProps, PostsDataProps } from '@/lib/types'
import { useCallback, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { AnswerCard, PostCard } from './post-card'
import { useSearchParams } from 'next/navigation'
import { fetchAnswers, fetchPosts } from '@/actions/post/fetch-post'
import { ANSWERS_FETCH_SPAN, POST_FETCH_SPAN } from '@/lib/constants'
import { BeatLoader } from 'react-spinners'

export const PostCardList = ({
  data: initialData,
}: {
  data: PostsDataProps
}) => {
  const searchParams = useSearchParams()
  const search = searchParams.get('search') || undefined
  const communityName = searchParams.get('community') || undefined
  const [posts, setPosts] = useState(initialData.posts)
  const [offset, setOffset] = useState(initialData.offset)
  const [hasNextPage, setHasNextPage] = useState(true)

  const fetchMorePosts = useCallback(async () => {
    const data = await fetchPosts(
      search,
      communityName,
      offset,
      POST_FETCH_SPAN
    )
    if (!data.posts.length) {
      setHasNextPage(false)
      return
    }
    setPosts([...posts, ...data.posts])
    setOffset(data.offset)
  }, [search, communityName, offset, posts])

  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchMorePosts()
    }
  }, [inView, fetchMorePosts, hasNextPage])

  return (
    <div className="flex flex-col space-y-4">
      {posts.map((post, index) => {
        if (index === posts.length - 1) {
          return <PostCard key={post.id} ref={ref} {...post} />
        } else {
          return <PostCard key={post.id} {...post} />
        }
      })}
      {inView && hasNextPage && (
        <div className="flex justify-center items-center h-32">
          <BeatLoader />
        </div>
      )}
      {!hasNextPage && (
        <div className="flex justify-center items-center h-24">
          No more posts
        </div>
      )}
    </div>
  )
}

export const AnswerCardList = ({
  answers: optimisticAnswers,
  offset: initialOffset,
  questionSlug,
}: {
  answers: AnswersDataProps['answers']
  offset: number
  questionSlug: string
}) => {
  const [answers, setAnswers] = useState(optimisticAnswers)
  const [offset, setOffset] = useState(initialOffset)
  const [hasNextPage, setHasNextPage] = useState(true)

  // make sure data is up to date
  useEffect(() => {
    setAnswers(optimisticAnswers)
    setOffset(initialOffset)
  }, [optimisticAnswers, initialOffset])

  const fetchMoreAnswers = useCallback(async () => {
    const data = await fetchAnswers(questionSlug, offset, ANSWERS_FETCH_SPAN)
    if (!data.answers.length) {
      setHasNextPage(false)
      return
    }
    setAnswers([...answers, ...data.answers])
    setOffset(data.offset)
  }, [offset, answers, questionSlug])

  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchMoreAnswers()
    }
  }, [inView, fetchMoreAnswers, hasNextPage])

  return (
    <div className="flex flex-col space-y-4">
      {answers.map((answer, index) => {
        if (index === answers.length - 1) {
          return <AnswerCard key={answer.id} ref={ref} {...answer} />
        } else {
          return <AnswerCard key={answer.id} {...answer} />
        }
      })}
      {hasNextPage && (
        <div className="flex justify-center items-center h-32">
          <BeatLoader />
        </div>
      )}
      {!hasNextPage && (
        <div className="flex justify-center items-center h-24">
          No more answers
        </div>
      )}
    </div>
  )
}
