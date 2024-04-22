'use client'

import { LexicalComposer } from '@lexical/react/LexicalComposer'
import {
  EditorSurface,
  EditorSurfaceProps,
} from '@/components/editor/editor-surface'
import EditorNodes from '@/components/editor/nodes'
import EditorTheme from '@/components/editor/editor-theme'
import '@/components/editor/editor-theme.css'

const editorConfig = {
  namespace: 'editor',
  nodes: [...EditorNodes],
  theme: EditorTheme,
  onError(error: Error) {
    throw error
  },
}

export const Editor: React.FC<EditorSurfaceProps> = ({
  onChange,
  initialContent,
}): JSX.Element => {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <EditorSurface onChange={onChange} initialContent={initialContent} />
    </LexicalComposer>
  )
}
