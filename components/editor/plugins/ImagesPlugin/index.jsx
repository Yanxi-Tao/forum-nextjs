import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  $insertNodeToNearestRoot,
  $wrapNodeInElement,
  mergeRegister,
} from '@lexical/utils'
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
} from 'lexical'
import * as React from 'react'
import { useEffect, useState } from 'react'

import { $createImageNode, ImageNode } from '../../nodes/ImageNode'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { Image as ImageIcon } from 'lucide-react'

export const INSERT_IMAGE_COMMAND = createCommand('INSERT_IMAGE_COMMAND')

export function InsertImageDialog({ editor }) {
  const [src, setSrc] = useState('')
  const [altText, setAltText] = useState('')
  const [imgSize, setImgSize] = useState({})

  const isDisabled = src === ''

  useEffect(() => {
    const img = new Image()
    img.src = src
    img.onload = function () {
      setImgSize({ height: img.height, width: img.width })
    }
  }, [src])

  const loadImage = (files) => {
    const reader = new FileReader()
    reader.onload = function () {
      if (typeof reader.result === 'string') {
        setSrc(reader.result)
      }
      return ''
    }
    if (files !== null) {
      reader.readAsDataURL(files[0])
    }
  }

  const handleOnClick = () => {
    const { height, width } = imgSize
    const payload = { altText, src, height, width }
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, payload)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost">
          <ImageIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent
        onCloseAutoFocus={() => {
          editor.focus()
        }}
      >
        <DialogHeader>
          <DialogTitle>Image Editor</DialogTitle>
        </DialogHeader>
        <Input
          type="file"
          onChange={(event) => {
            loadImage(event.target.files)
          }}
          accept="image/*"
        />
        <Input
          value={altText}
          onChange={(event) => {
            setAltText(event.target.value)
          }}
        />
        <DialogClose>Cancel</DialogClose>
        <DialogClose asChild>
          <Button disabled={isDisabled} onClick={handleOnClick}>
            Insert Image
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}

export default function ImagesPlugin() {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error('ImagesPlugin: ImageNode not registered on editor')
    }

    return mergeRegister(
      editor.registerCommand(
        INSERT_IMAGE_COMMAND,
        (payload) => {
          const selection = $getSelection()
          if (!$isRangeSelection(selection)) {
            return false
          }
          const focusNode = selection.focus.getNode()
          if (focusNode !== null) {
            const imageNode = $createImageNode(payload)
            $insertNodeToNearestRoot(imageNode)
            // if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
            //   $wrapNodeInElement(imageNode, $createParagraphNode)
            // }
            return true
          }

          return true
        },
        COMMAND_PRIORITY_EDITOR
      )
    )
  }, [editor])

  return null
}
