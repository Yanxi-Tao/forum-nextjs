import { $isCodeNode } from '@lexical/code'
import {
  $getNearestNodeFromDOMNode,
  $getSelection,
  $setSelection,
} from 'lexical'

import * as React from 'react'
import { useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { Button } from '@/components/ui/button'
import { Check, Clipboard } from 'lucide-react'

export function CopyButton({ editor, getCodeDOMNode }) {
  const [isCopyCompleted, setCopyCompleted] = useState(false)

  const changeBackToClipboardIcon = useDebounce(() => {
    setCopyCompleted(false)
  }, 1000)

  async function handleCopy() {
    const codeDOMNode = getCodeDOMNode()

    if (!codeDOMNode) {
      return
    }

    let content = ''

    editor.update(() => {
      const codeNode = $getNearestNodeFromDOMNode(codeDOMNode)

      if ($isCodeNode(codeNode)) {
        content = codeNode.getTextContent()
      }

      // set cusor focus back after pressing copy
      const selection = $getSelection()
      $setSelection(selection)
    })

    try {
      await navigator.clipboard.writeText(content)
      setCopyCompleted(true)
      changeBackToClipboardIcon()
    } catch (error) {
      console.error('Failed to copy code: ', error)
    }
  }

  return (
    <Button onClick={handleCopy}>
      {isCopyCompleted ? (
        <Check className="h-4 w-4" />
      ) : (
        <Clipboard className="h-4 w-4" />
      )}
    </Button>
  )
}
