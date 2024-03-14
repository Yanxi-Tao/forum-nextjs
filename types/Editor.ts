import { LexicalEditor } from 'lexical'
export type EditorProps = {
  editorRef:
    | React.RefCallback<LexicalEditor>
    | React.MutableRefObject<LexicalEditor | null | undefined>
  initialContent: string
}
