import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Toggle } from '@/components/ui/toggle'
import {
  $createCodeNode,
  $isCodeNode,
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  CODE_LANGUAGE_MAP,
  getLanguageFriendlyName,
} from '@lexical/code'
import { $generateHtmlFromNodes } from '@lexical/html'
import { $isLinkNode } from '@lexical/link'
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from '@lexical/list'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from '@lexical/rich-text'
import { $setBlocksType } from '@lexical/selection'
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils'
import {
  $createParagraphNode,
  $getNodeByKey,
  $getRoot,
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
import { useCallback, useEffect, useMemo, useState } from 'react'
import { InsertEquationDialog } from '../EquationsPlugin'
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode'
import { InsertImageDialog } from '../ImagesPlugin'
import { InsertLinkDialog } from '../FloatingLinkToolbarPlugin'

type BlockTypeToBlockNameType = {
  [key: string]: string
  bullet: string
  check: string
  code: string
  h1: string
  h2: string
  h3: string
  h4: string
  h5: string
  h6: string
  number: string
  paragraph: string
  quote: string
}
const blockTypeToBlockName: BlockTypeToBlockNameType = {
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

type FormatFunctionsType = {
  [key: string]: () => void
  bullet: () => void
  code: () => void
  h1: () => void
  h2: () => void
  h3: () => void
  h4: () => void
  h5: () => void
  h6: () => void
  number: () => void
  paragraph: () => void
  quote: () => void
}

function BlockFormatDropdown({
  editor,
  blockType,
}: {
  editor: LexicalEditor
  blockType: string
}): JSX.Element {
  const formatFunctions: FormatFunctionsType = useMemo(() => {
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
        console.log('format function called')
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
    <Select
      value={blockType}
      onValueChange={(value) => {
        formatBlock(value)
      }}
    >
      <SelectTrigger className="w-[180px] focus:ring-0 focus:ring-offset-0">
        <SelectValue>{blockTypeToBlockName[blockType]}</SelectValue>
      </SelectTrigger>
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

function TextFormatToggleGroup({
  editor,
  textFormatToggled,
}: {
  editor: LexicalEditor
  textFormatToggled: textFormatToggledType
}): JSX.Element {
  const { isBold, isItalic, isUnderline, isStrikethrough, isCode } =
    textFormatToggled
  return (
    <div className="flex flex-row space-x-1">
      <Toggle
        pressed={isBold}
        onPressedChange={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
        }}
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        pressed={isItalic}
        onPressedChange={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
        }}
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        pressed={isUnderline}
        onPressedChange={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
        }}
      >
        <Underline className="h-4 w-4" />
      </Toggle>
      <Toggle
        pressed={isStrikethrough}
        onPressedChange={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')
        }}
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>
      <Toggle
        pressed={isCode}
        onPressedChange={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')
        }}
      >
        <Code className="h-4 w-4" />
      </Toggle>
    </div>
  )
}

function CodeLanguageDropdown({
  onCodeLanguageSelect,
  codeLanguage,
  editor,
}: {
  onCodeLanguageSelect: (value: string) => void
  codeLanguage: string
  editor: LexicalEditor
}) {
  return (
    <Select value={codeLanguage} onValueChange={onCodeLanguageSelect}>
      <SelectTrigger className="w-[180px] focus:ring-0 focus:ring-offset-0">
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

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext()

  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)

  const [blockType, setBlockType] = useState('paragraph')
  const [selecterElementKey, setSelecterElementKey] = useState(null)
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

      // returns the highest (in the EditorState tree)
      // non-root ancestor (node) of selected anchorNode
      const element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow()
      const elementKey = element.getKey()
      const elementDOM = editor.getElementByKey(elementKey)

      // update text format
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

      // check if is list, heading, or code node
      if (elementDOM !== null) {
        setSelecterElementKey(elementKey)
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode)
          const type = parentList
            ? parentList.getListType()
            : element.getListType
          setBlockType(type)
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType()

          if (type in blockTypeToBlockName) {
            setBlockType(type)
          }
          if ($isCodeNode(element)) {
            const language = element.getLanguage()
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
        if (selecterElementKey !== null) {
          const node = $getNodeByKey(selecterElementKey)
          if ($isCodeNode(node)) {
            node.setLanguage(value)
          }
        }
      })
    },
    [editor, selecterElementKey]
  )

  return (
    <div className="sticky z-10 top-0 flex flex-row h-16 justify-evenly items-center py-3 bg-background border-b">
      <div className="flex space-x-1">
        <Button
          variant="outline"
          disabled={!canUndo}
          onClick={() => {
            editor.dispatchCommand(UNDO_COMMAND, undefined)
          }}
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          disabled={!canRedo}
          onClick={() => {
            editor.dispatchCommand(REDO_COMMAND, undefined)
          }}
        >
          <Redo2 className="h-4 w-4" />
        </Button>
        {/* <Button
        onClick={() => {
          editor.setEditable(!isEditable)
        }}
      >
        ToggleMode
      </Button> */}
        <Button
          onClick={() => {
            const editorState = editor.getEditorState()
            // const json = editorState.toJSON()
            editor.getEditorState().read(() => {
              const root = $getRoot()
              console.log(
                root
                  .getTextContent()
                  .replace(/[\n\r]/g, ' ')
                  .slice(0, 100)
              )
              const htmlString = $generateHtmlFromNodes(editor, null)
              console.log(htmlString)
            })

            // console.log(json)
            // const jsonString = JSON.stringify(editorState)
            // console.log(jsonString)
          }}
        >
          Store
        </Button>
      </div>

      <Separator orientation="vertical" />
      {blockType in blockTypeToBlockName && (
        <BlockFormatDropdown editor={editor} blockType={blockType} />
      )}
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
          <Separator orientation="vertical" className="mx-2" />
          <div>
            <InsertEquationDialog editor={editor} />
            <InsertLinkDialog editor={editor} isLink={isLink} />
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                editor.dispatchCommand(
                  INSERT_HORIZONTAL_RULE_COMMAND,
                  undefined
                )
              }}
            >
              <GitCommitHorizontal className="h-4 w-4" />
            </Button>
            <InsertImageDialog editor={editor} />
          </div>
        </>
      )}
    </div>
  )
}
