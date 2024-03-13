import * as React from 'react'
import { useState } from 'react'

import { FeedContent, FeedRoot, FeedToolbar } from './components/FeedStructure'

export default function Feed() {
  const [open, setOpen] = useState(false)
  return (
    <FeedRoot title="test" titleURL="/test" description="lalala">
      <FeedContent
        content="content"
        preview="preview"
        open={open}
        onOpenChange={setOpen}
      />
      <FeedToolbar isAuthor={true} open={open} setOpen={setOpen} />
    </FeedRoot>
  )
}
