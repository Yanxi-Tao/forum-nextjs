import * as React from 'react'
import { useCallback } from 'react'
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import KatexRenderer from './EquationRenderer'

// equation editor dialog component
export default function EquationEditor({
  equationValue,
  setEquationValue,
  inlineValue,
  setInlineValue,
  onConfirm,
}) {
  const onCheckBoxChange = useCallback(() => {
    setInlineValue(!inlineValue)
  }, [setInlineValue, inlineValue])

  // dialog content
  // shows when equation node is clicked/inserted
  // allows editing/setting equation node
  return (
    <>
      <DialogHeader>
        <DialogTitle>Insert Equatoin</DialogTitle>
        <DialogDescription>Enter TeX Equation</DialogDescription>
      </DialogHeader>
      <div className="flex flex-col items-center">
        <div>
          <Textarea onChange={(event) => setEquationValue(event.target.value)}>
            {equationValue}
          </Textarea>
        </div>
        <div>
          <KatexRenderer equation={equationValue} inline={inlineValue} />
        </div>
      </div>
      <DialogFooter>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="inline"
            checked={inlineValue}
            onChange={onCheckBoxChange}
          />
          <label
            htmlFor="inline"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Inline
          </label>
        </div>
        <DialogClose>
          <Button>Close</Button>
          <Button onClick={onConfirm}>Confirm</Button>
        </DialogClose>
      </DialogFooter>
    </>
  )
}
