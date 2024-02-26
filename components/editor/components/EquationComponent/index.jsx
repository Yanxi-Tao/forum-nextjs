import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getNodeByKey } from 'lexical'
import * as React from 'react'
import { useCallback, useState } from 'react'

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

import KatexRenderer from './EquationRenderer'
import EquationEditor from './EquationEditor'
import { $isEquationNode } from '../../nodes/EquationNode'

export default function EquationComponent({ equation, inline, nodeKey }) {
  const [editor] = useLexicalComposerContext()
  const [equationValue, setEquationValue] = useState(equation)
  const [inlineValue, setInlineValue] = useState(inline)

  const onConfirm = useCallback(() => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey)
      if ($isEquationNode(node)) {
        node.setEquation(equationValue)
        node.setInline(inlineValue)
      }
    })
  }, [editor, equationValue, inlineValue, nodeKey])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <KatexRenderer equation={equationValue} inline={inlineValue} />
      </DialogTrigger>
      <DialogContent>
        <EquationEditor
          equationValue={equationValue}
          setEquationValue={setEquationValue}
          inlineValue={inlineValue}
          setInlineValue={setInlineValue}
          onConfirm={onConfirm}
        />
      </DialogContent>
    </Dialog>
  )
}
