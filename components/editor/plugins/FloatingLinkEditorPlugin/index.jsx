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

import * as Portal from '@radix-ui/react-portal'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { getSelectedNode } from '@/lib/utils/editor/getSelectedNode'
import { setFloatingLinkToolbarPosition } from '@/lib/utils/editor/setFloatingLinkEditorPosition'
import { sanitizeUrl } from '@/lib/utils/editor/sanitizeUrl'

function FloatingLinkToolbar({ editor, isLink }) {
  const [linkUrl, setLinkUrl] = useState('')
  const toolbarRef = useRef(null)

  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection)
      const linkParent = $findMatchingParent(node, $isLinkNode)

      // get existed link url
      if (linkParent) {
        setLinkUrl(linkParent.getURL())
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL())
      } else {
        setLinkUrl('')
      }
    }

    const toolbarElem = toolbarRef.current
    const nativeSelection = window.getSelection()

    if (toolbarElem === null) {
      return
    }

    if (selection !== null && nativeSelection !== null) {
      const domRect =
        nativeSelection.focusNode?.parentElement?.getBoundingClientRect() // get the position of achorElement

      if (domRect) {
        setFloatingLinkToolbarPosition(domRect, toolbarElem)
      } else {
        setFloatingLinkToolbarPosition(null, toolbarElem)
        setLinkUrl('')
      }
    }

    return true
  }, [])

  // update toolbar position when window scrolled
  useEffect(() => {
    const scrollerElem = editor.getRootElement().parentElement

    const update = () => {
      editor.getEditorState().read(() => {
        updateLinkEditor()
      })
    }

    if (scrollerElem) {
      scrollerElem.addEventListener('scroll', update)
    }

    return () => {
      if (scrollerElem) {
        scrollerElem.removeEventListener('scroll', update)
      }
    }
  }, [editor, updateLinkEditor])

  // update toolbar when editor state change
  // or selection change
  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateLinkEditor()
        })
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor()
          return true
        },
        COMMAND_PRIORITY_LOW
      )
    )
  }, [editor, updateLinkEditor])

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateLinkEditor()
    })
  }, [editor, updateLinkEditor])

  const handleUrlSubmission = (editedLinkUrl) => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl(editedLinkUrl))
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        const parent = getSelectedNode(selection).getParent()
        if ($isAutoLinkNode(parent)) {
          const linkNode = $createLinkNode(parent.getURL(), {
            rel: parent.__rel,
            target: parent.__target,
            title: parent.__title,
          })
          parent.replace(linkNode, true)
        }
      }
    })
  }

  return (
    <div ref={toolbarRef} className="absolute flex">
      {isLink ? (
        <Dialog>
          <DialogTrigger>Edit Link</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Link Editor</DialogTitle>
            </DialogHeader>
            <LinkEditorDialog
              linkUrl={linkUrl}
              handleUrlSubmission={handleUrlSubmission}
            />
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  )
}

function LinkEditorDialog({ linkUrl, handleUrlSubmission }) {
  const [editedLinkUrl, setEditedLinkUrl] = useState(linkUrl)
  return (
    <div className="flex flex-row items-center space-x-2">
      <Input
        value={editedLinkUrl}
        onChange={(event) => setEditedLinkUrl(event.target.value)}
      />
      <DialogFooter>
        <DialogClose asChild>
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleUrlSubmission(editedLinkUrl)}
          >
            Close
          </Button>
        </DialogClose>
      </DialogFooter>
    </div>
  )
}

function useFloatingLinkEditorToolbar(editor, anchorElem) {
  const [isLink, setIsLink] = useState(false) // if is either linkNode to autoLinkNode

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
          setIsLink(true)
        } else {
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
            const linkNode = $findMatchingParent(node, $isLinkNode)
            if ($isLinkNode(linkNode) && (payload.metaKey || payload.ctrlKey)) {
              window.open(linkNode.getURL(), '_blank')
              return true
            }
          }
          return false
        },
        COMMAND_PRIORITY_LOW
      )
    )
  }, [editor])

  return (
    <Portal.Root container={anchorElem}>
      <FloatingLinkToolbar editor={editor} isLink={isLink} />
    </Portal.Root>
  )
}

export default function FloatingLinkEditorPlugin({
  anchorElem = document.body,
}) {
  const [editor] = useLexicalComposerContext()
  return useFloatingLinkEditorToolbar(editor, anchorElem)
}
