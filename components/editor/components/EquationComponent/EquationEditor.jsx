import * as React from 'react'
import { useEffect, useState } from 'react'
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import KatexRenderer from './EquationRenderer'

// equation editor dialog component (dialog content)
export default function EquationEditor({ equationValue = '', onConfirm }) {
  const [editorEquation, setEditorEquation] = useState(equationValue)
  const [isEmpty, setIsEmpty] = useState(true)

  useEffect(() => {
    editorEquation ? setIsEmpty(false) : setIsEmpty(true)
  }, [editorEquation])

  return (
    <>
      <DialogHeader>
        <DialogTitle>Insert Equatoin</DialogTitle>
        <DialogDescription>Enter TeX Equation</DialogDescription>
      </DialogHeader>
      <div className="flex flex-col items-center space-y-2">
        <div>
          <Textarea
            onFocus={(e) => {
              e.target.setSelectionRange(
                equationValue.length + 1,
                equationValue.length + 1
              )
            }}
            onChange={(event) => setEditorEquation(event.target.value)}
            value={editorEquation}
            className="w-96 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none overflow-auto"
          />
        </div>
        <div className="border rounded-md overflow-x-auto w-96 h-28">
          <KatexRenderer
            equation={editorEquation}
            className="h-fit w-fit block text-center px-3 py-2 pointer-events-none text-xs"
          />
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button>Close</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button
            disabled={isEmpty}
            onClick={() => {
              onConfirm(editorEquation)
            }}
          >
            Confirm
          </Button>
        </DialogClose>
      </DialogFooter>
    </>
  )
}
