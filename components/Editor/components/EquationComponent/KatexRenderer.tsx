import { DialogTriggerProps } from '@radix-ui/react-dialog'
import katex from 'katex'
import * as React from 'react'
import { forwardRef, useRef, useEffect } from 'react'

interface KatexRendererProps extends DialogTriggerProps {
  readonly equation: string
  readonly inline: boolean
  className?: string
}

const KatexRenderer = forwardRef<HTMLSpanElement, KatexRendererProps>(
  ({ equation, inline, className, ...props }, ref) => {
    const katexElementRef = useRef(null)

    useEffect(() => {
      const katexElement = katexElementRef.current
      if (katexElement !== null) {
        katex.render(equation, katexElement, {
          displayMode: !inline,
          errorColor: '#cc0000',
          output: 'html',
          strict: 'warn',
          throwOnError: false,
          trust: false,
        })
      }
    }, [equation, inline])

    return (
      <span ref={ref} {...props}>
        <img src="#" alt="" />
        <span role="button" ref={katexElementRef} className={className} />
        <img src="#" alt="" />
      </span>
    )
  }
)

KatexRenderer.displayName = 'KatexRenderer'

export default KatexRenderer
