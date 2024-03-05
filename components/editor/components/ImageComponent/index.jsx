import Image from 'next/image'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'
import { mergeRegister } from '@lexical/utils'
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  $setSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  DRAGSTART_COMMAND,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_ESCAPE_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from 'lexical'
import * as React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { $isImageNode } from '../../nodes/ImageNode'

export default function ImageComponent({
  src,
  altText,
  nodeKey,
  width,
  height,
  showCaption,
  caption,
}) {
  const imageRef = useRef(null)
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey)
  const [editor] = useLexicalComposerContext()

  // delete imageNode callback
  const onDelete = useCallback(
    (event) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        event.preventDefault()
        const node = $getNodeByKey(nodeKey)
        if ($isImageNode(node)) {
          node.remove()
        }
      }
      return false
    },
    [isSelected, nodeKey]
  )

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        CLICK_COMMAND,
        (payload) => {
          const event = payload
          if (event.target === imageRef.current) {
            if (!event.shiftKey) {
              clearSelection()
            }
            setSelected(!isSelected)
            return true
          }
          return false
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW
      )
    )
  }, [clearSelection, editor, isSelected, nodeKey, onDelete, setSelected])

  //   const draggable = isSelected && $isNodeSelection(selection)
  const isFocused = isSelected
  return (
    <div>
      <Image
        src={src}
        alt={altText}
        height={height}
        width={width}
        ref={imageRef}
        className={
          isFocused ? 'ring-ring ring-2 ring-offset-1.5 rounded-md' : null
        }
      />
    </div>
  )
}
