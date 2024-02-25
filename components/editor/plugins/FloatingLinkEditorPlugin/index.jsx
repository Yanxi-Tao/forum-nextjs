import './index.css'

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
  KEY_ESCAPE_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from 'lexical'
import { useCallback, useEffect, useRef, useState } from 'react'
import * as React from 'react'
import { createPortal } from 'react-dom'

import { getSelectedNode } from '@/lib/utils/editor/getSelectedNode'
import { setFloatingElemPositionForLinkEditor } from '@/lib/utils/editor/setFloatingElemPositionForLinkEditor'
import { sanitizeUrl } from '@/lib/utils/editor/url'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { XCircle, Check, Pencil, Trash } from 'lucide-react'

// link editor component
function FloatingLinkEditor({
  editor,
  isLink,
  setIsLink,
  anchorElem, // rootNode parent node (div)
  isLinkEditMode,
  setIsLinkEditMode,
}) {
  const editorRef = useRef(null)
  const inputRef = useRef(null)
  const [linkUrl, setLinkUrl] = useState('')
  const [editedLinkUrl, setEditedLinkUrl] = useState('https://')
  const [lastSelection, setLastSelection] = useState(null)

  // update link editor (visibility, position, value)
  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection()
    // if current selection is of textNode
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection)
      const linkParent = $findMatchingParent(node, $isLinkNode) // in case a segment of linkNode is selected

      // pre-populate url if a linkNode or part of a linkNode is selected
      if (linkParent) {
        setLinkUrl(linkParent.getURL())
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL())
      } else {
        setLinkUrl('')
      }

      // if in edit mode then initialize url
      if (isLinkEditMode) {
        setEditedLinkUrl(linkUrl)
      }
    }
    const editorElem = editorRef.current // ref of link editor root div
    const nativeSelection = window.getSelection() // return native selection object
    const activeElement = document.activeElement // return element object currently in focus

    if (editorElem === null) {
      return
    }

    const rootElement = editor.getRootElement() // rootNode - contentEditable

    // if some node within the editor rootNode is selected and editor is editable
    if (
      selection !== null &&
      nativeSelection !== null &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode) &&
      editor.isEditable()
    ) {
      const domRect =
        nativeSelection.focusNode?.parentElement?.getBoundingClientRect()
      if (domRect) {
        domRect.y += 40 // change y value so that the link editor appears below selected text
        setFloatingElemPositionForLinkEditor(domRect, editorElem, anchorElem) // show and position link editor
      }
      setLastSelection(selection) // remember selection
    } else if (!activeElement || activeElement.className !== 'link-input') {
      // if no element in focus or the focused element is not link editor input
      if (rootElement !== null) {
        setFloatingElemPositionForLinkEditor(null, editorElem, anchorElem) // hide link editor
      }
      // reset states
      setLastSelection(null)
      setIsLinkEditMode(false)
      setLinkUrl('')
    }

    return true
  }, [anchorElem, editor, setIsLinkEditMode, isLinkEditMode, linkUrl])

  // runs ones -- register event listeners --> update link editor when window resized or scrolled
  useEffect(() => {
    const scrollerElem = anchorElem.parentElement

    const update = () => {
      editor.getEditorState().read(() => {
        updateLinkEditor()
      })
    }

    window.addEventListener('resize', update)

    if (scrollerElem) {
      scrollerElem.addEventListener('scroll', update)
    }

    return () => {
      window.removeEventListener('resize', update)

      if (scrollerElem) {
        scrollerElem.removeEventListener('scroll', update)
      }
    }
  }, [anchorElem.parentElement, editor, updateLinkEditor])

  // update link editor when lexical editor state changes, selection changes, and conditionally when escape key pressed
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
      ),
      editor.registerCommand(
        KEY_ESCAPE_COMMAND,
        () => {
          if (isLink) {
            setIsLink(false)
            return true
          }
          return false
        },
        COMMAND_PRIORITY_HIGH
      )
    )
  }, [editor, updateLinkEditor, setIsLink, isLink])

  // initialize link editor
  useEffect(() => {
    editor.getEditorState().read(() => {
      updateLinkEditor()
    })
  }, [editor, updateLinkEditor])

  // auto-focus input element when in link edit mode
  useEffect(() => {
    if (isLinkEditMode && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isLinkEditMode, isLink])

  // handle key events when typing in link editor input element
  const monitorInputInteraction = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleLinkSubmission()
    } else if (event.key === 'Escape') {
      event.preventDefault()
      setIsLinkEditMode(false)
    }
  }

  // sumbit (update) edited link
  const handleLinkSubmission = () => {
    if (lastSelection !== null) {
      if (linkUrl !== '') {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl(editedLinkUrl)) // set linkNode with edited url
        editor.update(() => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            const parent = getSelectedNode(selection).getParent()
            // if node is autolinkNode then replace it with linkNode
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
      // reset states and change to render mode
      setEditedLinkUrl('https://')
      setIsLinkEditMode(false)
    }
  }

  return (
    <div ref={editorRef} className="link-editor">
      {!isLink ? null : isLinkEditMode ? (
        <>
          <Input
            ref={inputRef}
            value={editedLinkUrl}
            onChange={(event) => {
              setEditedLinkUrl(event.target.value)
            }}
            onKeyDown={(event) => {
              monitorInputInteraction(event)
            }}
          />
          <div>
            <Button
              onClick={() => {
                setIsLinkEditMode(false)
              }}
            >
              <XCircle className="h-4 w-4" />
            </Button>
            <Button onClick={handleLinkSubmission}>
              <Check className="h-4 w-4" />
            </Button>
          </div>
        </>
      ) : (
        <div className="link-view">
          <a
            href={sanitizeUrl(linkUrl)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {linkUrl}
          </a>
          <Button
            onClick={() => {
              setEditedLinkUrl(linkUrl)
              setIsLinkEditMode(true)
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => {
              editor.dispatchCommand(TOGGLE_LINK_COMMAND, null) // null parameter unset linkNode
            }}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

// link editor hook
function useFloatingLinkEditorToolbar(
  editor,
  anchorElem, // rootNode parent node (div)
  isLinkEditMode,
  setIsLinkEditMode
) {
  const [activeEditor, setActiveEditor] = useState(editor)
  const [isLink, setIsLink] = useState(false)

  //
  useEffect(() => {
    // check if current selection is or includes linkNode
    function updateToolbar() {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        const focusNode = getSelectedNode(selection)
        const focusLinkNode = $findMatchingParent(focusNode, $isLinkNode)
        const focusAutoLinkNode = $findMatchingParent(
          focusNode,
          $isAutoLinkNode
        )
        // check if is linkNode
        if (!(focusLinkNode || focusAutoLinkNode)) {
          setIsLink(false)
          return
        }
        // case when multiple nodes are selected
        const badNode = selection.getNodes().find((node) => {
          const linkNode = $findMatchingParent(node, $isLinkNode)
          const autoLinkNode = $findMatchingParent(node, $isAutoLinkNode)
          // return truthy value none of the selected nodes is the focus node and make sure linkBreakNode is not within selection
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
        if (!badNode) {
          setIsLink(true)
        } else {
          setIsLink(false)
        }
      }
    }
    // callBack updateToolbar when lexical editor state changed, selection changed, open link in new tab (stays in current tab) when meta/ctrl key pressed
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar()
        })
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          updateToolbar()
          setActiveEditor(newEditor)
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

  return createPortal(
    <FloatingLinkEditor
      editor={activeEditor}
      isLink={isLink}
      anchorElem={anchorElem}
      setIsLink={setIsLink}
      isLinkEditMode={isLinkEditMode}
      setIsLinkEditMode={setIsLinkEditMode}
    />,
    anchorElem
  )
}

export default function FloatingLinkEditorPlugin({
  anchorElem = document.body, // rootNode parent node (div)
  isLinkEditMode,
  setIsLinkEditMode,
}) {
  const [editor] = useLexicalComposerContext()
  return useFloatingLinkEditorToolbar(
    editor,
    anchorElem,
    isLinkEditMode,
    setIsLinkEditMode
  )
}
