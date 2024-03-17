import dynamic from 'next/dynamic'
import katex from 'katex'
import {
  $applyNodeReplacement,
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  DecoratorNode,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical'

import * as React from 'react'

const EquationComponent = dynamic(
  () => import('../components/EquationComponent')
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

function convertEquationElement(
  domNode: HTMLElement
): null | DOMConversionOutput {
  let equation = domNode.getAttribute('data-equation')
  const inline = domNode.getAttribute('data-inline') === 'true'
  equation = atob(equation || '')
  if (equation) {
    const node = $createEquationNode(equation, inline)
    return { node }
  }

  return null
}

export class EquationNode extends DecoratorNode<JSX.Element> {
  __equation: string
  __inline: boolean

  static getType(): string {
    return 'equation'
  }

  static clone(node: EquationNode): EquationNode {
    return new EquationNode(node.__equation, node.__inline, node.__key)
  }

  constructor(equation: string, inline?: boolean, key?: NodeKey) {
    super(key)
    this.__equation = equation
    this.__inline = inline ?? false
  }

  static importJSON(serializedNode: SerializedEquationNode): EquationNode {
    const node = $createEquationNode(
      serializedNode.equation,
      serializedNode.inline
    )
    return node
  }

  exportJSON(): SerializedEquationNode {
    return {
      equation: this.__equation,
      inline: this.__inline,
      type: 'equation',
      version: 1,
    }
  }

  createDOM(_config: EditorConfig, _editor: LexicalEditor): HTMLElement {
    const element = document.createElement(this.__inline ? 'span' : 'div')
    element.className = 'editor-equation'
    return element
  }

  exportDOM(editor: LexicalEditor): DOMExportOutput {
    const element = document.createElement(this.__inline ? 'span' : 'div')
    const equation = btoa(this.__equation)
    element.setAttribute('data-equation', equation)
    element.setAttribute('data-inline', this.__inline.toString())
    katex.render(this.__equation, element, {
      displayMode: !this.__inline,
      errorColor: '#cc0000',
      output: 'html',
      strict: 'warn',
      throwOnError: false,
      trust: false,
    })
    return { element }
  }

  static importDOM(): DOMConversionMap | null {
    return {
      div: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute('data-equation')) {
          return null
        }
        return {
          conversion: convertEquationElement,
          priority: 2,
        }
      },
      span: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute('data-equation')) {
          return null
        }
        return {
          conversion: convertEquationElement,
          priority: 1,
        }
      },
    }
  }

  updateDOM(prevNode: EquationNode): boolean {
    return this.__inline !== prevNode.__inline
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

  getInline(): boolean {
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

export function $createEquationNode(
  equation = '',
  inline = false
): EquationNode {
  const equationNode = new EquationNode(equation, inline)
  return $applyNodeReplacement(equationNode)
}

export function $isEquationNode(
  node: LexicalNode | null | undefined
): node is EquationNode {
  return node instanceof EquationNode
}
