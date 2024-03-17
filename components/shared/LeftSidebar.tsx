import { ChevronDown, Home } from 'lucide-react'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import { Separator } from '../ui/separator'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion'
import Link from 'next/link'

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

export default function LeftSidebar(): JSX.Element {
  return (
    <div className="sticky top-0 left-0 z-20 h-screen pt-14 w-64 flex flex-col items-center border-r overflow-auto">
      <ScrollArea className="w-full h-full p-5 ">
        <div>
          <Button className="justify-start items-center" variant="ghost">
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

{
  /* <div className="w-full">
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
</Accordion> */
}
