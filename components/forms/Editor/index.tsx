'use client'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import EditorSurface from './EditorSurface'

import EditorTheme from './EditorTheme'
import EditorNodes from './nodes'

import * as React from 'react'

import { EditorProps } from '@/lib/types'

const editorConfig = {
  namespace: 'editor',
  theme: EditorTheme,
  nodes: [...EditorNodes],
  onError(error: Error) {
    throw error
  },
}

export default function Editor({ editorRef, initialContent }: EditorProps) {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <EditorSurface editorRef={editorRef} initialContent={initialContent} />
    </LexicalComposer>
  )
}
