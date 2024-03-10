import dynamic from 'next/dynamic'

import {
  DecoratorBlockNode,
  SerializedDecoratorBlockNode,
} from '@lexical/react/LexicalDecoratorBlockNode'
import {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  ElementFormatType,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  Spread,
} from 'lexical'
import ImageComponent from '../components/ImageComponent'

export type ImagePayload = {
  src: string
  altText: string
}

export type SerializedImageNode = Spread<
  { src: string; altText: string },
  SerializedDecoratorBlockNode
>

function convertImageElement(domNode: Node): null | DOMConversionOutput {
  if (domNode instanceof HTMLDivElement) {
    const img = domNode.firstElementChild as HTMLImageElement
    const { src, alt: altText } = img
    const node = $createImageNode({ src, altText })
    return { node }
  }
  return null
}

export class ImageNode extends DecoratorBlockNode {
  __src: string
  __altText: string

  static getType(): string {
    return 'image'
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__altText, node.__format, node.__key)
  }

  constructor(
    src: string,
    alt: string,
    format?: ElementFormatType,
    key?: NodeKey
  ) {
    super(format, key)
    this.__src = src
    this.__altText = alt
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { src, altText } = serializedNode
    const node = $createImageNode({ src, altText })
    return node
  }

  exportJSON(): SerializedImageNode {
    return {
      ...super.exportJSON(),
      src: this.__src,
      altText: this.__altText,
      type: 'image',
      version: 1,
    }
  }

  static importDOM(): DOMConversionMap | null {
    return {
      div: (domNode: HTMLElement) => {
        if (domNode.className !== 'editor-image') {
          return null
        }
        return {
          conversion: convertImageElement,
          priority: 2,
        }
      },
    }
  }

  exportDOM(editor: LexicalEditor): DOMExportOutput {
    const element = document.createElement('div')
    element.className = 'editor-image'
    const img = document.createElement('img')
    img.src = this.__src
    img.alt = this.__altText
    element.appendChild(img)
    return { element }
  }

  getSrc(): string {
    return this.__src
  }

  getAltText(): string {
    return this.__altText
  }

  decorate(editor: LexicalEditor, config: EditorConfig): JSX.Element {
    const embedBlockTheme = config.theme.embedBlock || {}
    const className = {
      base: embedBlockTheme.base || '',
      focus: embedBlockTheme.focus || '',
    }

    return (
      <ImageComponent
        className={className}
        format={this.__format}
        nodeKey={this.__key}
        src={this.__src}
        altText={this.__altText}
      />
    )
  }
}

export function $createImageNode({
  src,
  altText,
}: {
  src: string
  altText: string
}): ImageNode {
  return new ImageNode(src, altText)
}

export function $isImageNode(
  node: ImageNode | LexicalNode | null | undefined
): node is ImageNode {
  return node instanceof ImageNode
}
