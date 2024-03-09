import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $insertNodeToNearestRoot, $wrapNodeInElement } from '@lexical/utils'

import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
} from 'lexical'

import { useCallback, useEffect } from 'react'
import * as React from 'react'

import { $createEquationNode, EquationNode } from '../../nodes/EquationNode'
import EquationEditor from '../../components/EquationComponent/EquationEditor'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Sigma } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const INSERT_EQUATION_COMMAND = createCommand('INSERT_EQUATION_COMMAND')

// for inserting a new quation dialog when clicking toolbar
export function InsertEquationDialog({ editor }) {
  const onConfirm = useCallback(
    (equation) => {
      editor.dispatchCommand(INSERT_EQUATION_COMMAND, equation)
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
        <EquationEditor onConfirm={onConfirm} />
      </DialogContent>
    </Dialog>
  )
}

export default function EquationsPlugin() {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (!editor.hasNodes([EquationNode])) {
      throw new Error(
        'EquationsPlugins: EquationsNode not registered on editor'
      )
    }

    return editor.registerCommand(
      INSERT_EQUATION_COMMAND,
      (payload) => {
        const equationNode = $createEquationNode(payload)

        $insertNodes([equationNode])
        if ($isRootOrShadowRoot(equationNode.getParentOrThrow())) {
          $wrapNodeInElement(equationNode, $createParagraphNode)
        }

        return true
      },
      COMMAND_PRIORITY_EDITOR
    )
  }, [editor])

  return null
}
