// Language display and copy code function

import { $isCodeNode, CodeNode, getLanguageFriendlyName } from '@lexical/code'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getNearestNodeFromDOMNode } from 'lexical'
import { useEffect, useRef, useState } from 'react'
import * as React from 'react'
import { createPortal } from 'react-dom'

import { useDebounce } from '@/hooks/useDebounce'
import { CopyButton } from '../../components/CodeActionComponent'

const CODE_PADDING = 8

function CodeActionMenuContainer({ anchorElem }) {
  const [editor] = useLexicalComposerContext()

  const [lang, setLang] = useState('')
  const [isShown, setShown] = useState(false)
  const [shouldListenMouseMove, setShouldListenMouseMove] = useState(false)
  const [position, setPosition] = useState({ right: 0, top: 0 })

  const codeSetRef = useRef(new Set())
  const codeDOMNodeRef = useRef(null)

  // return code dom ref
  function getCodeDOMNode() {
    return codeDOMNodeRef.current
  }

  // debounced onMouseMove event callback
  const debounceOnMouseMove = useDebounce(
    (event) => {
      const { codeDOMNode, isOutside } = getMouseInfo(event) // null, false if not

      if (isOutside) {
        setShown(false)
        return
      }

      if (!codeDOMNode) {
        return
      }

      // initialize ref
      codeDOMNodeRef.current = codeDOMNode

      let codeNode = null
      let _lang = ''

      editor.update(() => {
        const maybeCodeNode = $getNearestNodeFromDOMNode(codeDOMNode)

        // if the maybeCodeNode is indeed a codeNode instance
        if ($isCodeNode(maybeCodeNode)) {
          codeNode = maybeCodeNode
          _lang = codeNode.getLanguage() || '' // get coding language
        }
      })

      // if a mouse is in a codeNode instance
      if (codeNode) {
        const { y: editorElemY, right: editorElemRight } =
          anchorElem.getBoundingClientRect() // get the rootNode parent div position
        const { y, right } = codeDOMNode.getBoundingClientRect()
        // update states: language type, visibility and position
        setLang(_lang)
        setShown(true)
        setPosition({
          right: `${editorElemRight - right + CODE_PADDING}px`,
          top: `${y - editorElemY}px`,
        })
      }
    },
    50,
    1000
  )

  // whether mouse enter codeblock event listener
  useEffect(() => {
    if (!shouldListenMouseMove) {
      return
    }

    document.addEventListener('mousemove', debounceOnMouseMove)

    return () => {
      setShown(false)
      debounceOnMouseMove.cancel()
      document.removeEventListener('mousemove', debounceOnMouseMove)
    }
  }, [shouldListenMouseMove, debounceOnMouseMove])

  // life cycle hooks check for codeNode mounted/unmounted
  editor.registerMutationListener(CodeNode, (mutations) => {
    editor.getEditorState().read(() => {
      for (const [key, type] of mutations) {
        switch (type) {
          case 'created':
            codeSetRef.current.add(key)
            setShouldListenMouseMove(codeSetRef.current.size > 0)
            break
          case 'destroyed':
            codeSetRef.current.delete(key)
            setShouldListenMouseMove(codeSetRef.current.size > 0)
            break
          default:
            break
        }
      }
    })
  })

  const codeFriendlyName = getLanguageFriendlyName(lang)

  return (
    <>
      {isShown ? (
        <div
          className="absolute flex items-center flex-row select-none h-9 text-xs"
          style={{ ...position }}
        >
          <div className="mr-1">{codeFriendlyName}</div>
          <CopyButton editor={editor} getCodeDOMNode={getCodeDOMNode} />
        </div>
      ) : null}
    </>
  )
}

// if mouse enters codeNode return codeNode DOM element and whether mouse enters that element
function getMouseInfo(event) {
  const target = event.target

  if (target && target instanceof HTMLElement) {
    const codeDOMNode = target.closest('code.PlaygroundEditorTheme__code') // if current element or its parents do not match with selectors then return null otherwise the element

    const isOutside = !(
      codeDOMNode || target.closest('div.code-action-menu-container')
    )

    return { codeDOMNode, isOutside }
  } else {
    return { codeDOMNode: null, isOutside: true }
  }
}

export default function CodeActionMenuPlugin({ anchorElem = document.body }) {
  return createPortal(
    <CodeActionMenuContainer anchorElem={anchorElem} />, // anchor element is the rootNode parrent wrapper
    anchorElem
  )
}
