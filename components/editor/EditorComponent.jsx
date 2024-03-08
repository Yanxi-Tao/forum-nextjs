import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin'
import { EditorRefPlugin } from '@lexical/react/LexicalEditorRefPlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin'
import LexicalClickableLinkPlugin from '@lexical/react/LexicalClickableLinkPlugin'
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin'
import useLexicalEditable from '@lexical/react/useLexicalEditable'

import TreeViewPlugin from './plugins/TreeViewPlugin'
import LoadInitialContentPlugin from './plugins/LoadInitialContentPlugin'
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin'
import FloatingLinkEditorPlugin from './plugins/FloatingLinkEditorPlugin'
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin'
import EquationsPlugin from './plugins/EquationsPlugin'
import ToolbarPlugin from './plugins/ToolbarPlugin'
import AutoLinkPlugin from './plugins/AutoLinkPlugin'
import DraggableBlockPlugin from './plugins/DraggableBlockPlugin'
import ImagesPlugin from './plugins/ImagesPlugin'
import MarkdownPlugin from './plugins/MarkdownShortcutPlugin'

import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'

import { useState } from 'react'

export default function EditorComponent({ editorRef, initialContent }) {
  const isEditable = useLexicalEditable()
  const onRef = (anchorRef) => {
    if (anchorRef !== null) {
      setAnchorElem(anchorRef)
    }
  }
  const [anchorElem, setAnchorElem] = useState(null)

  return (
    <div className="editor-container w-full border">
      {isEditable ? <ToolbarPlugin /> : null}
      <div className="editor-inner rounded-md relative">
        <AutoFocusPlugin />
        <EditorRefPlugin editorRef={editorRef} />
        <LoadInitialContentPlugin initialContent={initialContent} />
        <RichTextPlugin
          contentEditable={
            <div className="editor -z-10" ref={onRef}>
              <ContentEditable className="editor-contentEditable p-4 outline-none caret-foreground pl-8" />
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
          placeholder={
            <div className="absolute top-[18px] z-0 left-8 text-muted-foreground">
              Enter your answer...
            </div>
          }
        />
        <HistoryPlugin />
        <MarkdownPlugin />
        <CodeHighlightPlugin />
        <HorizontalRulePlugin />
        {anchorElem ? (
          <>
            <FloatingLinkEditorPlugin anchorElem={anchorElem} />
            <DraggableBlockPlugin anchorElem={anchorElem} />
          </>
        ) : null}
        {!isEditable && <LexicalClickableLinkPlugin />}
        <TabIndentationPlugin />
        {/* <TreeViewPlugin /> */}
        <ListPlugin />
        <ListMaxIndentLevelPlugin maxDepth={7} />
        <ImagesPlugin />
        <LinkPlugin />
        <AutoLinkPlugin />
        <EquationsPlugin />
      </div>
    </div>
  )
}
