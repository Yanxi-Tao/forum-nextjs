import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BiSolidUser } from 'react-icons/bi'

export const AvatarCard = ({
  source,
  name,
  className,
}: {
  source: string | null
  name: string
  className?: string
}) => {
  const initial = name[0].toUpperCase()
  return (
    <Avatar className={className}>
      {source ? (
        <>
          <AvatarImage
            src={source}
            alt="profile pic"
            className="rounded-full border"
          />
          <AvatarFallback className="border">{initial}</AvatarFallback>
        </>
      ) : name === '[deleted]' ? (
        <AvatarFallback className="border">
          <BiSolidUser />
        </AvatarFallback>
      ) : (
        <AvatarFallback className="border border-background">
          {initial}
        </AvatarFallback>
      )}
    </Avatar>
  )
}
