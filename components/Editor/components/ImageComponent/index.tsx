import {
  $getNodeByKey,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  ElementFormatType,
  KEY_ARROW_DOWN_COMMAND,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  KEY_ENTER_COMMAND,
  NodeKey,
} from 'lexical'
import { BlockWithAlignableContents } from '@lexical/react/LexicalBlockWithAlignableContents'
import Image from 'next/image'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'
import { useCallback, useEffect } from 'react'
import { $isImageNode } from '../../nodes/ImageNode'
import { mergeRegister } from '@lexical/utils'

type ImageComponentProps = Readonly<{
  src: string
  altText: string
  width: number
  height: number
  className: Readonly<{
    base: string
    focus: string
  }>
  format: ElementFormatType | null
  nodeKey: NodeKey
}>

export default function ImageComponent({
  src,
  altText,
  width,
  height,
  className,
  format,
  nodeKey,
}: ImageComponentProps): JSX.Element {
  const [editor] = useLexicalComposerContext()
  const [isSelected] = useLexicalNodeSelection(nodeKey)

  const onDelete = useCallback(
    (payload: KeyboardEvent) => {
      if (isSelected) {
        const event: KeyboardEvent = payload
        event.preventDefault()
        const node = $getNodeByKey(nodeKey)
        if ($isImageNode(node)) {
          node.remove()
          return true
        }
      }
      return false
    },
    [isSelected, nodeKey]
  )

  const onEnter = useCallback(
    (payload: KeyboardEvent) => {
      if (isSelected) {
        const event: KeyboardEvent = payload
        event.preventDefault()
        const node = $getNodeByKey(nodeKey)
        if ($isImageNode(node)) {
          node.selectNext()
        }
      }
      return false
    },
    [isSelected, nodeKey]
  )

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(KEY_ENTER_COMMAND, onEnter, COMMAND_PRIORITY_LOW)
    )
  })

  return (
    <BlockWithAlignableContents
      className={className}
      format={format}
      nodeKey={nodeKey}
    >
      <Image src={src} alt={altText} width={width} height={height} />
    </BlockWithAlignableContents>
  )
}
