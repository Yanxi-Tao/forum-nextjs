import { $isLinkNode } from '@lexical/link'
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from '@lexical/list'
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from '@lexical/rich-text'
import { $setBlocksType } from '@lexical/selection'
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  $createParagraphNode,
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  $createCodeNode,
  $isCodeNode,
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  CODE_LANGUAGE_MAP,
  getLanguageFriendlyName,
} from '@lexical/code'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import {
  Bold,
  Code,
  GitCommitHorizontal,
  Italic,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
} from 'lucide-react'
import { Toggle } from '@/components/ui/toggle'
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode'
import { InsertEquationDialog } from './equation-plugin'
import { Separator } from '@/components/ui/separator'
import { InsertImageDialog } from './image-plugin'

export default function ToolbarPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext()

  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)

  const [blockType, setBlockType] = useState('paragraph')
  const [selectedElementKey, setselectedElementKey] = useState<string | null>(
    null
  )
  const [codeLanguage, setCodeLanguage] = useState('')

  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isStrikethrough, setIsStrikethrough] = useState(false)
  const [isCode, setIsCode] = useState(false)
  const [isLink, setIsLink] = useState(false)

  const updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode()

      const topElement =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow()

      const elementKey = topElement.getKey()
      const elementDOM = editor.getElementByKey(elementKey)

      setIsBold(selection.hasFormat('bold'))
      setIsItalic(selection.hasFormat('italic'))
      setIsUnderline(selection.hasFormat('underline'))
      setIsStrikethrough(selection.hasFormat('strikethrough'))
      setIsCode(selection.hasFormat('code'))

      const maybeLinkNode = selection.anchor.getNode().getParent()
      if ($isLinkNode(maybeLinkNode)) {
        setIsLink(true)
      } else {
        setIsLink(false)
      }

      if (elementDOM !== null) {
        setselectedElementKey(elementKey)
        if ($isListNode(topElement)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode)
          const type = parentList
            ? parentList.getListType()
            : topElement.getListType
          setBlockType(type)
        } else {
          const type = $isHeadingNode(topElement)
            ? topElement.getTag()
            : topElement.getType()

          if (type in blockTypeToBlockName) {
            setBlockType(type)
          }
          if ($isCodeNode(topElement)) {
            const language = topElement.getLanguage()

            setCodeLanguage(
              language ? CODE_LANGUAGE_MAP[language] || language : ''
            )
            return
          }
        }
      }
    }
  }, [editor])

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar()
        })
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (payload) => {
          updateToolbar()
          return false
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload)
          return false
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload)
          return false
        },
        COMMAND_PRIORITY_LOW
      )
    )
  }, [updateToolbar, editor])

  const onCodeLanguageSelect = useCallback(
    (value: string) => {
      editor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey)
          if ($isCodeNode(node)) {
            node.setLanguage(value)
          }
        }
      })
    },
    [editor, selectedElementKey]
  )

  return (
    <div className="sticky h-12 items-center p-2 top-12 z-10 bg-background flex space-x-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined)
        }}
      >
        <Undo2 size={18} />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined)
        }}
      >
        <Redo2 size={18} />
      </Button>
      {blockType in blockTypeToBlockName && (
        <BlockFormatDropdown editor={editor} blockType={blockType} />
      )}
      <Separator orientation="vertical" />
      {blockType === 'code' ? (
        <CodeLanguageDropdown
          onCodeLanguageSelect={onCodeLanguageSelect}
          codeLanguage={codeLanguage}
          editor={editor}
        />
      ) : (
        <>
          <TextFormatToggleGroup
            editor={editor}
            textFormatToggled={{
              isBold,
              isItalic,
              isUnderline,
              isStrikethrough,
              isCode,
            }}
          />
          <Separator orientation="vertical" />
          <InsertEquationDialog editor={editor} />
          <InsertImageDialog editor={editor} />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => {
              editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)
            }}
          >
            <GitCommitHorizontal size={18} />
          </Button>
        </>
      )}
    </div>
  )
}

const blockTypeToBlockName: { [key: string]: string } = {
  bullet: 'Bulleted List',
  check: 'Check List',
  code: 'Code Block',
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
  number: 'Numbered List',
  paragraph: 'Normal',
  quote: 'Quote',
}

