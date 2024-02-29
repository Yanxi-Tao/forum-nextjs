import {
  $createLinkNode,
  $isAutoLinkNode,
  $isLinkNode,
  TOGGLE_LINK_COMMAND,
} from '@lexical/link'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $findMatchingParent, mergeRegister } from '@lexical/utils'
import {
  $getSelection,
  $isLineBreakNode,
  $isRangeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  SELECTION_CHANGE_COMMAND,
} from 'lexical'

import { useCallback, useEffect, useRef, useState } from 'react'
import * as React from 'react'

import { getSelectedNode } from '@/lib/utils/editor/getSelectedNode'
import { setFloatingLinkEditorPosition } from '@/lib/utils/editor/setFloatingLinkEditorPosition'

function FloatingLinkEditorToolbar(editor, anchorElem) {
  const [isLink, setIsLink] = useState(false)
  const [anchorHTML, setAnchorHTML] = useState(null)

  // update toolbar (isLink state) when editor state change
  // clicked or selection change
  useEffect(() => {
    // update whether current selection is a link node
    function updateToolbar() {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        const focusNode = getSelectedNode(selection)
        const focusLinkNode = $findMatchingParent(focusNode, $isLinkNode)
        const focusAutoLinkNode = $findMatchingParent(
          focusNode,
          $isAutoLinkNode
        )

        // if selected text node does not have a link node parent
        // meaning not a linknode then update state exit function
        if (!(focusLinkNode || focusAutoLinkNode)) {
          setAnchorHTML(null)
          setIsLink(false)
          return
        }

        // if multiple text nodes are selected
        const badNode = selection.getNodes().find((node) => {
          const linkNode = $findMatchingParent(node, $isLinkNode)
          const autoLinkNode = $findMatchingParent(node, $isAutoLinkNode)

          // if any of sub node does not have a
          // link/autolink node parent then a bad node exist
          if (
            !linkNode?.is(focusLinkNode) &&
            !autoLinkNode?.is(focusAutoLinkNode) &&
            !linkNode &&
            !autoLinkNode &&
            !$isLineBreakNode(node)
          ) {
            return node
          }
        })

        // if no bad node is marked then update state
        if (!badNode) {
          setAnchorHTML()
          setIsLink(true)
        } else {
          setAnchorHTML(null)
          setIsLink(false)
        }
      }
    }

    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar()
        })
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload) => {
          updateToolbar()
          return false
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      editor.registerCommand(
        CLICK_COMMAND,
        (payload) => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            const node = getSelectedNode(selection)
            const linkNode = $findMatchingParent(noed, $isLinkNode)
            if ($isLinkNode(linkNode) && (payload.metaKey || payload.ctrlKey)) {
              window.open(linkNode.getURL(), '_blank')
              return true
            }
          }
          return true
        },
        COMMAND_PRIORITY_LOW
      )
    )
  }, [editor])
}

export default function FloatingLinkEditorPlugin({
  anchorElem = document.body,
}) {
  const [editor] = useLexicalComposerContext()
  return <FloatingLinkEditorToolbar />
}
