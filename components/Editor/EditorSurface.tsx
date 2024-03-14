import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin'
import { EditorRefPlugin } from '@lexical/react/LexicalEditorRefPlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin'
import { LexicalEditor } from 'lexical'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'

import LoadInitialContentPlugin from './plugins/LoadInitialContentPlugin'
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin'
import FloatingLinkToolbarPlugin from './plugins/FloatingLinkToolbarPlugin'
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin'
import EquationsPlugin from './plugins/EquationsPlugin'
import ToolbarPlugin from './plugins/ToolbarPlugin'
import AutoLinkPlugin from './plugins/AutoLinkPlugin'
import DraggableBlockPlugin from './plugins/DraggableBlockPlugin'
import ImagesPlugin from './plugins/ImagesPlugin'
import MarkdownPlugin from './plugins/MarkdownShortcutPlugin'

import { useState } from 'react'

import { EditorProps } from '.'

export default function EditorSurface({
  editorRef,
  initialContent,
}: EditorProps): JSX.Element {
  const onRef = (anchorRef: HTMLDivElement) => {
    if (anchorRef !== null) {
      setAnchorElem(anchorRef)
    }
  }

  const [anchorElem, setAnchorElem] = useState<HTMLDivElement | null>(null)

  return (
    <div className="editor-container border">
      <ToolbarPlugin />
      <div className="editor-inner rounded-md relative">
        <AutoFocusPlugin />
        <EditorRefPlugin editorRef={editorRef} />
        <LoadInitialContentPlugin initialContent={initialContent} />
        <RichTextPlugin
          contentEditable={
            <div className="editor -z-10" ref={onRef}>
              <ContentEditable className="editor-contentEditable w-[798px] p-4 outline-none caret-foreground pl-8" />
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
            <FloatingLinkToolbarPlugin anchorElem={anchorElem} />
            <DraggableBlockPlugin anchorElem={anchorElem} />
          </>
        ) : null}
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
