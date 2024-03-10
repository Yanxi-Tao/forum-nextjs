import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getNodeByKey, NodeKey } from 'lexical'
import { useCallback } from 'react'
import { $isEquationNode } from '../../nodes/EquationNode'

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import KatexRenderer from './KatexRenderer'
import EquationEditor from './EquationEditor'

type EquationComponentProps = {
  equation: string
  inline: boolean
  nodeKey: NodeKey
}
export default function EquationComponent({
  equation,
  inline,
  nodeKey,
}: EquationComponentProps): JSX.Element {
  const [editor] = useLexicalComposerContext()

  const onConfirm = useCallback(
    (updatedEquation: string, updatedInline: boolean) => {
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
      <DialogTrigger asChild>
        <KatexRenderer equation={equation} inline={inline} />
      </DialogTrigger>
      <DialogContent>
        <EquationEditor
          equation={equation}
          inline={inline}
          onConfirm={onConfirm}
        />
      </DialogContent>
    </Dialog>
  )
}
