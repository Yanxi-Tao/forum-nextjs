import { $applyNodeReplacement } from 'lexical'
import { DecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode'
import * as React from 'react'
import dynamic from 'next/dynamic'

const ImageComponent = dynamic(() => import('../components/ImageComponent'))

function convertImageElement(domNode) {
  if (domNode instanceof HTMLImageElement) {
    const { alt: altText, src, width, height } = domNode
    const node = $createImageNode({ altText, height, src, width })
    return { node }
  }
  return null
}

export class ImageNode extends DecoratorBlockNode {
  __src
  __altText
  __width
  __height
  __showCaption
  __caption

  static getType() {
    return 'image'
  }

  static clone(node) {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__width,
      node.__height,
      node.__showCaption,
      node.__caption,
      node.__format,
      node.__key
    )
  }

  constructor(src, altText, width, height, showCaption, caption, format, key) {
    super(format, key)
    this.__src = src
    this.__altText = altText
    this.__width = width
    this.__height = height
    this.__showCaption = showCaption || false
    this.__caption = caption || ''
  }

  // inverse of exportJSON
  static importJSON(serializedNode) {
    const { altText, height, width, caption, src, showCaption } = serializedNode
    const node = $createImageNode({
      altText,
      height,
      showCaption,
      src,
      width,
      caption,
    })
    node.setFormat(serializedNode.format)
    return node
  }

  // for copy/paste between editor sharing same namespace or
  // for permenant storage
  exportJSON() {
    return {
      ...super.exportJSON(),
      altText: this.getAltText(),
      caption: this.__caption,
      height: this.__height,
      width: this.__width,
      showCaption: this.__showCaption,
      src: this.getSrc(),
      type: 'image',
      version: 1,
    }
  }

  // Called during the reconciliation process to determine
  // which nodes to insert into the DOM for this Lexical Node
  // createDOM(config) {
  //   const element = document.createElement('span')
  //   const className = `${config.theme.image}`
  //   if (className !== undefined) {
  //     element.className = className
  //   }
  //   return element
  // }

  // control how the equation node is represented as HTML
  // primarily used to transfer data between Lexical and non-Lexical editors
  exportDOM() {
    const element = document.createElement('img')
    element.setAttribute('src', this.__src)
    element.setAttribute('alt', this.__altText)
    element.setAttribute('width', this.__width.toString())
    element.setAttribute('height', this.__height.toString())
    return { element }
  }

  // control how an HTMLElement is represented in Lexical
  // convert pasted HTML element to equation node
  // inverse of exportDOM()
  static importDOM() {
    return {
      img: (node) => ({
        conversion: convertImageElement,
        priority: 0,
      }),
    }
  }

  getSrc() {
    return this.__src
  }

  getAltText() {
    return this.__altText
  }

  setAltText(altText) {
    const writable = this.getWritable()
    writable.__altText = altText
  }

  setWidthAndHeight(width, height) {
    const writable = this.getWritable()
    writable.__width = width
    writable.__height = height
  }

  getShowCaption() {
    return this.__showCaption
  }

  setShowCaption(showCaption) {
    const writable = this.getWritable()
    writable.__showCaption = showCaption
  }

  updateDOM() {
    return false
  }

  decorate(_editor, config) {
    const className = {
      base: config.theme.image,
      focus: '',
    }
    return (
      <ImageComponent
        src={this.__src}
        altText={this.__altText}
        width={this.__width}
        height={this.__height}
        nodeKey={this.getKey()}
        format={this.__format}
        showCaption={this.__showCaption}
        className={className}
        caption={this.__caption}
      />
    )
  }
}

export function $createImageNode({
  altText,
  height,
  src,
  width,
  showCaption,
  caption,
  key,
}) {
  return $applyNodeReplacement(
    new ImageNode(src, altText, width, height, showCaption, caption, key)
  )
}

export function $isImageNode(node) {
  return node instanceof ImageNode
}
