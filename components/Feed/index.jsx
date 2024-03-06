import * as React from 'react'
import { useRef } from 'react'

import Editor from '../Editor'

import {
  FeedRoot,
  FeedContent,
  FeedPreview,
  FeedToolbar,
} from './components/FeedContainers'

export default function Feed({}) {
  const editorRef = useRef(null)
  const editorState = ''

  return (
    <FeedRoot>
      <FeedPreview>Test</FeedPreview>
      <FeedContent>
        <Editor
          editorRef={editorRef}
          isEditMode={false}
          editorState={editorState}
        />
      </FeedContent>
      <FeedToolbar />
    </FeedRoot>
  )
}
