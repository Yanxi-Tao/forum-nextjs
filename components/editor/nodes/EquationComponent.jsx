import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { mergeRegister } from '@lexical/utils'
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  COMMAND_PRIORITY_HIGH,
  KEY_ESCAPE_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from 'lexical'
import * as React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import EquationEditor from '../components/EquationEditor'
import KatexRenderer from '../components/KatexRenderer'
import { $isEquationNode } from './EquationNode'

export default function EquationComponent({ equation, inline, nodeKey }) {
  const [editor] = useLexicalComposerContext()
  const [equationValue, setEquationValue] = useState(equation)
  const [showEquationEditor, setShowEquationEditor] = useState(false)
  const inputRef = useRef(null)

  // callback when change from edit mode to render mode for equationNode
  const onHide = useCallback(
    (restoreSelection) => {
      setShowEquationEditor(false)
      editor.update(() => {
        const node = $getNodeByKey(nodeKey)
        if ($isEquationNode(node)) {
          // update equation field if current node is an equationNode instance
          node.setEquation(equationValue)
          if (restoreSelection) {
            node.selectNext(0, 0)
          }
        }
      })
    },
    [editor, equationValue, nodeKey]
  )

  // initialize equationValue
  useEffect(() => {
    if (!showEquationEditor && equationValue !== equation) {
      setEquationValue(equation)
    }
  }, [showEquationEditor, equation, equationValue])

  useEffect(() => {
    // if in edit mode
    if (showEquationEditor) {
      return mergeRegister(
        editor.registerCommand(
          SELECTION_CHANGE_COMMAND,
          (payload) => {
            const activeElement = document.activeElement
            const inputElem = inputRef.current
            // if current focus is not at the equation editing input element then switch to render mode
            if (inputElem !== activeElement) {
              onHide()
              // no return true in case the new selection triggers event on other nodes
            }
            return false
          },
          COMMAND_PRIORITY_HIGH
        ),
        editor.registerCommand(
          KEY_ESCAPE_COMMAND,
          (payload) => {
            const activeElement = document.activeElement
            const inputElem = inputRef.current
            if (inputElem === activeElement) {
              onHide(true) // true parameter sets selection immediately after equation node
              return true
            }
            return false
          },
          COMMAND_PRIORITY_HIGH
        )
      )
    } else {
      // if currently in render mode
      return editor.registerUpdateListener(({ editorState }) => {
        // current selection includes equationNode
        const isSelected = editorState.read(() => {
          const selection = $getSelection()
          return (
            $isNodeSelection(selection) &&
            selection.has(nodeKey) &&
            selection.getNodes().length === 1
          )
        })
        if (isSelected) {
          // change to editing mode
          setShowEquationEditor(true)
        }
      })
    }
  }, [editor, nodeKey, onHide, showEquationEditor])

  return (
    <>
      {showEquationEditor ? (
        <EquationEditor
          equation={equationValue}
          setEquation={setEquationValue}
          inline={inline}
          ref={inputRef}
        />
      ) : (
        <ErrorBoundary onError={(e) => editor._onError(e)} fallback={null}>
          <KatexRenderer
            equation={equationValue}
            inline={inline}
            onDoubleClick={() => setShowEquationEditor(true)}
          />
        </ErrorBoundary>
      )}
    </>
  )
}
