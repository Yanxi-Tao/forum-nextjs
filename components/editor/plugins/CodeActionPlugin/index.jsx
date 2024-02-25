import {
  $isCodeNode,
  CodeNode,
  getLanguageFriendlyName,
  normalizeCodeLang,
} from '@lexical/code'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getNearestNodeFromDOMNode } from 'lexical'
import { useEffect, useRef, useState } from 'react'
import * as React from 'react'
import * as Portal from '@radix-ui/react-portal'

import { CopyButton } from '../../components/CodeActionCopyButton'
import { useDebounce } from '@/hooks/useDebounce'

const ACTION_PADDING = 8

function CodeActionMenuContainer({ anchorElem }) {
  const [editor] = useLexicalComposerContext()

  const [lang, setLang] = useState('')
  const [isShown, setShown] = useState(false)
  const [shouldListenMouseMove, setShouldListenMouseMove] = useState(false)
  const [position, setPosition] = useState({ right: 0, top: 0 })

  const codeSetRef = useRef(new Set())
  const codeDOMNodeRef = useRef(null)

  function getCodeDOMNode() {
    return codeDOMNodeRef.current
  }

  // update code action position and visibility
  const deBounceMouseEnterCodeBlock = useDebounce(
    (event) => {
      const { codeDOMNode, isOutside } = getMouseInfo(event)

      if (isOutside) {
        setShown(false)
        return
      }

      if (!codeDOMNode) {
        return
      }

      codeDOMNodeRef.current = codeDOMNode

      let codeNode = null
      let _lang = ''

      editor.update(() => {
        const maybeCodeNode = $getNearestNodeFromDOMNode(codeDOMNode)

        if ($isCodeNode(maybeCodeNode)) {
          codeNode = maybeCodeNode
          _lang = codeNode.getLanguage() || ''
        }
      })

      if (codeNode) {
        const { top: editorElemY, right: editorElemRight } =
          anchorElem.getBoundingClientRect()
        const { top, right } = codeDOMNode.getBoundingClientRect()
        setLang(_lang)
        setShown(true)
        setPosition({
          right: `${editorElemRight - right + ACTION_PADDING}px`,
          top: `${top - editorElemY}px`,
        })
      }
    },
    50,
    1000
  )

  // continuously call code action update callback
  useEffect(() => {
    if (!shouldListenMouseMove) {
      return
    }

    document.addEventListener('mousemove', deBounceMouseEnterCodeBlock)

    return () => {
      setShown(false)
      deBounceMouseEnterCodeBlock.cancel()
      document.removeEventListener('mousemove', deBounceMouseEnterCodeBlock)
    }
  }, [shouldListenMouseMove, deBounceMouseEnterCodeBlock])

  // listen to if cursor enters codeblock as long as
  // at least one code block node exist in editor
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

  const normalizedLang = normalizeCodeLang(lang)
  const codeFriendlyName = getLanguageFriendlyName(lang)

  return (
    <>
      {isShown ? (
        <div
          className="code-action-menu-container flex flex-row"
          style={{ ...position }}
        >
          <div className="code-highlight-languag mr-2">{codeFriendlyName}</div>
          <CopyButton editor={editor} getCodeDOMNode={getCodeDOMNode} />
        </div>
      ) : null}
    </>
  )
}

// determine of cursor is in a code block / a code block's menu action container
// return code block node element & whether cursor in
function getMouseInfo(event) {
  const target = event.target

  if (target && target instanceof HTMLElement) {
    const codeDOMNode = target.closest('code.editor-code')

    const isOutside = !(
      codeDOMNode || target.closest('div.code-action-menu-container')
    )

    return { codeDOMNode, isOutside }
  } else {
    return { codeDOMNode: null, isOutside: true }
  }
}
