import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEffect, useState } from 'react'
import { $createImageNode, ImageNode, ImagePayload } from '../nodes/image-node'
import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  LexicalCommand,
  LexicalEditor,
  createCommand,
} from 'lexical'
import { $insertNodeToNearestRoot, $wrapNodeInElement } from '@lexical/utils'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { UploadDropzone } from '@/lib/utils'
import Cliploader from 'react-spinners/ClipLoader'
import { Button } from '@/components/ui/button'
import { CircleCheckBig, ImageIcon } from 'lucide-react'
import { set } from 'zod'

export const INSERT_IMAGE_COMMAND: LexicalCommand<ImagePayload> = createCommand(
  'INSERT_IMAGE_COMMAND'
)

export const InsertImageDialog: React.FC<{ editor: LexicalEditor }> = ({
  editor,
}) => {
  const [uploading, setUploading] = useState(false)
  const [src, setSrc] = useState<string>('')

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <ImageIcon size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent
        onCloseAutoFocus={() => {
          editor.focus()
        }}
      >
        <DialogHeader>
          <DialogTitle>Upload image</DialogTitle>
        </DialogHeader>
        {uploading ? (
          <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">
            <Cliploader color="#8585ad" />
          </span>
        ) : src ? (
          <div className="flex justify-center items-center my-10 space-x-4">
            <CircleCheckBig size={40} />
            <DialogDescription>Image uploaded successfully</DialogDescription>
          </div>
        ) : (
          <UploadDropzone
            endpoint="postImageUploader"
            onBeforeUploadBegin={(files) => {
              setUploading(true)
              return files
            }}
            onClientUploadComplete={(res) => {
              setUploading(false)
              setSrc(res[0].url)
            }}
            onUploadError={(error: Error) => {
              setUploading(false)
              console.error('Error: ', error)
            }}
          />
        )}
        <DialogFooter>
          <DialogClose onClick={() => setSrc('')}>Cancel</DialogClose>
          <DialogClose asChild>
            <Button
              disabled={uploading || !src}
              onClick={() => {
                editor.dispatchCommand(INSERT_IMAGE_COMMAND, { src })
                setSrc('')
              }}
            >
              Insert
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function ImagePlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error('ImagePlugin: ImageNode not registered on editor')
    }

    return editor.registerCommand<ImagePayload>(
      INSERT_IMAGE_COMMAND,
      (payload) => {
        const { src } = payload

        const node = $createImageNode(src)
        $insertNodeToNearestRoot(node)
        return true
      },
      COMMAND_PRIORITY_EDITOR
    )
  }, [editor])

  return null
}
