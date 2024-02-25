import 'katex/dist/katex.css'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $wrapNodeInElement } from '@lexical/utils'
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
import KatexEquationAlterer from '../../components/KatexEquationAlterer'

export const INSERT_EQUATION_COMMAND = createCommand('INSERT_EQUATION_COMMAND')

// equation editing dialog
export function InsertEquationDialog({ activeEditor, onClose }) {
  // insert equationNode when confirmed in equation editing dialog
  const onEquationConfirm = useCallback(
    (equation, inline) => {
      activeEditor.dispatchCommand(INSERT_EQUATION_COMMAND, {
        equation,
        inline,
      })
      onClose()
    },
    [activeEditor, onClose]
  )

  // equation editing dialog component
  return <KatexEquationAlterer onConfirm={onEquationConfirm} />
}

export default function EquationsPlugin() {
  const [editor] = useLexicalComposerContext()

  // registed equation node creation command
  useEffect(() => {
    // check equation node is registered
    if (!editor.hasNodes([EquationNode])) {
      throw new Error(
        'EquationsPlugins: EquationsNode not registered on editor'
      )
    }

    // create equation ndoe on demand
    return editor.registerCommand(
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
