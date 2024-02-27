import katex from 'katex'
import * as React from 'react'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

// katex renderer component
export default function KatexRenderer({ equation, inline, className }) {
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
      <span
        role="button"
        tabIndex={-1}
        ref={katexElementRef}
        className={cn(className)}
      />
      <img src="#" alt="" />
    </>
  )
}
