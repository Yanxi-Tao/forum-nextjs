import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import * as React from 'react'
import { useCallback, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import KatexRenderer from './KatexRenderer'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

export default function KatexEquationAlterer({
  onConfirm, // callback function for inserting equationNode
  initialEquation = '',
}) {
  const [editor] = useLexicalComposerContext()
  const [equation, setEquation] = useState(initialEquation)
  const [inline, setInline] = useState(true)

  // insert equation on demand
  const onClick = useCallback(() => {
    onConfirm(equation, inline)
  }, [onConfirm, equation, inline])

  const onCheckBoxChange = useCallback(() => {
    setInline(!inline)
  }, [setInline, inline])

  return (
    <>
      <div className="flex flex-row mx-2.5 justify-between">
        <div className="cursor-pointer">
          <label htmlFor="inlineEq">Inline Equation</label>
        </div>
        <Checkbox onChange={onCheckBoxChange} checked={inline} id="inlineEq" />
      </div>
      <div className="flex flex-row mx-2.5 justify-between">Equation </div>
      <div className="flex flex-row mx-2.5 justify-center">
        {inline ? (
          <Input
            onChange={(event) => setEquation(event.target.value)}
            value={equation}
          />
        ) : (
          <Textarea
            onChange={(event) => setEquation(event.target.value)}
            value={equation}
            className="resize-none p-2"
          />
        )}
      </div>
      <div>Visualization</div>
      <div>
        <ErrorBoundary onError={(e) => editor._onError(e)} fallback={null}>
          <KatexRenderer
            equation={equation}
            inline={false}
            onDoubleClick={() => null}
          />
        </ErrorBoundary>
      </div>
      <div className="flex justify-end flex-row mx-2.5 ">
        <Button onClick={onClick}>Confirm</Button>
      </div>
    </>
  )
}
