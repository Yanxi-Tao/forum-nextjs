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
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import {
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Flag,
  MessageCircle,
  Star,
} from 'lucide-react'

import * as React from 'react'
import { forwardRef } from 'react'

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
      <div className="flex">
        <ToggleGroup type="single">
          <ToggleGroupItem value="upVote">
            <ArrowUp className="h-5 w-5" />
          </ToggleGroupItem>
          <ToggleGroupItem value="downVote">
            <ArrowDown className="h-5 w-5" />
          </ToggleGroupItem>
        </ToggleGroup>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost">
              <MessageCircle className="h-5 w-5 mr-2" />
              Comment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Comment</DialogTitle>
            </DialogHeader>
            <div>some comments</div>
          </DialogContent>
        </Dialog>
        <Button variant="ghost">
          <Star className="h-5 w-5 mr-2" />
          Save
        </Button>
        <Button variant="ghost">
          <Flag className="h-5 w-5 mr-2" />
          Report
        </Button>
      </div>
      {open ? <Button onClick={() => setOpen(!open)}>Close</Button> : null}
    </CardFooter>
  )
})

FeedToolbar.displayName = 'FeedToolbar'

export { FeedRoot, FeedContent, FeedToolbar }
