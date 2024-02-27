import * as React from 'react'
import { useCallback, useState } from 'react'
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
  equationValue = '',
  inlineValue = true,
  onConfirm,
}) {
  const [editorEquation, setEditorEquation] = useState(equationValue)
  const [editorInline, setEditorInline] = useState(inlineValue)

  // dialog content
  // shows when equation node is clicked/inserted
  // allows editing/setting equation node
  return (
    <>
      <DialogHeader>
        <DialogTitle>Insert Equatoin</DialogTitle>
        <DialogDescription>Enter TeX Equation</DialogDescription>
      </DialogHeader>
      <div className="flex flex-col items-center space-y-2">
        <div>
          <Textarea
            onChange={(event) => setEditorEquation(event.target.value)}
            value={editorEquation}
            className="w-96 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none overflow-auto"
          />
        </div>
        <div className="border rounded-md overflow-x-auto w-96 h-28">
          <KatexRenderer
            equation={editorEquation}
            inline={inlineValue}
            className="h-fit w-fit block text-center px-3 py-2 pointer-events-none text-xs"
          />
        </div>
      </div>
      <DialogFooter>
        <div className="flex items-center space-x-2 mr-6">
          <Checkbox
            id="inline"
            checked={editorInline}
            onCheckedChange={setEditorInline}
          />
          <label
            htmlFor="inline"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Inline
          </label>
        </div>
        <DialogClose asChild>
          <Button>Close</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button
            onClick={() => {
              onConfirm(editorEquation, editorInline)
            }}
          >
            Confirm
          </Button>
        </DialogClose>
      </DialogFooter>
    </>
  )
}
