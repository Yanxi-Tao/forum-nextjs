import katex from 'katex'
import * as React from 'react'
import { useEffect, useRef, forwardRef } from 'react'

// katex renderer component
const KatexRenderer = forwardRef(function RenderEquation(
  { equation, className, ...props },
  ref
) {
  const katexElementRef = useRef(null)

  useEffect(() => {
    const katexElement = katexElementRef.current
    if (katexElementRef !== null) {
      katex.render(equation, katexElement, {
        errorColor: '#cc0000',
        output: 'html',
        strict: 'warn',
        throwOnError: false,
        trust: false,
      })
    }
  }, [equation])

  return (
    <span ref={ref} {...props} className="inline-block h-fit">
      <img src="#" alt="" />
      <span role="button" ref={katexElementRef} className={className} />
      <img src="#" alt="" />
    </span>
  )
})

export default KatexRenderer
