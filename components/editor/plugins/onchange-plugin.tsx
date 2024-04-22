import { $generateHtmlFromNodes } from '@lexical/html'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getRoot } from 'lexical'
import { useEffect } from 'react'

export default function OnChangePlugin({
  onChange,
}: {
  onChange: (plainText: string, html: string) => void
}) {
  const [editor] = useLexicalComposerContext()
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        onChange(
          $getRoot().getTextContent(),
          $generateHtmlFromNodes(editor, null)
        )
      })
    })
  }, [editor, onChange])
  return null
}
