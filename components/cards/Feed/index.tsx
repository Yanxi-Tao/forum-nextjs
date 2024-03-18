'use client'
import * as React from 'react'
import { useState } from 'react'

import { FeedContent, FeedRoot, FeedToolbar } from './components/FeedStructure'

import { FeedProps } from '@/lib/types'

export default function Feed({
  title,
  description,
  titleURL,
  content,
  preview,
  isAuthor,
}: FeedProps): JSX.Element {
  const [open, setOpen] = useState(false)
  return (
    <FeedRoot title={title} titleURL={titleURL} description={description}>
      <FeedContent
        content={content}
        preview={preview}
        open={open}
        onOpenChange={setOpen}
      />
      <FeedToolbar isAuthor={isAuthor} open={open} setOpen={setOpen} />
    </FeedRoot>
  )
}
