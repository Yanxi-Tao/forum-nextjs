import { LexicalComposer } from '@lexical/react/LexicalComposer'
import EditorComponent from './EditorComponent'

import EditorTheme from './EditorTheme'
import EditorNodes from './nodes'
import './EditorTheme.css'

import * as React from 'react'
import { useMemo } from 'react'

export default function Editor({ isEditMode, editorRef }) {
  const editorConfig = useMemo(
    () => ({
      namespace: 'editor',
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
      <EditorComponent editorRef={editorRef} />
    </LexicalComposer>
  )
}
