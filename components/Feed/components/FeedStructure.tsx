import Link from 'next/link'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Toggle } from '@/components/ui/toggle'

import { ArrowUp, ArrowDown } from 'lucide-react'

import * as React from 'react'
import { forwardRef } from 'react'
import { on } from 'events'
import { Button } from '@/components/ui/button'

type FeedProps = React.ComponentProps<typeof Card> & {
  title: string
  description: string
  titleURL: string
}

const FeedRoot = forwardRef<React.ElementRef<typeof Card>, FeedProps>(
  ({ children, title, titleURL, description }, ref) => {
    return (
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>
            <Link href={titleURL}>{title}</Link>
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        {children}
      </Card>
    )
  }
)

FeedRoot.displayName = 'FeedRoot'

type FeedContentProps = React.ComponentProps<typeof Collapsible> & {
  content: string
  preview: string
}

const FeedContent = forwardRef<
  React.ElementRef<typeof Collapsible>,
  FeedContentProps
>(({ content, preview, open, onOpenChange }, ref) => {
  return (
    <CardContent>
      <Collapsible open={open} onOpenChange={onOpenChange}>
        {open ? null : <CollapsibleTrigger>{preview}</CollapsibleTrigger>}
        <CollapsibleContent>
          <div
            className="editor"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </CollapsibleContent>
      </Collapsible>
    </CardContent>
  )
})

FeedContent.displayName = 'FeedContent'

type FeedToolbarProps = React.ComponentProps<typeof CardFooter> & {
  isAuthor: boolean
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const FeedToolbar = forwardRef<
  React.ElementRef<typeof CardFooter>,
  FeedToolbarProps
>(({ isAuthor, open, setOpen }, ref) => {
  return (
    <CardFooter>
      <Toggle>
        <ArrowUp className="h-4 w-4" />
      </Toggle>
      <Toggle>
        <ArrowDown className="h-4 w-4" />
      </Toggle>
      <Button onClick={() => setOpen(!open)}>Close</Button>
    </CardFooter>
  )
})

FeedToolbar.displayName = 'FeedToolbar'

export { FeedRoot, FeedContent, FeedToolbar }
