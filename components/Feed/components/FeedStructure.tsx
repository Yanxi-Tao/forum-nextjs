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

import { ChevronDown } from 'lucide-react'

import { ArrowUp, ArrowDown } from 'lucide-react'

import * as React from 'react'
import { forwardRef } from 'react'
import { Button } from '@/components/ui/button'

type FeedProps = React.ComponentProps<typeof Card> & {
  title: string
  description: string
  titleURL: string
}

const FeedRoot = forwardRef<React.ElementRef<typeof Card>, FeedProps>(
  ({ children, title, titleURL, description }, ref) => {
    return (
      <Card className="w-[800px]">
        <CardHeader className="pb-2">
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
    <CardContent className="py-3">
      <Collapsible open={open} onOpenChange={onOpenChange}>
        {open ? null : (
          <CollapsibleTrigger asChild>
            <span role="button" className=" hover:opacity-80">
              {preview}
              <span className=" text-blue-500/80">
                more
                <ChevronDown className="h-4 w-4 inline-block" />
              </span>
            </span>
          </CollapsibleTrigger>
        )}
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
    <CardFooter className="flex justify-between py-2 sticky bottom-0 bg-card rounded-lg">
      <div>
        <Toggle>
          <ArrowUp className="h-4 w-4" />
        </Toggle>
        <Toggle>
          <ArrowDown className="h-4 w-4" />
        </Toggle>
      </div>
      {open ? <Button onClick={() => setOpen(!open)}>Close</Button> : null}
    </CardFooter>
  )
})

FeedToolbar.displayName = 'FeedToolbar'

export { FeedRoot, FeedContent, FeedToolbar }
