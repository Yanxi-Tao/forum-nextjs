'use client'

import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { EditorRefPlugin } from '@lexical/react/LexicalEditorRefPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'

import ToolbarPlugin from './plugins/toolbar-plugin'
import CodeHighlightPlugin from './plugins/code-hightlight-plugin'
import AutoLinkPlugin from './plugins/autolink-plugin'
import EquationPlugin from './plugins/equation-plugin'
import ListMaxIndentLevelPlugin from './plugins/list-max-indent-plugin'
import { EditorState, LexicalEditor } from 'lexical'

export type EditorSurfaceProps = {
  editorRef: ((instance: LexicalEditor | null) => void) | React.MutableRefObject<LexicalEditor | null | undefined>
  onChange: (editorState: EditorState, editor: LexicalEditor, tags?: Set<string>) => void
}

export const EditorSurface: React.FC<EditorSurfaceProps> = ({ editorRef, onChange }): JSX.Element => {
  return (
    <div>
      <ToolbarPlugin />
      <div className="relative">
        <AutoFocusPlugin />
        <RichTextPlugin
          contentEditable={<ContentEditable className="editor outline-none max-w-[760px] min-h-40" />}
          ErrorBoundary={LexicalErrorBoundary}
          placeholder={<div className="absolute top-0.5 text-muted-foreground">Start here...</div>}
        />
        <HistoryPlugin />
        <CodeHighlightPlugin />
        <HorizontalRulePlugin />
        <TabIndentationPlugin />
        <ListPlugin />
        <ListMaxIndentLevelPlugin maxDepth={7} />
        <LinkPlugin />
        <AutoLinkPlugin />
        <EquationPlugin />
        <EditorRefPlugin editorRef={editorRef} />
        <OnChangePlugin onChange={onChange} />
      </div>
    </div>
  )
}
