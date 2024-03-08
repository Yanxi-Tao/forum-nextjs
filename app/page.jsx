'use client'

import * as React from 'react'
import { useRef } from 'react'
import dummy_data from '@/actions/dummy_data'

import { Button } from '@/components/ui/button'

import Editor from '@/components/Editor'
import Feed from '@/components/Feed'

export default function Home() {
  const editorRef = useRef(null)
  return (
    <div className="flex justify-center">
      <Editor editorRef={editorRef} initialContent={dummy_data} />
      {/* <Feed data={dummy_data} /> */}
      {/* <Button onClick={() => editorRef.current.setEditable(false)}>Mode</Button> */}
      {/* <div
        className="editor"
        dangerouslySetInnerHTML={{ __html: dummy_data }}
      /> */}
    </div>
  )
}
