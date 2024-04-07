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

import ToolbarPlugin from './plugins/toolbar-plugin'
import CodeHighlightPlugin from './plugins/code-hightlight-plugin'
import AutoLinkPlugin from './plugins/autolink-plugin'
import EquationPlugin from './plugins/equation-plugin'

export const EditorSurface = () => {
  return (
    <div>
      <ToolbarPlugin />
      <div className="relative">
        <AutoFocusPlugin />
        <RichTextPlugin
          contentEditable={<ContentEditable className="editor outline-none w-[700px]" />}
          ErrorBoundary={LexicalErrorBoundary}
          placeholder={<div className="absolute top-1 text-muted-foreground">Start here...</div>}
        />
        <HistoryPlugin />
        <CodeHighlightPlugin />
        <HorizontalRulePlugin />
        <TabIndentationPlugin />
        <ListPlugin />
        <LinkPlugin />
        <AutoLinkPlugin />
        <EquationPlugin />
      </div>
    </div>
  )
}
