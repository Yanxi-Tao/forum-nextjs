'use client'

import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { EditorSurface } from './editor-surface'
import EditorNodes from './nodes'
import EditorTheme from './editor-theme'
import './editor-theme.css'

const editorConfig = {
  namespace: 'editor',
  nodes: [...EditorNodes],
  theme: EditorTheme,
  onError(error: Error) {
    throw error
  },
  // editorState: `{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"egregeertgefvbregb","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"ebergbregbr","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"heading","version":1,"tag":"h3"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"erbregbergb","type":"text","version":1},{"detail":0,"format":31,"mode":"normal","style":"","text":"ergbregbregbebergb","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"type":"horizontalrule","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"rgebregbregbreb","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"ergbergbergb","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"equation":"ergbergbregbegb","inline":false,"type":"equation","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"ergbegrbgbregb","type":"text","version":1},{"equation":"werggerwgw","inline":true,"type":"equation","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":"ergbergbergbergbrgeb","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"ergbergbreg","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"quote","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"bergberbreb","type":"code-highlight","version":1}],"direction":"ltr","format":"","indent":0,"type":"code","version":1,"language":"javascript"},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"bergbrebge","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"efbebrgbrg","type":"text","version":1}],"direction":"ltr","format":"","indent":1,"type":"listitem","version":1,"value":1}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":2}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"wegver","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`,
}

export const Editor = () => {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <EditorSurface />
    </LexicalComposer>
  )
}
