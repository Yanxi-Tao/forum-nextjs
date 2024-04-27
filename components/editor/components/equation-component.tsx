import { $getNodeByKey, NodeKey } from 'lexical'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useCallback, useEffect, useRef, useState } from 'react'
import { $isEquationNode } from '@/components/editor/nodes/equation-node'
import katex from 'katex'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

export type EquationComponentProps = {
  equation: string
  inline: boolean
  nodeKey: NodeKey
}

export type EquationEditorProps = Omit<EquationComponentProps, 'nodeKey'> & {
  onConfirm: (updatedEquation: string, updatedInline: boolean) => void
}

export const EquationComponent: React.FC<EquationComponentProps> = ({
  equation,
  inline,
  nodeKey,
}) => {
  const [editor] = useLexicalComposerContext()

  const onConfirm = useCallback(
    (updatedEquation: string, updatedInline: boolean) => {
      editor.update(() => {
        const node = $getNodeByKey(nodeKey)
        if ($isEquationNode(node)) {
          node.setEquation(updatedEquation)
          node.setInline(updatedInline)
        }
      })
    },
    [editor, nodeKey]
  )

  return (
    <Dialog>
      <DialogTrigger className="max-w-full" asChild>
        <Button variant="ghost" className="flex items-center p-0 px-2">
          <KatexRenderer equation={equation} inline={inline} />
        </Button>
      </DialogTrigger>
      <EquationEditor
        equation={equation}
        inline={inline}
        onConfirm={onConfirm}
      />
    </Dialog>
  )
}

export const EquationEditor: React.FC<EquationEditorProps> = ({
  equation,
  inline,
  onConfirm,
}) => {
  const [editor] = useLexicalComposerContext()
  const [editorEquation, setEditorEquation] = useState(equation)
  const [editorInline, setEditorInline] = useState(inline)

  return (
    <DialogContent
      onCloseAutoFocus={() => {
        editor.focus()
      }}
      className="flex flex-col items-center space-y-3"
    >
      <DialogHeader className="w-full justify-start">
        <DialogTitle>Equation Editor</DialogTitle>
        <DialogDescription>Supprts LaTeX syntax</DialogDescription>
      </DialogHeader>
      <div className="flex flex-col items-center justify-center space-y-3 w-[450px]">
        <Textarea
          value={editorEquation}
          onChange={(event) => setEditorEquation(event.target.value)}
          onFocus={(e) => {
            e.target.setSelectionRange(
              editorEquation.length + 1,
              editorEquation.length + 1
            )
          }}
        />
        <KatexRenderer equation={editorEquation} inline={editorInline} />
        <div className="flex items-center space-x-2">
          <Checkbox
            id="inline"
            checked={editorInline}
            onCheckedChange={(checked) =>
              setEditorInline(checked ? true : false)
            }
          />
          <label htmlFor="inline">Inline</label>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button
            disabled={editorEquation.length === 0}
            onClick={() => {
              onConfirm(editorEquation, editorInline)
            }}
          >
            Confirm
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}

export const KatexRenderer: React.FC<{ equation: string; inline: boolean }> = ({
  equation,
  inline,
}) => {
  const katexRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const katexElement = katexRef.current
    if (katexElement !== null) {
      katex.render(equation, katexElement, {
        displayMode: !inline,
        errorColor: '#cc0000',
        output: 'html',
        throwOnError: false,
        strict: 'warn',
        trust: false,
      })
    }
  }, [equation, inline])

  return <span ref={katexRef} className="w-full" />
}
