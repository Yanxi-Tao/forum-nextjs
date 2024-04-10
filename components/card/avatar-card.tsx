import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export const AvatarCard = ({ source, name, className }: { source: string | null; name: string; className?: string }) => {
  const initial = name[0].toUpperCase()
  return (
    <Avatar className={className}>
      {source ? (
        <>
          <AvatarImage src={source} alt="profile pic" className="rounded-full border" />
          <AvatarFallback className="border">{initial}</AvatarFallback>
        </>
      ) : (
        <AvatarFallback className="border border-background">{initial}</AvatarFallback>
      )}
    </Avatar>
  )
}
