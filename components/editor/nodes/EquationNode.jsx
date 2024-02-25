import katex from 'katex'
import { $applyNodeReplacement, DecoratorNode } from 'lexical'
import * as React from 'react'
import dynamic from 'next/dynamic'

const EquationComponent = dynamic(() => import('./EquationComponent'), {
  loading: () => null,
})

function convertEquationElement(domNode) {
  let equation = domNode.getAttribute('data-lexical-equation')
  const inline = domNode.getAttribute('data-lexical-inline') === 'true'
  // Decode the equation from base64
  equation = atob(equation || '')
  if (equation) {
    const node = $createEquationNode(equation, inline)
    return { node }
  }

  return null
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

  static importJSON(serializedNode) {
    const node = $createEquationNode(
      serializedNode.equation,
      serializedNode.inline
    )
    return node
  }

  exportJSON() {
    return {
      equation: this.getEquation(),
      inline: this.__inline,
      type: 'equation',
      version: 1,
    }
  }

  createDOM(_config) {
    const element = document.createElement(this.__inline ? 'span' : 'div')
    // EquationNodes should implement `user-action:none` in their CSS to avoid issues with deletion on Android.
    element.className = 'editor-equation'
    return element
  }

  exportDOM() {
    const element = document.createElement(this.__inline ? 'span' : 'div')
    // Encode the equation as base64 to avoid issues with special characters
    const equation = btoa(this.__equation)
    element.setAttribute('data-lexical-equation', equation)
    element.setAttribute('data-lexical-inline', `${this.__inline}`)
    katex.render(this.__equation, element, {
      displayMode: !this.__inline, // true === block display //
      errorColor: '#cc0000',
      output: 'html',
      strict: 'warn',
      throwOnError: false,
      trust: false,
    })
    return { element }
  }

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

  updateDOM(prevNode) {
    // If the inline property changes, replace the element
    return this.__inline !== prevNode.__inline
  }

  getTextContent() {
    return this.__equation
  }

  getEquation() {
    return this.__equation
  }

  setEquation(equation) {
    const writable = this.getWritable()
    writable.__equation = equation
  }

  decorate() {
    // equationNode that switches between editting and rendering modes
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
