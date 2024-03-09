import { LexicalComposer } from '@lexical/react/LexicalComposer'
import EditorComponent from './EditorComponent'

import EditorTheme from './EditorTheme'
import EditorNodes from './nodes'

import * as React from 'react'

const editorConfig = {
  namespace: 'editor',
  theme: EditorTheme,
  nodes: [...EditorNodes],
  onError(error) {
    throw error
  },
}

export default function Editor({ editorRef, initialContent }) {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <EditorComponent editorRef={editorRef} initialContent={initialContent} />
    </LexicalComposer>
  )
}
