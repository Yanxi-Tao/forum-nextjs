'use client'

import * as React from 'react'
import { useRef } from 'react'

import { Button } from '@/components/ui/button'

import Editor from '@/components/Editor'
import Feed from '@/components/Feed'

export default function Home() {
  const editorRef = useRef(null)

  return (
    <div>
      <Editor isEditMode={true} editorRef={editorRef} />
      {/* <Feed /> */}
      <Button onClick={() => editorRef.current.setEditable(false)}>Mode</Button>
    </div>
  )
}
