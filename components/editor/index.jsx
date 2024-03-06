import { LexicalComposer } from '@lexical/react/LexicalComposer'
import EditorComponent from './EditorComponent'

import EditorTheme from './EditorTheme'
import EditorNodes from './nodes'
import './EditorTheme.css'

import * as React from 'react'
import { useMemo } from 'react'

export default function Editor({ isEditMode, editorRef, editorState }) {
  const editorConfig = useMemo(
    () => ({
      namespace: 'editor',
      theme: EditorTheme,
      nodes: [...EditorNodes],
      onError(error) {
        throw error
      },
      editable: isEditMode,
      editorState:
        '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"3bgrbgerjktbntkjbntekbnkntghb","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[{"equation":"wegre \\\\frac 33","inline":true,"type":"equation","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}',
    }),
    [isEditMode]
  )

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <EditorComponent editorRef={editorRef} />
    </LexicalComposer>
  )
}
