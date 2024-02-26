import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ListItemNode, ListNode } from '@lexical/list'
import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table'

const EditorNodes = [
  HeadingNode,
  QuoteNode,
  ListItemNode,
  ListNode,
  CodeHighlightNode,
  CodeNode,
  TableCellNode,
  TableNode,
  TableRowNode,
]

export default EditorNodes
