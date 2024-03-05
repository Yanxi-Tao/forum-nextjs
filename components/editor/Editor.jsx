import { LexicalComposer } from '@lexical/react/LexicalComposer'
import EditorComponent from './EditorComponent'

import EditorTheme from './EditorTheme'
import EditorNodes from './nodes'
import './EditorTheme.css'

import * as React from 'react'
import { useMemo } from 'react'

const editorConfig = {
  namespace: 'Post-Editor',
  theme: EditorTheme,
  nodes: [...EditorNodes],
  onError(error) {
    throw error
  },
}

export default function Editor({ isEditMode = true }) {
  const editorConfig = useMemo(
    () => ({
      namespace: 'Post-Editor',
      theme: EditorTheme,
      nodes: [...EditorNodes],
      onError(error) {
        throw error
      },
      editable: isEditMode,
    }),
    [isEditMode]
  )

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <EditorComponent />
    </LexicalComposer>
  )
}
