import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getNodeByKey } from 'lexical'
import * as React from 'react'
import { useCallback } from 'react'

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

import KatexRenderer from './EquationRenderer'
import EquationEditor from './EquationEditor'
import { $isEquationNode } from '../../nodes/EquationNode'

// rendered equation node component in lexical
export default function EquationComponent({ equation, nodeKey }) {
  const [editor] = useLexicalComposerContext()

  const onConfirm = useCallback(
    (updatedEquation) => {
      editor.update(() => {
        const node = $getNodeByKey(nodeKey)
        if ($isEquationNode(node)) {
          node.setEquation(updatedEquation)
        }
      })
    },
    [editor, nodeKey]
  )

  return (
    <Dialog>
      <DialogTrigger asChild>
        <KatexRenderer equation={equation} />
      </DialogTrigger>
      <DialogContent>
        <EquationEditor equationValue={equation} onConfirm={onConfirm} />
      </DialogContent>
    </Dialog>
  )
}
