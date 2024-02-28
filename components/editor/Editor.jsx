import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'

// import CodeActionMenuPlugin from './plugins/CodeActionPlugin'
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin'
import TreeViewPlugin from './plugins/TreeViewPlugin'

import EquationsPlugin from './plugins/EquationsPlugin'
import ToolbarPlugin from './plugins/ToolbarPlugin'

import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'

import { useRef } from 'react'

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
  const editorRef = useRef(null)
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container max-w-[600px] mx-auto my-32">
        <ToolbarPlugin />
        <div className="editor-inner">
          <AutoFocusPlugin />
          <RichTextPlugin
            contentEditable={
              <div className="editor" ref={editorRef}>
                <ContentEditable className="p-4 outline-none" />
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <CodeHighlightPlugin />
          <TreeViewPlugin />
          <ListPlugin />
          {/* <CodeActionMenuPlugin anchorElem={editorRef.current} /> */}
          <EquationsPlugin />
        </div>
      </div>
    </LexicalComposer>
  )
}
