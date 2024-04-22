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
import ListMaxIndentLevelPlugin from './plugins/list-max-indent-plugin'
import LoadInitialContentPlugin from './plugins/load-initial-content-plugin'
import OnChangePlugin from './plugins/onchange-plugin'

export type EditorSurfaceProps = {
  onChange: (plainText: string, html: string) => void
  initialContent?: string
}

export const EditorSurface: React.FC<EditorSurfaceProps> = ({
  onChange,
  initialContent,
}): JSX.Element => {
  return (
    <div className="border border-input rounded-md p-2 px-4 focus-within:ring-1 focus-within:ring-ring">
      <ToolbarPlugin />
      <div className="relative">
        <LoadInitialContentPlugin initialContent={initialContent} />
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="editor outline-none min-h-40" />
          }
          ErrorBoundary={LexicalErrorBoundary}
          placeholder={
            <div className="absolute top-0.5 text-muted-foreground">
              Start here...
            </div>
          }
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
        <OnChangePlugin onChange={onChange} />
      </div>
    </div>
  )
}
