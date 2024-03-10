/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  CHECK_LIST,
  ELEMENT_TRANSFORMERS,
  ElementTransformer,
  TEXT_FORMAT_TRANSFORMERS,
  TEXT_MATCH_TRANSFORMERS,
  TextMatchTransformer,
  Transformer,
} from '@lexical/markdown'
import {
  $createHorizontalRuleNode,
  $isHorizontalRuleNode,
  HorizontalRuleNode,
} from '@lexical/react/LexicalHorizontalRuleNode'
import {
  $createTableCellNode,
  $createTableNode,
  $createTableRowNode,
  $isTableCellNode,
  $isTableNode,
  $isTableRowNode,
  TableCellHeaderStates,
  TableCellNode,
  TableNode,
  TableRowNode,
} from '@lexical/table'
import {
  $createTextNode,
  $isParagraphNode,
  $isTextNode,
  LexicalNode,
} from 'lexical'

import {
  $createEquationNode,
  $isEquationNode,
  EquationNode,
} from '../../nodes/EquationNode'
import {
  $createImageNode,
  $isImageNode,
  ImageNode,
} from '../../nodes/ImageNode'

export const EQUATION: TextMatchTransformer = {
  dependencies: [EquationNode],
  export: (node) => {
    if (!$isEquationNode(node)) {
      return null
    }

    return `$${node.getEquation()}$`
  },
  importRegExp: /\$([^$]+?)\$/,
  regExp: /\$([^$]+?)\$$/,
  replace: (textNode, match) => {
    const [, equation] = match
    const equationNode = $createEquationNode(equation, true)
    textNode.replace(equationNode)
  },
  trigger: '$',
  type: 'text-match',
}

export const EDITOR_TRANSFORMERS: Array<Transformer> = [
  EQUATION,
  CHECK_LIST,
  ...ELEMENT_TRANSFORMERS,
  ...TEXT_FORMAT_TRANSFORMERS,
  ...TEXT_MATCH_TRANSFORMERS,
]
