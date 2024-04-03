import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export const AvatarCard = ({ source, name, className }: { source: string | null; name: string; className?: string }) => {
  const initial = name[0].toUpperCase()
  // const className = size === 'profile' ? 'w-7 h-7 text-sm' : size === 'community' ? 'h-36 w-36 text-3xl' : ''
  return (
    <Avatar className={className}>
      {source ? (
        <>
          <AvatarImage src={source} alt="profile pic" />
          <AvatarFallback className="border">{initial}</AvatarFallback>
        </>
      ) : (
        <AvatarFallback className="border">{initial}</AvatarFallback>
      )}
    </Avatar>
  )
}
