import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'
import * as React from 'react'
import { EDITOR_TRANSFORMERS } from './MarkdownTransformers'

export default function MarkdownPlugin() {
  return <MarkdownShortcutPlugin transformers={EDITOR_TRANSFORMERS} />
}
