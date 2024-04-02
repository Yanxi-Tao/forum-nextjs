'use client'
import { updateCommentVoteById } from '@/actions/comment/update-comment'
import { updatePostVoteById } from '@/actions/post/update-post'
import { PostType } from '@prisma/client'
import { debounce } from 'radash'

export const useUpdateVote = (type: 'post' | 'comment') => {
  return type === 'comment' ? debounce({ delay: 1000 }, updateCommentVoteById) : debounce({ delay: 1000 }, updatePostVoteById)
}
