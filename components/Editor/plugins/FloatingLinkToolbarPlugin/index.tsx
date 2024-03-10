import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { getSelectedNode } from '@/lib/editor/getSelectedNode'
import { setFloatingLinkToolbarPosition } from '@/lib/editor/setFloatingLinkToolbarPosition'
import { sanitizeUrl, validateUrl } from '@/lib/editor/url'
import {
  $createLinkNode,
  $isAutoLinkNode,
  $isLinkNode,
  TOGGLE_LINK_COMMAND,
} from '@lexical/link'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $findMatchingParent, mergeRegister } from '@lexical/utils'
import * as Portal from '@radix-ui/react-portal'
import {
  $getSelection,
  $isLineBreakNode,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_LOW,
  LexicalEditor,
  SELECTION_CHANGE_COMMAND,
} from 'lexical'
import { Link } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

export function InsertLinkDialog({
  editor,
  isLink,
}: {
  editor: LexicalEditor
  isLink: boolean
}): JSX.Element {
  const [editedLinkUrl, setEditedLinkUrl] = useState('')
  const [isUrl, setIsUrl] = useState(false)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={isLink} size="icon" variant="ghost">
          <Link className="h-4 w-4 mx-1.5" />
        </Button>
      </DialogTrigger>
      <DialogContent
        onCloseAutoFocus={() => {
          editor.focus()
        }}
      >
        <DialogHeader>
          <DialogTitle>Link Editor</DialogTitle>
        </DialogHeader>
        <Input
          value={editedLinkUrl}
          onChange={(event) => {
            setEditedLinkUrl(event.target.value)
            setIsUrl(validateUrl(editedLinkUrl))
          }}
        />
        <DialogClose>Cancel</DialogClose>
        <DialogClose asChild>
          <Button
            disabled={!isUrl}
            onClick={() => {
              editor.dispatchCommand(
                TOGGLE_LINK_COMMAND,
                sanitizeUrl(editedLinkUrl)
              )
              editor.update(() => {
                const selection = $getSelection()
                if ($isRangeSelection(selection)) {
                  const node = getSelectedNode(selection).getNextSibling()
                  node?.selectEnd()
                }
              })
              setEditedLinkUrl('')
            }}
          >
            Confirm
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}

function FloatingLinkToolbar({
  editor,
  anchorElem,
  isLink,
}: {
  editor: LexicalEditor
  anchorElem: HTMLElement
  isLink: boolean
}): JSX.Element {
  const [linkURL, setLinkURL] = useState('')
  const [editedLinkURL, setEditedLinkURL] = useState('')
  const [isURL, setIsURL] = useState(false)
  const toolbarRef = useRef<HTMLDivElement>(null)

  const updateLinkEditorPosition = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection)
      const linkNode = $findMatchingParent(node, $isLinkNode)

      if (linkNode) {
        setLinkURL(linkNode.getURL())
      } else if ($isLinkNode(node)) {
        setLinkURL(node.getURL())
      } else {
        setLinkURL('')
      }
      setIsURL(validateUrl(linkURL))
      setEditedLinkURL(linkURL)
    }

    const toolbarElem = toolbarRef.current
    const nativeSelection = window.getSelection()

    if (toolbarElem === null) {
      return
    }

    if (selection !== null && nativeSelection !== null) {
      const domRect =
        nativeSelection.anchorNode?.parentElement?.getBoundingClientRect()
      if (domRect) {
        setFloatingLinkToolbarPosition(domRect, toolbarElem, anchorElem)
      }
    }
    return true
  }, [anchorElem, linkURL])

  useEffect(() => {
    const update = () => {
      editor.getEditorState().read(() => {
        updateLinkEditorPosition()
      })
    }

    window.addEventListener('resize', update)
    if (anchorElem) {
      anchorElem.addEventListener('scroll', update)
    }

    return () => {
      window.removeEventListener('resize', update)
      if (anchorElem) {
        anchorElem.removeEventListener('scroll', update)
      }
    }
  }, [anchorElem, editor, updateLinkEditorPosition])

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateLinkEditorPosition()
        })
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditorPosition()
          return true
        },
        COMMAND_PRIORITY_LOW
      )
    )
  }, [editor, updateLinkEditorPosition])

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateLinkEditorPosition()
    })
  }, [editor, updateLinkEditorPosition])

  const handleURLSubmission = () => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl(editedLinkURL))
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        const node = getSelectedNode(selection).getParent()
        if ($isAutoLinkNode(node)) {
          const linkNode = $createLinkNode(node.getURL(), {
            rel: node.__rel,
            target: node.__target,
            title: node.__title,
          })
          node.replace(linkNode, true)
        }
      }
    })
  }

  return (
    <div ref={toolbarRef} className="absolute z-30">
      {isLink && editor.isEditable() ? (
        <div className="flex bg-muted-foreground rounded-md p-0.5">
          <Button variant="ghost" size="sm">
            <a href={linkURL} target="_blank">
              Visit Link
            </a>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                Edit Link
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Link Editor</DialogTitle>
              </DialogHeader>
              <Input
                value={editedLinkURL}
                onChange={(e) => {
                  setEditedLinkURL(e.target.value)
                  setIsURL(validateUrl(e.target.value))
                }}
                placeholder="Enter URL"
              />
              <DialogFooter>
                <DialogClose>Cancel</DialogClose>
                <DialogClose asChild>
                  <Button disabled={!isURL} onClick={handleURLSubmission}>
                    Save
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
            }}
          >
            Remove Link
          </Button>
        </div>
      ) : null}
    </div>
  )
}

function useFloatingLinkToolbar(
  editor: LexicalEditor,
  anchorElem: HTMLElement
): JSX.Element | null {
  const [isLink, setIsLink] = useState(false)

  useEffect(() => {
    function checkSelection() {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        const node = getSelectedNode(selection)
        if (!$findMatchingParent(node, $isLinkNode)) {
          setIsLink(false)
          return
        }

        const badSelection = selection.getNodes().find((node) => {
          const linkNode = $findMatchingParent(node, $isLinkNode)
          if (!linkNode) {
            return node
          }
        })

        if (!badSelection) {
          setIsLink(true)
        } else {
          setIsLink(false)
        }
      }
    }

    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          checkSelection()
        })
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          checkSelection()
          return false
        },
        COMMAND_PRIORITY_CRITICAL
      )
    )
  }, [editor])

  return (
    <Portal.Root container={anchorElem}>
      <FloatingLinkToolbar
        editor={editor}
        anchorElem={anchorElem}
        isLink={isLink}
      />
    </Portal.Root>
  )
}

export default function FloatingLinkToolbarPlugin({
  anchorElem,
}: {
  anchorElem: HTMLElement
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext()
  return useFloatingLinkToolbar(editor, anchorElem)
}
