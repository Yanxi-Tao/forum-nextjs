import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useCallback, useEffect } from 'react'
import {
  $createEquationNode,
  EquationNode,
  EquationPayload,
} from '@/components/editor/nodes/equation-node'
import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  LexicalCommand,
  LexicalEditor,
  createCommand,
} from 'lexical'

import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { EquationEditor } from '../components/equation-component'
import { Sigma } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { $wrapNodeInElement } from '@lexical/utils'

export const INSERT_EQUATION_COMMAND: LexicalCommand<EquationPayload> =
  createCommand('INSERT_EQUATION_COMMAND')

export const InsertEquationDialog: React.FC<{ editor: LexicalEditor }> = ({
  editor,
}) => {
  const onInsertEquation = useCallback(
    (equation: string, inline: boolean) => {
      editor.dispatchCommand(INSERT_EQUATION_COMMAND, { equation, inline })
    },
    [editor]
  )
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sigma size={18} />
        </Button>
      </DialogTrigger>
      <EquationEditor
        onConfirm={onInsertEquation}
        equation={''}
        inline={false}
      />
    </Dialog>
  )
}

export default function EquationPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (!editor.hasNodes([EquationNode])) {
      throw new Error(
        'EquationsPlugins: EquationsNode not registered on editor'
      )
    }

    return editor.registerCommand<EquationPayload>(
      INSERT_EQUATION_COMMAND,
      (payload) => {
        const { equation, inline } = payload
        const equationNode = $createEquationNode(equation, inline)
        $insertNodes([equationNode])
        if ($isRootOrShadowRoot(equationNode.getParentOrThrow())) {
          $wrapNodeInElement(equationNode, $createParagraphNode).selectEnd()
        }
        return true
      },
      COMMAND_PRIORITY_EDITOR
    )
  })

  return null
}
