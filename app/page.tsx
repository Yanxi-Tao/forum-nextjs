'use client'
import * as React from 'react'
import Editor from '@/components/Editor'

import { useRef } from 'react'

export default function Home() {
  const editorRef = useRef(null)
  return (
    <div className="flex justify-center">
      <Editor editorRef={editorRef} initialContent={''} />
    </div>
  )
}

{
  /* <Feed data={dummy_data} />
<Button onClick={() => editorRef.current.setEditable(false)}>Mode</Button>
<div
  className="editor"
  dangerouslySetInnerHTML={{ __html: dummy_data }}
/> */
}
