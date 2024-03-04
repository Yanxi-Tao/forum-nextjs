import katex from 'katex'
import { $applyNodeReplacement, DecoratorNode } from 'lexical'

import * as React from 'react'
import dynamic from 'next/dynamic'

const EquationComponent = dynamic(() =>
  import('../components/EquationComponent')
)

// equation data stored in data attribute when exported
// when import must convert back
function convertEquationElement(domNode) {
  let equation = domNode.getAttribute('data-lexical-equation')
  const inline = domNode.getAttribute('data-lexical-inline') === 'true'

  // decode the equation from base64
  equation = atob(equation || '')
  if (equation) {
    const node = $createEquationNode(equation, inline)
    return { node }
  }
}

export class EquationNode extends DecoratorNode {
  __equation
  __inline

  static getType() {
    return 'equation'
  }

  static clone(node) {
    return new EquationNode(node.__equation, node.__inline, node.__key)
  }

  constructor(equation, inline, key) {
    super(key)
    this.__equation = equation
    this.__inline = inline ?? false
  }

  // inverse of exportJSON
  static importJSON(serializedNode) {
    const node = $createEquationNode(
      serializedNode.equation,
      serializedNode.inline
    )
    return node
  }

  // for copy/paste between editor sharing same namespace or
  // for permenant storage
  exportJSON() {
    return {
      equation: this.getEquation(),
      inline: this.getInline(),
      type: 'equation',
      version: 1,
    }
  }

  // Called during the reconciliation process to determine
  // which nodes to insert into the DOM for this Lexical Node
  createDOM(_config) {
    const element = document.createElement(this.__inline ? 'span' : 'div')
    element.className = 'editor-equation'
    return element
  }

  // control how the equation node is represented as HTML
  // primarily used to transfer data between Lexical and non-Lexical editors
  exportDOM() {
    const element = document.createElement(this.__inline ? 'span' : 'div')

    // encode the equation as base64 to avoid issues with special characters
    const equation = btoa(this.__equation)
    element.setAttribute('data-lexical-equation', equation)
    element.setAttribute('data-lexical-inline', `${this.__inline}`)
    katex.render(this.__equation, element, {
      displayMode: !this.__inline,
      errorColor: '#cc0000',
      strict: 'warn',
      throwOnError: false,
      trust: false,
    })

    return { element }
  }

  // control how an HTMLElement is represented in Lexical
  // convert pasted HTML element to equation node
  // inverse of exportDOM()
  static importDOM() {
    return {
      div: (domNode) => {
        if (!domNode.hasAttribute('data-lexical-equation')) {
          return null
        }
        return {
          conversion: convertEquationElement,
          priority: 2,
        }
      },
      span: (domNode) => {
        if (!domNode.hasAttribute('data-lexical-equation')) {
          return null
        }
        return {
          conversion: convertEquationElement,
          priority: 1,
        }
      },
    }
  }

  // If the inline property changes, replace the element
  // with updated element tag name
  // unmount and remount element
  updateDOM(prevNode) {
    return this.__inline !== prevNode.__inline
  }

  getTextContent() {
    return this.__equation
  }

  getEquation() {
    return this.__equation
  }

  getInline() {
    return this.__inline
  }

  setEquation(equation) {
    const writable = this.getWritable()
    writable.__equation = equation
  }

  setInline(inline) {
    const writable = this.getWritable()
    writable.__inline = inline
  }

  decorate() {
    return (
      <EquationComponent
        equation={this.__equation}
        inline={this.__inline}
        nodeKey={this.__key}
      />
    )
  }
}

export function $createEquationNode(equation = '', inline = false) {
  const equationNode = new EquationNode(equation, inline)
  return $applyNodeReplacement(equationNode)
}

export function $isEquationNode(node) {
  return node instanceof EquationNode
}
