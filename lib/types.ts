//lexical editor
import { LexicalEditor } from 'lexical'
export type EditorProps = {
  editorRef:
    | React.RefCallback<LexicalEditor>
    | React.MutableRefObject<LexicalEditor | null | undefined>
  initialContent: string
}

// feed
export type FeedProps = {
  title: string
  description: string
  titleURL: string
  content: string
  preview: string
  isAuthor: boolean
}
