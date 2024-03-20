import { CircleAlert, CircleCheck } from 'lucide-react'

export type FormAlertProps = {
  message: string | null
  type: string | null
}

export const FormAlert = ({ message, type }: FormAlertProps) => {
  if (!message || !type) return null

  return (
    <>
      {type === 'success' ? (
        <div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-emerald-500">
          <CircleCheck size={20} />
          <p>{message}</p>
        </div>
      ) : (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-destructive">
          <CircleAlert size={20} />
          <p>{message}</p>
        </div>
      )}
    </>
  )
}
