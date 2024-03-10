import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import * as React from 'react'
import { useEffect, useState } from 'react'
import {
  $createImageNode,
  ImageNode,
  ImagePayload,
} from '../../nodes/ImageNode'
import {
  COMMAND_PRIORITY_EDITOR,
  LexicalCommand,
  LexicalEditor,
  createCommand,
} from 'lexical'
import { $insertNodeToNearestRoot } from '@lexical/utils'
import {
  Dialog,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ImageIcon } from 'lucide-react'
import { DialogContent } from '@radix-ui/react-dialog'
import { Input } from '@/components/ui/input'

export const INSERT_IMAGE_COMMAND: LexicalCommand<ImagePayload> = createCommand(
  'INSERT_IMAGE_COMMAND'
)

export function InsertImageDialog({
  editor,
}: {
  editor: LexicalEditor
}): JSX.Element {
  const [src, setSrc] = useState('')
  const [altText, setAltText] = useState('')

  const isDisabled = src === '' || altText === ''

  const loadImage = (files: FileList | null) => {
    const reader = new FileReader()
    reader.onload = function () {
      if (typeof reader.result === 'string') {
        setSrc(reader.result)
      }
      return ''
    }
    if (files && files[0]) {
      reader.readAsDataURL(files[0])
    }
  }

  const handleConfirm = () => {
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, { src, altText })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost">
          <ImageIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Insert Image</DialogTitle>
        </DialogHeader>
        <Input
          type="file"
          onChange={(event) => loadImage(event.target.files)}
          accept="image/*"
        />
        <Input
          value={altText}
          onChange={(event) => setAltText(event.target.value)}
          placeholder="Alt Text"
        />
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
          <DialogClose asChild>
            <Button disabled={isDisabled} onClick={handleConfirm}>
              Confirm
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function ImagesPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error('ImagesPlugin: ImageNode not registered on editor')
    }

    return editor.registerCommand<ImagePayload>(
      INSERT_IMAGE_COMMAND,
      (payload) => {
        const imageNode = $createImageNode(payload)
        $insertNodeToNearestRoot(imageNode)
        return true
      },
      COMMAND_PRIORITY_EDITOR
    )
  }, [editor])

  return null
}
