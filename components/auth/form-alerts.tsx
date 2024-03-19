import { TriangleAlert, CircleCheck } from 'lucide-react'

export const FormError = ({ message }: { message?: string }) => {
  if (!message) return null
  return (
    <div className=" bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
      <TriangleAlert className="h-4 w-4" />
      <p>{message}</p>
    </div>
  )
}

export const FormSuccess = ({ message }: { message?: string }) => {
  if (!message) return null
  return (
    <div className=" bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
      <CircleCheck className="h-4 w-4" />
      <p>{message}</p>
    </div>
  )
}
