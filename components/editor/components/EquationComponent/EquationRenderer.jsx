import katex from 'katex'
import * as React from 'react'
import { useEffect, useRef } from 'react'

// katex renderer component
export default function KatexRenderer({ equation, inline }) {
  const katexElementRef = useRef(null)

  // update render content
  useEffect(() => {
    const katexElement = katexElementRef.current

    if (katexElement !== null) {
      katex.render(equation, katexElement, {
        displayMode: !inline,
        errorColor: '#cc0000',
        strict: 'warn',
        throwOnError: false,
        trust: false,
      })
    }
  }, [equation, inline])

  return (
    <>
      <img src="#" alt="" />
      <span role="button" tabIndex={-1} ref={katexElementRef} />
      <img src="#" alt="" />
    </>
  )
}