const BlockFormatDropdown: React.FC<{
  editor: LexicalEditor
  blockType: string
}> = ({ editor, blockType }) => {
  const formatFunctions: { [key: string]: () => void } = useMemo(() => {
    return {
      bullet: () => {
        if (blockType !== 'bullet') {
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        } else {
          editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
        }
      },
      code: () => {
        if (blockType !== 'code') {
          editor.update(() => {
            let selection = $getSelection()

            if (selection !== null) {
              if (selection.isCollapsed()) {
                $setBlocksType(selection, () => $createCodeNode())
              } else {
                const textContent = selection.getTextContent()
                const codeNode = $createCodeNode()
                selection.insertNodes([codeNode])
                selection = $getSelection()
                if ($isRangeSelection(selection))
                  selection.insertRawText(textContent)
              }
            }
          })
        }
      },
      h1: () => {
        if (blockType !== 'h1') {
          editor.update(() => {
            const selection = $getSelection()
            $setBlocksType(selection, () => $createHeadingNode('h1'))
          })
        }
      },
      h2: () => {
        if (blockType !== 'h2') {
          editor.update(() => {
            const selection = $getSelection()
            $setBlocksType(selection, () => $createHeadingNode('h2'))
          })
        }
      },
      h3: () => {
        if (blockType !== 'h3') {
          editor.update(() => {
            const selection = $getSelection()
            $setBlocksType(selection, () => $createHeadingNode('h3'))
          })
        }
      },
      h4: () => {
        if (blockType !== 'h4') {
          editor.update(() => {
            const selection = $getSelection()
            $setBlocksType(selection, () => $createHeadingNode('h4'))
          })
        }
      },
      h5: () => {
        if (blockType !== 'h5') {
          editor.update(() => {
            const selection = $getSelection()
            $setBlocksType(selection, () => $createHeadingNode('h5'))
          })
        }
      },
      h6: () => {
        if (blockType !== 'h6') {
          editor.update(() => {
            const selection = $getSelection()
            $setBlocksType(selection, () => $createHeadingNode('h6'))
          })
        }
      },
      number: () => {
        if (blockType !== 'number') {
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        } else {
          editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
        }
      },
      paragraph: () => {
        editor.update(() => {
          const selection = $getSelection()
          $setBlocksType(selection, () => $createParagraphNode())
        })
      },
      quote: () => {
        if (blockType !== 'quote') {
          editor.update(() => {
            const selection = $getSelection()
            $setBlocksType(selection, () => $createQuoteNode())
          })
        }
      },
    }
  }, [blockType, editor])
  const formatBlock = (value: string) => {
    formatFunctions[value]()
  }

  return (
    <TooltipProvider delayDuration={500}>
      <Tooltip>
        <Select
          value={blockType}
          onValueChange={(value) => {
            formatBlock(value)
          }}
        >
          <TooltipTrigger asChild>
            <SelectTrigger className="w-36 focus:ring-0 focus:ring-offset-0 border-none hover:bg-accent hover:text-accent-foreground">
              <SelectValue>{blockTypeToBlockName[blockType]}</SelectValue>
            </SelectTrigger>
          </TooltipTrigger>
          <SelectContent
            onCloseAutoFocus={() => {
              editor.focus()
            }}
          >
            <SelectItem value="paragraph">Normal</SelectItem>
            <SelectItem value="h1">Heading 1</SelectItem>
            <SelectItem value="h2">Heading 2</SelectItem>
            <SelectItem value="h3">Heading 3</SelectItem>
            <SelectItem value="bullet">Bulleted List</SelectItem>
            <SelectItem value="number">Numbered List</SelectItem>
            <SelectItem value="quote">Quote</SelectItem>
            <SelectItem value="code">Code Block</SelectItem>
          </SelectContent>
        </Select>
        <TooltipContent>Block Format</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

type textFormatToggledType = {
  [key: string]: boolean
  isBold: boolean
  isItalic: boolean
  isUnderline: boolean
  isStrikethrough: boolean
  isCode: boolean
}

const TextFormatToggleGroup: React.FC<{
  editor: LexicalEditor
  textFormatToggled: textFormatToggledType
}> = ({ editor, textFormatToggled }) => {
  const { isBold, isItalic, isUnderline, isStrikethrough, isCode } =
    textFormatToggled
  return (
    <div className="flex flex-row space-x-1">
      <TooltipProvider delayDuration={500}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              title="Bold"
              pressed={isBold}
              onPressedChange={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
              }}
              className={isBold ? 'bg-accent' : ''}
            >
              <Bold size={18} />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Bold</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              title="Italic"
              pressed={isItalic}
              onPressedChange={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
              }}
              className={isItalic ? 'bg-accent' : ''}
            >
              <Italic size={18} />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Italic</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              title="Underline"
              pressed={isUnderline}
              onPressedChange={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
              }}
              className={isUnderline ? 'bg-accent' : ''}
            >
              <Underline size={18} />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Underline</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              title="Strikethrough"
              pressed={isStrikethrough}
              onPressedChange={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')
              }}
              className={isStrikethrough ? 'bg-accent' : ''}
            >
              <Strikethrough size={18} />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Strikethrough</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              title="Inline Code"
              pressed={isCode}
              onPressedChange={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')
              }}
              className={isCode ? 'bg-accent' : ''}
            >
              <Code size={18} />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>Inline Code</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

function getCodeLanguageOptions(): [string, string][] {
  const options: [string, string][] = []

  for (const [lang, friendlyName] of Object.entries(
    CODE_LANGUAGE_FRIENDLY_NAME_MAP
  )) {
    options.push([lang, friendlyName])
  }
  return options
}

const CODE_LANGUAGE_OPTIONS = getCodeLanguageOptions()

const CodeLanguageDropdown: React.FC<{
  editor: LexicalEditor
  codeLanguage: string
  onCodeLanguageSelect: (value: string) => void
}> = ({ editor, codeLanguage, onCodeLanguageSelect }) => {
  return (
    <Select value={codeLanguage} onValueChange={onCodeLanguageSelect}>
      <SelectTrigger className="w-[180px] focus:ring-0 focus:ring-offset-0 border-none hover:bg-accent hover:text-accent-foreground">
        <SelectValue>{getLanguageFriendlyName(codeLanguage)}</SelectValue>
      </SelectTrigger>
      <SelectContent
        onCloseAutoFocus={() => {
          editor.focus()
        }}
      >
        {CODE_LANGUAGE_OPTIONS.map(([value, name]) => {
          return (
            <SelectItem value={value} key={value}>
              {name}
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
