'use client'
import { updateCommentVoteById } from '@/actions/comment/update-comment'
import { updatePostBookmarkById, updatePostVoteById } from '@/actions/post/update-post'
import { debounce } from 'radash'

export const useUpdateBookmark = () => {
  return debounce({ delay: 1000 }, updatePostBookmarkById)
}
