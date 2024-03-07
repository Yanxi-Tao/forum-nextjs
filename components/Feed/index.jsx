import * as React from 'react'
import { useRef } from 'react'

import {
  FeedRoot,
  FeedContent,
  FeedPreview,
  FeedToolbar,
} from './components/FeedContainers'

export default function Feed({ data }) {
  return (
    <FeedRoot>
      <FeedPreview>Test</FeedPreview>
      <FeedContent>
        <div dangerouslySetInnerHTML={{ __html: data }} />
      </FeedContent>
      <FeedToolbar />
    </FeedRoot>
  )
}
