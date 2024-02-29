import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin'
import { EditorRefPlugin } from '@lexical/react/LexicalEditorRefPlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'

// import CodeActionMenuPlugin from './plugins/CodeActionPlugin'
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin'
import TreeViewPlugin from './plugins/TreeViewPlugin'

import EquationsPlugin from './plugins/EquationsPlugin'
import ToolbarPlugin from './plugins/ToolbarPlugin'
import AutoLinkPlugin from './plugins/AutoLinkPlugin'

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

export default function Editor({ editorRef }) {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container max-w-[800px] mx-auto my-32">
        <ToolbarPlugin />
        <div className="editor-inner border rounded-md">
          <AutoFocusPlugin />
          <EditorRefPlugin editorRef={editorRef} />
          <RichTextPlugin
            contentEditable={
              <div className="editor">
                <ContentEditable className="p-4 outline-none" />
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <CodeHighlightPlugin />
          <TabIndentationPlugin />
          {/* <TreeViewPlugin /> */}
          <ListPlugin />
          <LinkPlugin />
          <AutoLinkPlugin />
          <EquationsPlugin />
        </div>
      </div>
    </LexicalComposer>
  )
}
