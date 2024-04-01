import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export const AvatarCard = ({ source, name }: { source: string | null; name: string }) => {
  const initial = name[0].toLocaleUpperCase()
  return (
    <Avatar className="h-7 w-7">
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
