import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $generateNodesFromDOM } from '@lexical/html'

import { useEffect } from 'react'
import { $getRoot, $insertNodes } from 'lexical'

export default function LoadInitialContentPlugin({ initialContent = '' }) {
  const [editor] = useLexicalComposerContext()
  useEffect(() => {
    if (!initialContent) {
      return
    }
    editor.update(() => {
      $getRoot()
        .getChildren()
        .forEach((n) => n.remove())

      const parser = new DOMParser()
      const dom = parser.parseFromString(initialContent || '', 'text/html')

      // Once you have the DOM instance it's easy to generate LexicalNodes.
      const nodes = $generateNodesFromDOM(editor, dom)

      // Select the root
      $getRoot().select()

      // Insert them at a selection.
      $insertNodes(nodes)
    })
  }, [initialContent, editor])

  return null
}
