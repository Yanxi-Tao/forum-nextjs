import dynamic from 'next/dynamic'

import { DecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode'
import { $applyNodeReplacement } from 'lexical'
import * as React from 'react'

const ImageComponent = dynamic(() => import('../components/ImageComponent'))

function convertImageElement(domNode) {
  if (domNode instanceof HTMLDivElement) {
    const img = domNode.firstElementChild
    const { src, alt: altText, width, height } = img
    const node = $createImageNode({ src, altText, width, height })
    return { node }
  }
  return null
}

export class ImageNode extends DecoratorBlockNode {
  __src
  __altText
  __width
  __height

  static getType() {
    return 'image'
  }

  static clone(node) {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__width,
      node.__height,
      node.__format,
      node.__key
    )
  }

  constructor(src, altText, width, height, format, key) {
    super(format, key)
    this.__src = src
    this.__altText = altText
    this.__width = width
    this.__height = height
  }

  static importJSON(serializedNode) {
    const { src, altText, width, height } = serializedNode
    const node = $createImageNode(src, altText, width, height)
    node.setFormat(serializedNode.format)
    return node
  }

  exportJSON() {
    return {
      src: this.__src,
      altText: this.__altText,
      width: this.__width,
      height: this.__height,
      type: 'image',
      version: 1,
    }
  }

  static importDOM() {
    return {
      div: (domNode) => {
        if (domNode.className !== 'editor-image-base') {
          return null
        }
        return {
          conversion: convertImageElement,
          priority: 2,
        }
      },
    }
  }

  exportDOM() {
    const element = document.createElement('div')
    element.className = 'editor-image-base'
    const img = document.createElement('img')
    img.setAttribute('alt', this.__altText)
    img.setAttribute('src', this.__src)
    img.setAttribute('width', this.__width.toString())
    img.setAttribute('height', this.__height.toString())
    element.appendChild(img)
    return { element }
  }

  decorate(_editor, config) {
    const imageTheme = config.theme.image || {}
    const className = {
      base: imageTheme.base || '',
      focus: imageTheme.focus || '',
    }
    return (
      <ImageComponent
        src={this.__src}
        altText={this.__altText}
        width={this.__width}
        height={this.__height}
        className={className}
        format={this.__format}
        nodeKey={this.__key}
      />
    )
  }
}

export function $createImageNode({ src, altText, width, height }) {
  return new ImageNode(src, altText, width, height)
}

export function $isImageNode(node) {
  return node instanceof ImageNode
}
