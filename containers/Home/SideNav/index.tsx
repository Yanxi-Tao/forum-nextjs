import * as React from 'react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const subejects: String[] = [
  'Language',
  'Math',
  'Science',
  'Humanity',
  'Art',
  'Core',
]

const spaces: String[] = [
  'Classroom',
  'Library',
  'Cafeteria',
  'Gym',
  'Lobby',
  'Office',
]

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ChevronDown, Home } from 'lucide-react'
import Link from 'next/link'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function SideNav(): JSX.Element {
  return (
    <div className="basis-[18%] sticky top-14 flex flex-col items-center border-r h-[calc(100vh-56px)]">
      <ScrollArea className="w-full h-full p-5 ">
        <div className="w-full">
          <Button className="w-full justify-start items-center" variant="ghost">
            <Home className="h-full mx-4" />
            <span>Home</span>
          </Button>
        </div>
        <Separator className="my-4" />
        <Accordion type="multiple" defaultValue={['subjects', 'spaces']}>
          <AccordionItem value="subjects" className="border-0">
            <AccordionTrigger asChild className="hover:no-underline">
              <Button variant="ghost">
                Subjects
                <ChevronDown className="h-4 w-4 transition-transform duration-200" />
              </Button>
            </AccordionTrigger>
            <AccordionContent className="py-0">
              <div className="flex flex-col space-y-2 mt-2">
                {subejects.map((subject) => (
                  <Button
                    key={subject as React.Key}
                    variant="ghost"
                    className="justify-start"
                  >
                    <Link href={`/subject/${subject.toLowerCase()}`}>
                      {subject}
                    </Link>
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <Separator className="my-4" />
          <AccordionItem value="spaces" className="border-0">
            <AccordionTrigger asChild className="hover:no-underline">
              <Button variant="ghost">
                Spaces
                <ChevronDown className="h-4 w-4 transition-transform duration-200" />
              </Button>
            </AccordionTrigger>
            <AccordionContent className="py-0">
              <div className="flex flex-col space-y-2 mt-2">
                {spaces.map((space) => (
                  <Button
                    key={space as React.Key}
                    variant="ghost"
                    className="justify-start"
                  >
                    <Link href={`/spaces/${space.toLowerCase()}`}>{space}</Link>
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>
    </div>
  )
}
