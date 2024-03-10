import { ElementFormatType, NodeKey } from 'lexical'
import { BlockWithAlignableContents } from '@lexical/react/LexicalBlockWithAlignableContents'
import Image from 'next/image'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

type ImageComponentProps = Readonly<{
  src: string
  altText: string
  className: Readonly<{
    base: string
    focus: string
  }>
  format: ElementFormatType | null
  nodeKey: NodeKey
}>

export default function ImageComponent({
  src,
  altText,
  className,
  format,
  nodeKey,
}: ImageComponentProps): JSX.Element {
  const [editor] = useLexicalComposerContext()

  return (
    <BlockWithAlignableContents
      className={className}
      format={format}
      nodeKey={nodeKey}
    >
      <Image
        src={src}
        alt={altText}
        fill
        className="object-scale-down object-center"
      />
    </BlockWithAlignableContents>
  )
}
