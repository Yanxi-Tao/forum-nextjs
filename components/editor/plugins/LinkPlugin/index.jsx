import { LinkPlugin as LexicalLinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import * as React from 'react'

import { validateUrl } from '@/lib/utils/editor/url'

export default function LinkPlugin() {
  return <LexicalLinkPlugin validateUrl={validateUrl} />
}
