import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  LexicalCommand,
  LexicalEditor,
  createCommand,
} from 'lexical'
import { Sigma } from 'lucide-react'
import * as React from 'react'
import { useCallback, useEffect } from 'react'
import EquationEditor from '../../components/EquationComponent/EquationEditor'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  $createEquationNode,
  EquationNode,
  EquationPayload,
} from '../../nodes/EquationNode'
import { $wrapNodeInElement } from '@lexical/utils'

export const INSERT_EQUATION_COMMAND: LexicalCommand<EquationPayload> =
  createCommand('INSERT_EQUATION_COMMAND')

export function InsertEquationDialog({
  editor,
}: {
  editor: LexicalEditor
}): JSX.Element {
  const onConfirm = useCallback(
    (equation: string, inline: boolean) => {
      editor.dispatchCommand(INSERT_EQUATION_COMMAND, { equation, inline })
    },
    [editor]
  )

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost">
          <Sigma className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent
        onCloseAutoFocus={() => {
          editor.focus()
        }}
      >
        <EquationEditor equation="" inline={true} onConfirm={onConfirm} />
      </DialogContent>
    </Dialog>
  )
}

export default function EquationsPlugin(): JSX.Element | null {
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
  }, [editor])

  return null
}
