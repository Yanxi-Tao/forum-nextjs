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

    // const element = document.createElement('div')
    // element.setAttribute('data-image-test', '123')
    // const child = document.createElement('img')
    // console.log(this.__src)
    // child.setAttribute(
    //   'src',
    //   'data:image/png;base64,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'
    // )
    // element.appendChild(child)
    // return { element }
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
