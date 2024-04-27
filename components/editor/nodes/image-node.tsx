import {
  $applyNodeReplacement,
  DOMConversionFn,
  DOMConversionMap,
  DOMExportOutput,
  DecoratorNode,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  SerializedLexicalNode,
  Spread,
} from 'lexical'
import { ImageComponent } from '../components/image-component'
import { Suspense, createElement } from 'react'
import { Image } from '@radix-ui/react-avatar'

export type SerializedImageNode = Spread<
  {
    src: string
  },
  SerializedLexicalNode
>

export type ImagePayload = {
  src: string
}

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string

  constructor(src: string, key?: string) {
    super(key)
    this.__src = src
  }

  static getType(): string {
    return 'image'
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__key)
  }

  createDOM(_config: EditorConfig, _editor: LexicalEditor): HTMLElement {
    const element = document.createElement('div')
    return element
  }

  exportDOM(editor: LexicalEditor): DOMExportOutput {
    const element = document.createElement('div')
    element.className = 'editor-image'
    const img = document.createElement('img')
    img.setAttribute('src', this.__src)
    img.setAttribute('alt', 'feed-image')
    element.appendChild(img)
    return { element }
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: (domNode: HTMLElement) => ({
        conversion: convertImageNode,
        priority: 0,
      }),
    }
  }

  updateDOM(): false {
    return false
  }

  exportJSON(): SerializedImageNode {
    return {
      src: this.__src,
      type: 'image',
      version: 1,
    }
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const node = $createImageNode(serializedNode.src)
    return node
  }

  getTextContent(): string {
    return 'Feed Image'
  }

  getSrc(): string {
    const self = this.getLatest()
    return self.__src
  }

  isInline(): boolean {
    return false
  }

  decorate(editor: LexicalEditor, config: EditorConfig): JSX.Element {
    return <ImageComponent src={this.__src} nodeKey={this.getKey()} />
  }
}

const convertImageNode: DOMConversionFn = (domNode) => {
  const img = domNode as HTMLImageElement
  if (!img.src) return null
  const node = $createImageNode(img.src)
  return { node }
}

export const $createImageNode = (src: string): ImageNode => {
  const node = new ImageNode(src)
  return $applyNodeReplacement(node)
}

export const $isImageNode = (
  node: LexicalNode | null | undefined
): node is ImageNode => node instanceof ImageNode
