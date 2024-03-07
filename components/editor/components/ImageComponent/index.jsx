import Image from 'next/image'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'
import { mergeRegister } from '@lexical/utils'
import {
  $createParagraphNode,
  $getNodeByKey,
  $getSelection,
  $insertNodes,
  $isNodeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  KEY_ENTER_COMMAND,
  ParagraphNode,
} from 'lexical'
import { BlockWithAlignableContents } from '@lexical/react/LexicalBlockWithAlignableContents'
import * as React from 'react'
import { useCallback, useEffect, useRef } from 'react'

import { $isImageNode } from '../../nodes/ImageNode'

export default function ImageComponent({
  src,
  altText,
  nodeKey,
  width,
  height,
  className,
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

  const onEnter = useCallback(
    (event) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        const node = $getNodeByKey(nodeKey)
        node.selectNext()
      }
    },
    [isSelected, nodeKey]
  )

  useEffect(() => {
    return mergeRegister(
      // editor.registerCommand(
      //   CLICK_COMMAND,
      //   (payload) => {
      //     const event = payload
      //     if (event.target === imageRef.current) {
      //       if (!event.shiftKey) {
      //         clearSelection()
      //       }
      //       setSelected(!isSelected)
      //       return true
      //     }
      //     return false
      //   },
      //   COMMAND_PRIORITY_LOW
      // ),
      // // editor.registerCommand(
      // //   KEY_DELETE_COMMAND,
      // //   onDelete,
      // //   COMMAND_PRIORITY_LOW
      // // ),
      // // editor.registerCommand(
      // //   KEY_BACKSPACE_COMMAND,
      // //   onDelete,
      // //   COMMAND_PRIORITY_LOW
      // // ),
      editor.registerCommand(KEY_ENTER_COMMAND, onEnter, COMMAND_PRIORITY_LOW)
    )
  }, [
    clearSelection,
    editor,
    isSelected,
    nodeKey,
    onDelete,
    onEnter,
    setSelected,
  ])

  //   const draggable = isSelected && $isNodeSelection(selection)
  const isFocused = isSelected
  return (
    <BlockWithAlignableContents nodeKey={nodeKey} className={className}>
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
    </BlockWithAlignableContents>
  )
}
