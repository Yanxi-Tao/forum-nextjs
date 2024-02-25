import { $isCodeNode } from '@lexical/code'
import {
  $getNearestNodeFromDOMNode,
  $getSelection,
  $setSelection,
} from 'lexical'
import * as React from 'react'
import { useState } from 'react'

import { Copy } from 'lucide-react'
import { ClipboardCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDebounce } from '@/hooks/useDebounce'

// codeNode copy code button
export function CopyButton({ editor, getCodeDOMNode }) {
  const [isCopyCompleted, setCopyCompleted] = useState(false)

  const removeSuccessIcon = useDebounce(() => {
    setCopyCompleted(false)
  }, 1000)

  async function handleClick() {
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

      const selection = $getSelection()
      $setSelection(selection)
    })

    try {
      await navigator.clipboard.writeText(content)
      setCopyCompleted(true)
      removeSuccessIcon()
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return (
    <Button variant="outline" size="icon" onClick={handleClick}>
      {isCopyCompleted ? (
        <ClipboardCheck className="h-4 w-4" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  )
}
