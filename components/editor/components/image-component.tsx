import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  NodeKey,
} from 'lexical'
import { useCallback, useEffect } from 'react'
import { $isImageNode } from '@/components/editor/nodes/image-node'
import { mergeRegister } from '@lexical/utils'

export type ImageComponentProps = {
  src: string
  nodeKey: NodeKey
}

export const ImageComponent: React.FC<ImageComponentProps> = ({
  src,
  nodeKey,
}) => {
  const [editor] = useLexicalComposerContext()

  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey)

  const onDelete = useCallback(
    (event: KeyboardEvent) => {
      if (isSelected && $isNodeSelection($getSelection())) {
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

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        CLICK_COMMAND,
        (event: MouseEvent) => {
          const imgElem = editor.getElementByKey(nodeKey)
          if (
            event.target === imgElem ||
            imgElem?.contains(event.target as Node)
          ) {
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
  }, [editor, isSelected, nodeKey, clearSelection, setSelected, onDelete])

  useEffect(() => {
    const imgElem = editor.getElementByKey(nodeKey)
    if (imgElem !== null) {
      imgElem.className = `editor-image ${isSelected ? 'selected' : ''}`
    }
  }, [isSelected, nodeKey, editor])

  return <img src={src} alt="feed-image" />
}
