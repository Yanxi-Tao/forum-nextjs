import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin'
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin'
import LexicalClickableLinkPlugin from '@lexical/react/LexicalClickableLinkPlugin'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin'
import * as React from 'react'
import { useState } from 'react'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'

import AutoLinkPlugin from './plugins/AutoLinkPlugin'
import CodeActionMenuPlugin from './plugins/CodeActionMenuPlugin'
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin'
import EquationsPlugin from './plugins/EquationsPlugin'
import FloatingLinkEditorPlugin from './plugins/FloatingLinkEditorPlugin'
import LinkPlugin from './plugins/LinkPlugin'
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin'
import TableOfContentsPlugin from './plugins/TableOfContentsPlugin'
import ToolbarPlugin from './plugins/ToolbarPlugin'

import Nodes from './nodes'
import EditorTheme from './EditorTheme'

import { LexicalComposer } from '@lexical/react/LexicalComposer'

export default function Editor() {
  const isEditable = useState(true)
  const [floatingAnchorElem, setFloatingAnchorElem] = useState(null)
  const [isLinkEditMode, setIsLinkEditMode] = useState(false)

  const onRef = (_floatingAnchorElem) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem)
    }
  }

  function onError(error) {
    console.error(error)
  }

  const editorConfig = {
    namespace: 'PostEditor',
    nodes: [...Nodes],
    theme: EditorTheme,
    onError,
  }

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container flex flex-col w-full justify-center">
        <ToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />
        <AutoFocusPlugin />
        <ClearEditorPlugin />
        <HashtagPlugin />
        <AutoLinkPlugin />
        <HistoryPlugin />
        <RichTextPlugin
          contentEditable={
            <div className="editor-scroller outline-none min-w-[1000px]">
              <div className="editor" ref={onRef}>
                <ContentEditable />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <CodeHighlightPlugin />
        <ListPlugin />
        <CheckListPlugin />
        <ListMaxIndentLevelPlugin maxDepth={7} />
        <LinkPlugin />
        {!isEditable && <LexicalClickableLinkPlugin />}
        <HorizontalRulePlugin />
        <EquationsPlugin />
        <TabIndentationPlugin />
        {floatingAnchorElem && (
          <>
            <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
            <FloatingLinkEditorPlugin
              anchorElem={floatingAnchorElem}
              isLinkEditMode={isLinkEditMode}
              setIsLinkEditMode={setIsLinkEditMode}
            />
          </>
        )}
      </div>
    </LexicalComposer>
  )
}
