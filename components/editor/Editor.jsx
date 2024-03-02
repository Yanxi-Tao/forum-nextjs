import { LexicalComposer } from '@lexical/react/LexicalComposer'
import EditorComponent from './EditorComponent'

import EditorTheme from './EditorTheme'
import EditorNodes from './nodes'
import './EditorTheme.css'

const editorConfig = {
  theme: EditorTheme,
  nodes: [...EditorNodes],
  onError(error) {
    throw error
  },
}

export default function Editor() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <EditorComponent />
    </LexicalComposer>
  )
}
