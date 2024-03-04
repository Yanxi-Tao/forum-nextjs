import { setFloatingLinkToolbarPosition } from '@/lib/utils/editor/setFloatingLinkEditorPosition'
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
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_LOW,
  SELECTION_CHANGE_COMMAND,
} from 'lexical'

import { useState, useEffect, useCallback, useRef } from 'react'
import * as React from 'react'
import { sanitizeUrl } from '@/lib/utils/editor/url'
import { validateUrl } from '@/lib/utils/editor/url'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import * as Portal from '@radix-ui/react-portal'

import { Link } from 'lucide-react'

import { getSelectedNode } from '@/lib/utils/editor/getSelectedNode'

// initialize/insert a new linkNode
export function InsertLinkDialog({ editor, isLink }) {
  const [editedLinkUrl, setEditedLinkUrl] = useState('')
  const [isUrl, setIsUrl] = useState(false)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost">
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
                const node = getSelectedNode($getSelection()).getNextSibling()
                node?.selectEnd()
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

function FloatingLinkToolbar({ editor, anchorElem, isLink }) {
  const [linkUrl, setLinkUrl] = useState('')
  const [editedLinkUrl, setEditedLinkUrl] = useState('')
  const [isUrl, setIsUrl] = useState('')
  const toolbarRef = useRef(null)

  // update link editor position callback
  const updateLinkEditorPos = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection)
      const linkNode = $findMatchingParent(node, $isLinkNode)

      if (linkNode) {
        setLinkUrl(linkNode.getURL())
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL())
      } else {
        setLinkUrl('')
      }
      setIsUrl(validateUrl(linkUrl))
      setEditedLinkUrl(linkUrl)
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
  }, [anchorElem, linkUrl])

  // update link editor position when
  // window resized or scrolled
  useEffect(() => {
    const update = () => {
      editor.getEditorState().read(() => {
        updateLinkEditorPos()
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
  }, [editor, anchorElem, updateLinkEditorPos])

  // update link editor position when selection change
  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateLinkEditorPos()
        })
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditorPos()
          return true
        },
        COMMAND_PRIORITY_LOW
      )
    )
  }, [editor, updateLinkEditorPos])

  // initialize link editor position
  useEffect(() => {
    editor.getEditorState().read(() => {
      updateLinkEditorPos()
    })
  }, [editor, updateLinkEditorPos])

  // handle link update submission
  const handleUrlSubmission = () => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl(editedLinkUrl))
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        const node = getSelectedNode(selection).getParent()
        if ($isAutoLinkNode(node)) {
          const linkNode = $createLinkNode(node.getURL(), {
            rel: parent.__rel,
            target: parent.__target,
            title: parent.__title,
          })
          node.replace(linkNode, true)
        }
      }
    })
  }

  // render link editor only in edit mode
  return (
    <div ref={toolbarRef} className="absolute z-30">
      {isLink && editor.isEditable() ? (
        <div className="flex bg-muted-foreground rounded-md p-0.5">
          <Button variant="ghost" size="sm">
            <a href={linkUrl} target="_blank">
              Visit Link
            </a>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                Edit Link
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
                <Button disabled={!isUrl} onClick={handleUrlSubmission}>
                  Confirm
                </Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
            }}
          >
            Delete Link
          </Button>
        </div>
      ) : null}
    </div>
  )
}

function useFloatingLinkEditorToolbar(editor, anchorElem) {
  const [isLink, setIsLink] = useState(false)

  // check if selection is linkNode when
  // selection change or editor state updated
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

export default function FloatingLinkEditorPlugin({
  anchorElem = document.body,
}) {
  const [editor] = useLexicalComposerContext()

  return useFloatingLinkEditorToolbar(editor, anchorElem)
}
