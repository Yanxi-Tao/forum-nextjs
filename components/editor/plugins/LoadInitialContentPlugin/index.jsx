import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $generateNodesFromDOM } from '@lexical/html'

import { useRef, useEffect } from 'react'
import { $getRoot, $insertNodes } from 'lexical'

export default function LoadInitialContentPlugin({ initialContent = '' }) {
  const [editor] = useLexicalComposerContext()
  const isMounted = useRef(false)
  useEffect(() => {
    if (!initialContent) {
      return
    }
    editor.update(() => {
      $getRoot()
        .getChildren()
        .forEach((n) => n.remove())
      const parser = new DOMParser()
      const dom = parser.parseFromString(initialContent, 'text/html')
      const nodes = $generateNodesFromDOM(editor, dom)
      $getRoot().select()
      $insertNodes(nodes)
    })
  }, [])

  return null
}
