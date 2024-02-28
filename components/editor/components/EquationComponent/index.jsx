import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getNodeByKey } from 'lexical'
import * as React from 'react'
import { useCallback, useState } from 'react'

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

import KatexRenderer from './EquationRenderer'
import EquationEditor from './EquationEditor'
import { $isEquationNode } from '../../nodes/EquationNode'

// rendered equation node component in lexical
export default function EquationComponent({ equation, inline, nodeKey }) {
  const [editor] = useLexicalComposerContext()
  // const [equationValue, setEquationValue] = useState(equation)
  // const [inlineValue, setInlineValue] = useState(inline)

  const onConfirm = useCallback(
    (updatedEquation, updatedInline) => {
      editor.update(() => {
        const node = $getNodeByKey(nodeKey)
        if ($isEquationNode(node)) {
          node.setEquation(updatedEquation)
          node.setInline(updatedInline)
        }
      })
    },
    [editor, nodeKey]
  )

  return (
    <Dialog>
      <DialogTrigger className="m-2">
        <KatexRenderer equation={equation} inline={inline} />
      </DialogTrigger>
      <DialogContent>
        <EquationEditor
          equationValue={equation}
          inlineValue={inline}
          onConfirm={onConfirm}
        />
      </DialogContent>
    </Dialog>
  )
}
