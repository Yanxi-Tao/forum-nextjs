'use client'

import * as React from 'react'
import { useRef } from 'react'

import { Button } from '@/components/ui/button'

import Editor from '@/components/editor'

export default function Home() {
  const editorRef = useRef(null)

  console.log(editorRef.current)
  return (
    <div>
      <Editor isEditMode={true} editorRef={editorRef} />
      <Button onClick={() => editorRef.current.setEditable(false)}>Mode</Button>
    </div>
  )
}
