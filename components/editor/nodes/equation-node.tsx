import {
  $applyNodeReplacement,
  DOMConversionFn,
  DOMConversionMap,
  DOMExportOutput,
  DecoratorNode,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical'
import dynamic from 'next/dynamic'
import katex from 'katex'

const EquationComponent = dynamic(() =>
  import('@/components/editor/components/equation-component').then(
    (mod) => mod.EquationComponent
  )
)

export type EquationPayload = {
  equation: string
  inline: boolean
}

export type SerializedEquationNode = Spread<
  {
    equation: string
    inline: boolean
  },
  SerializedLexicalNode
>

export class EquationNode extends DecoratorNode<JSX.Element> {
  __equation: string
  __inline: boolean

  constructor(equation: string, inline = true, key?: NodeKey) {
    super(key)
    this.__equation = equation
    this.__inline = inline
  }

  static getType(): string {
    return 'equation'
  }

  static clone(node: EquationNode): EquationNode {
    return new EquationNode(node.__equation, node.__inline, node.__key)
  }

  createDOM(
    _config: EditorConfig,
    _editor: LexicalEditor
  ): HTMLElement | HTMLSpanElement {
    const element = document.createElement(this.__inline ? 'span' : 'div')
    element.className = 'editor-equation'
    return element
  }

  exportDOM(editor: LexicalEditor): DOMExportOutput {
    const element = document.createElement(this.__inline ? 'span' : 'div')
    const euqation = btoa(this.__equation)
    element.className = 'editor-equation'
    element.setAttribute('data-lexical-equation', euqation)
    element.setAttribute(
      'data-lexical-inline',
      this.__inline ? 'true' : 'false'
    )
    katex.render(this.__equation, element, {
      displayMode: !this.__inline,
      errorColor: '#cc0000',
      output: 'html',
      throwOnError: false,
      strict: 'warn',
      trust: false,
    })
    return { element }
  }

  static importDOM(): DOMConversionMap | null {
    return {
      div: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute('data-lexical-equation')) {
          return null
        }
        return {
          conversion: convertEquationNode,
          priority: 2,
        }
      },
      span: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute('data-lexical-equation')) {
          return null
        }
        return {
          conversion: convertEquationNode,
          priority: 1,
        }
      },
    }
  }

  updateDOM(
    _prevNode: EquationNode,
    _dom: HTMLElement,
    _config: EditorConfig
  ): boolean {
    return this.__inline !== _prevNode.__inline
  }

  exportJSON(): SerializedEquationNode {
    return {
      equation: this.__equation,
      inline: this.__inline,
      type: 'equation',
      version: 1,
    }
  }

  static importJSON(serializedNode: SerializedEquationNode): EquationNode {
    const node = $createEquationNode(
      serializedNode.equation,
      serializedNode.inline
    )
    return node
  }

  getTextContent(): string {
    return this.__equation
  }

  getEquation(): string {
    return this.__equation
  }

  setEquation(equation: string): void {
    const writable = this.getWritable()
    writable.__equation = equation
  }

  isInline(): boolean {
    return this.__inline
  }

  setInline(inline: boolean): void {
    const writable = this.getWritable()
    writable.__inline = inline
  }

  decorate(editor: LexicalEditor, config: EditorConfig): JSX.Element {
    return (
      <EquationComponent
        equation={this.__equation}
        inline={this.__inline}
        nodeKey={this.__key}
      />
    )
  }
}

const convertEquationNode: DOMConversionFn = (domNode) => {
  const equation = atob(domNode.getAttribute('data-lexical-equation') || '')
  const inline = domNode.getAttribute('data-lexical-inline') === 'true'
  if (!equation) {
    return null
  }
  const node = $createEquationNode(equation, inline)
  return { node }
}

export const $createEquationNode = (
  equation = '',
  inline = true
): EquationNode => {
  const node = new EquationNode(equation, inline)
  return $applyNodeReplacement(node)
}

export const $isEquationNode = (
  node: LexicalNode | null | undefined
): node is EquationNode => {
  return node instanceof EquationNode
}
