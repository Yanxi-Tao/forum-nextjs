import './index.css'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import LexicalTableOfContents from '@lexical/react/LexicalTableOfContents'
import { useEffect, useRef, useState } from 'react'
import * as React from 'react'

const MARGIN_ABOVE_EDITOR = 624
const HEADING_WIDTH = 9

function indent(tagName) {
  if (tagName === 'h1') {
    return 'heading1'
  } else if (tagName === 'h2') {
    return 'heading2'
  } else if (tagName === 'h3') {
    return 'heading3'
  }
}

// utility functions
function isHeadingAtTheTopOfThePage(element) {
  const elementYPosition = element?.getClientRects()[0].y
  return (
    elementYPosition >= MARGIN_ABOVE_EDITOR &&
    elementYPosition <= MARGIN_ABOVE_EDITOR + HEADING_WIDTH
  )
}
function isHeadingAboveViewport(element) {
  const elementYPosition = element?.getClientRects()[0].y
  return elementYPosition < MARGIN_ABOVE_EDITOR
}
function isHeadingBelowTheTopOfThePage(element) {
  const elementYPosition = element?.getClientRects()[0].y
  return elementYPosition >= MARGIN_ABOVE_EDITOR + HEADING_WIDTH
}

// table of content component
function TableOfContentsList({ tableOfContents }) {
  const [selectedKey, setSelectedKey] = useState('') // key of lexical node
  const selectedIndex = useRef(0) // index of selected heading in the TableOfContentsList
  const [editor] = useLexicalComposerContext()

  // scroll page to view when clicked on table of content & update selectedKey and selectedIndex
  function scrollToNode(key, currIndex) {
    editor.getEditorState().read(() => {
      const domElement = editor.getElementByKey(key)
      if (domElement !== null) {
        domElement.scrollIntoView()
        setSelectedKey(key)
        selectedIndex.current = currIndex
      }
    })
  }

  // update table of content selection when scrolling
  useEffect(() => {
    function scrollCallback() {
      if (
        tableOfContents.length !== 0 &&
        selectedIndex.current < tableOfContents.length - 1
      ) {
        let currentHeading = editor.getElementByKey(
          tableOfContents[selectedIndex.current][0]
        ) // get the current selected table of content element key
        if (currentHeading !== null) {
          if (isHeadingBelowTheTopOfThePage(currentHeading)) {
            //On natural scroll, user is scrolling up
            while (
              currentHeading !== null &&
              isHeadingBelowTheTopOfThePage(currentHeading) &&
              selectedIndex.current > 0
            ) {
              const prevHeading = editor.getElementByKey(
                tableOfContents[selectedIndex.current - 1][0]
              )
              if (
                prevHeading !== null &&
                (isHeadingAboveViewport(prevHeading) ||
                  isHeadingBelowTheTopOfThePage(prevHeading))
              ) {
                selectedIndex.current--
              }
              currentHeading = prevHeading
            }
            const prevHeadingKey = tableOfContents[selectedIndex.current][0]
            setSelectedKey(prevHeadingKey)
          } else if (isHeadingAboveViewport(currentHeading)) {
            //On natural scroll, user is scrolling down
            while (
              currentHeading !== null &&
              isHeadingAboveViewport(currentHeading) &&
              selectedIndex.current < tableOfContents.length - 1
            ) {
              const nextHeading = editor.getElementByKey(
                tableOfContents[selectedIndex.current + 1][0]
              )
              if (
                nextHeading !== null &&
                (isHeadingAtTheTopOfThePage(nextHeading) ||
                  isHeadingAboveViewport(nextHeading))
              ) {
                selectedIndex.current++
              }
              currentHeading = nextHeading
            }
            const nextHeadingKey = tableOfContents[selectedIndex.current][0]
            setSelectedKey(nextHeadingKey)
          }
        }
      } else {
        selectedIndex.current = 0
      }
    }
    let timerId

    function debounceFunction(func, delay) {
      clearTimeout(timerId)
      timerId = setTimeout(func, delay)
    }

    function onScroll() {
      debounceFunction(scrollCallback, 10)
    }

    document.addEventListener('scroll', onScroll)
    return () => document.removeEventListener('scroll', onScroll)
  }, [tableOfContents, editor])

  return (
    <div className="table-of-contents">
      <ul className="headings">
        {tableOfContents.map(([key, text, tag], index) => {
          return (
            <div
              className={`normal-heading-wrapper ${
                selectedKey === key ? 'selected-heading-wrapper' : ''
              }`}
              key={key}
            >
              <div
                onClick={() => scrollToNode(key, index)}
                role="button"
                className={indent(tag)}
                tabIndex={0}
              >
                <li
                  className={`normal-heading ${
                    selectedKey === key ? 'selected-heading' : ''
                  }
                    `}
                >
                  {('' + text).length > 27
                    ? text.substring(0, 27) + '...'
                    : text}
                </li>
              </div>
            </div>
          )
        })}
      </ul>
    </div>
  )
}

export default function TableOfContentsPlugin() {
  return (
    // ledxical TOC auto creating list of all heading nodes
    // [[headingKey, headingTextContent, headingTag], [], [], ...]
    <LexicalTableOfContents>
      {(tableOfContents) => {
        return <TableOfContentsList tableOfContents={tableOfContents} />
      }}
    </LexicalTableOfContents>
  )
}
