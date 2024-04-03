import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export const AvatarCard = ({ source, name, size }: { source: string | null; name: string; size: 'profile' | 'community' }) => {
  const initial = name[0].toLocaleUpperCase()
  const className = size === 'profile' ? 'w-7 h-7' : size === 'community' ? 'w-14 h-14' : ''
  return (
    <Avatar className={className}>
      {source ? (
        <>
          <AvatarImage src={source} alt="profile pic" />
          <AvatarFallback className="border">{initial}</AvatarFallback>
        </>
      ) : (
        <AvatarFallback className="border text-xs">{initial}</AvatarFallback>
      )}
    </Avatar>
  )
}
