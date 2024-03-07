import katex from 'katex'
import { $applyNodeReplacement, DecoratorNode } from 'lexical'

import * as React from 'react'
import dynamic from 'next/dynamic'

const EquationComponent = dynamic(() =>
  import('../components/EquationComponent')
)

function convertEquationElement(domNode) {
  let equation = domNode.getAttribute('data-equation')
  equation = atob(equation || '')
  if (equation) {
    const node = $createEquationNode(equation)
    return { node }
  }
  return null
}

export class EquationNode extends DecoratorNode {
  __equation

  static getType() {
    return 'equation'
  }

  static clone(node) {
    return new EquationNode(node.__equation, node.__key)
  }

  constructor(equation, key) {
    super(key)
    this.__equation = equation
  }

  static importJSON(serializedNode) {
    const node = $createEquationNode(serializedNode.equation)
    return node
  }

  exportJSON() {
    return {
      equation: this.__equation,
      type: 'equation',
      version: 1,
    }
  }

  createDOM(config) {
    const element = document.createElement('span')
    element.className = config.theme.equation
    return element
  }

  exportDOM() {
    const element = document.createElement('span')
    element.className = 'editor-equation'
    const equation = btoa(this.__equation)
    element.setAttribute('data-equation', equation)
    katex.render(this.__equation, element, {
      errorColor: '#cc0000',
      strict: 'warn',
      output: 'html',
      throwOnError: false,
      trust: false,
    })
    return { element }
  }

  static importDOM() {
    return {
      span: (domNode) => {
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

  updateDOM() {
    return false
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
    return <EquationComponent equation={this.__equation} nodeKey={this.__key} />
  }
}

export function $createEquationNode(equation = '') {
  return $applyNodeReplacement(new EquationNode(equation))
}

export function $isEquationNode(node) {
  return node instanceof EquationNode
}
