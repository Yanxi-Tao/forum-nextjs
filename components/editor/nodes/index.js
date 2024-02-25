import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { HashtagNode } from '@lexical/hashtag'
import { AutoLinkNode, LinkNode } from '@lexical/link'
import { ListItemNode, ListNode } from '@lexical/list'
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'

import { EquationNode } from './EquationNode'

const Nodes = [
  HeadingNode,
  ListNode,
  ListItemNode,
  QuoteNode,
  CodeNode,
  HashtagNode,
  CodeHighlightNode,
  AutoLinkNode,
  LinkNode,
  EquationNode,
  HorizontalRuleNode,
]

export default Nodes
