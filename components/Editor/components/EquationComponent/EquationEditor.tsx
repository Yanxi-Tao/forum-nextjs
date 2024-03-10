import { Button } from '@/components/ui/button'
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { useEffect, useState } from 'react'
import KatexRenderer from './KatexRenderer'
import { Checkbox } from '@/components/ui/checkbox'

export default function EquationEditor({
  equation,
  inline,
  onConfirm,
}: {
  equation: string
  inline: boolean
  onConfirm: (updatedEquation: string, updatedInline: boolean) => void
}) {
  const [editorEquation, setEditorEquation] = useState(equation)
  const [editorInline, setEditorInline] = useState(inline)
  const [isEmpty, setIsEmpty] = useState(true)

  useEffect(() => {
    editorEquation === '' ? setIsEmpty(true) : setIsEmpty(false)
  }, [editorEquation])

  return (
    <>
      <DialogHeader>
        <DialogTitle>Equation Editor</DialogTitle>
        <DialogDescription>Enter Tex Equation</DialogDescription>
      </DialogHeader>
      <div>
        <div>
          <Textarea
            onChange={(event) => {
              setEditorEquation(event.target.value)
            }}
            value={editorEquation}
            className="w-96 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none overflow-auto"
          />
        </div>
        <div>
          <KatexRenderer equation={editorEquation} inline={false} />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="inline"
            checked={editorInline}
            onCheckedChange={(checked) =>
              setEditorInline(checked ? true : false)
            }
          />
          <label
            htmlFor="inline"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Inline
          </label>
        </div>
      </div>
      <DialogFooter>
        <DialogClose>Cancel</DialogClose>
        <DialogClose>
          <Button
            disabled={isEmpty}
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
