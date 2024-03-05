import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  $getNodeByKey,
  COMMAND_PRIORITY_LOW,
} from 'lexical'

import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode,
} from '@lexical/list'
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from '@lexical/rich-text'

import {
  $createCodeNode,
  $isCodeNode,
  getDefaultCodeLanguage,
  getCodeLanguages,
  CODE_LANGUAGE_MAP,
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  getLanguageFriendlyName,
} from '@lexical/code'
import { $setBlocksType } from '@lexical/selection'
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode'
import { useCallback, useEffect, useState, useMemo } from 'react'
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils'

import {
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  GitCommitHorizontal,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Toggle } from '@/components/ui/toggle'

import { InsertEquationDialog } from '../EquationsPlugin'
import { InsertLinkDialog } from '../FloatingLinkEditorPlugin'
import { InsertImageDialog } from '../ImagesPlugin'
import useLexicalEditable from '@lexical/react/useLexicalEditable'
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'
import { sanitizeUrl } from '@/lib/utils/editor/url'

const blockTypeToBlockName = {
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

function getCodeLanguageOptions() {
  const options = []
  for (const [lang, friendlyName] of Object.entries(
    CODE_LANGUAGE_FRIENDLY_NAME_MAP
  )) {
    options.push([lang, friendlyName])
  }
  return options
}

// code lang to friendly code lang 2D array
const CODE_LANGUAGE_OPTIONS = getCodeLanguageOptions()

function BlockFormatDropdown({ editor, blockType }) {
  const formatFunctions = useMemo(() => {
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

  const formatBlock = (value) => {
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

function TextFormatToggleGroup({ editor, textFormatToggled }) {
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

function CodeLanguageDropdown({ onCodeLanguageSelect, codeLanguage, editor }) {
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
  const isEditable = useLexicalEditable()

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
    (value) => {
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
    <div className="flex h-10 flex-row justify-evenly items-center my-4">
      <div className="flex space-x-1">
        <Button
          variant="outline"
          disabled={!canUndo}
          onClick={() => {
            editor.dispatchCommand(UNDO_COMMAND)
          }}
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          disabled={!canRedo}
          onClick={() => {
            editor.dispatchCommand(REDO_COMMAND)
          }}
        >
          <Redo2 className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => {
            editor.setEditable(!isEditable)
          }}
        >
          ToggleMode
        </Button>
        <Button
          onClick={() => {
            const editorState = editor.getEditorState()
            const json = editorState.toJSON()
            const jsonString = JSON.stringify(editorState)
            console.log(jsonString)
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
          <InsertEquationDialog editor={editor} />
          <InsertLinkDialog editor={editor} isLink={isLink} />
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)
            }}
          >
            <GitCommitHorizontal className="h-4 w-4" />
          </Button>
          <InsertImageDialog editor={editor} />
        </>
      )}
    </div>
  )
}
