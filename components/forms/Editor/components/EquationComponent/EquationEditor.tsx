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
import { Label } from '@/components/ui/label'

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
      <div className="flex flex-col items-center space-y-2">
        <div>
          <Textarea
            onFocus={(e) => {
              e.target.setSelectionRange(
                editorEquation.length + 1,
                editorEquation.length + 1
              )
            }}
            onChange={(event) => {
              setEditorEquation(event.target.value)
            }}
            value={editorEquation}
            className="w-96 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none overflow-auto"
          />
        </div>
        <div className="border rounded-md overflow-x-auto w-96 h-28">
          <KatexRenderer
            equation={editorEquation}
            inline={false}
            className="h-fit w-fit block text-center px-3 py-2 pointer-events-none text-xs"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="inline"
            checked={editorInline}
            onCheckedChange={(checked) =>
              setEditorInline(checked ? true : false)
            }
          />
          <Label htmlFor="inline">Inline</Label>
        </div>
      </div>
      <DialogFooter>
        <DialogClose>Cancel</DialogClose>
        <DialogClose asChild>
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
