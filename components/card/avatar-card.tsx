'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BiSolidUser } from 'react-icons/bi'
import { UploadButton } from '@/lib/utils'
import { useState } from 'react'
import Cliploader from 'react-spinners/ClipLoader'
import { useSession } from 'next-auth/react'
import { useQueryClient } from '@tanstack/react-query'
import { EXPLORE_POSTS_KEY } from '@/lib/constants'
import { useRouter } from 'next/navigation'

export const AvatarCard = ({
  source,
  name,
  className,
  isDeleted = false,
}: {
  source: string | null | undefined
  name: string
  className?: string
  isDeleted?: boolean
}) => {
  const initial = name[0].toUpperCase()
  return (
    <Avatar className={className}>
      {isDeleted ? (
        <AvatarFallback className="border">
          <BiSolidUser />
        </AvatarFallback>
      ) : source ? (
        <>
          <AvatarImage
            src={source}
            alt="profile pic"
            className="rounded-full border aspect-auto object-cover"
          />
          <AvatarFallback delayMs={500} className="border">
            {initial}
          </AvatarFallback>
        </>
      ) : (
        <AvatarFallback className="border-2 border-primary/20">
          {initial}
        </AvatarFallback>
      )}
    </Avatar>
  )
}

export const EditableAvatarCard = ({
  source,
  name,
  className,
  slug,
  type,
}: {
  source: string | null
  name: string
  className?: string
  slug: string
  type: 'user' | 'community'
}) => {
  const router = useRouter()
  const initial = name[0].toUpperCase()
  const [uploading, setUploading] = useState(false)
  const queryClient = useQueryClient()
  const { update } = useSession()
  const src = source ?? undefined
  const cummunitySlug = type === 'community' ? slug : undefined

  return (
    <Avatar className={className}>
      {uploading ? (
        <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">
          <Cliploader color="#8585ad" />
        </span>
      ) : (
        <div className="group w-full h-full relative">
          <div className="group-hover:opacity-30 transition-opacity duration-300 w-full h-full">
            <AvatarImage
              src={src}
              alt="profile pic"
              className="rounded-full border aspect-auto object-cover"
            />
            <AvatarFallback
              delayMs={500}
              className="border-2 border-primary/20"
            >
              {initial}
            </AvatarFallback>
          </div>
          <div className="absolute opacity-0 hover:opacity-100 transition-opacity duration-300 top-0 bottom-0 left-0 right-0 px-6">
            <UploadButton
              className="flex w-full h-full text-sm"
              appearance={{
                button:
                  'w-full rounded-md font-medium border border-input hover:bg-accent hover:text-accent-foreground bg-background text-foreground transition-colors',
              }}
              endpoint={
                type === 'user' ? 'userImageUploader' : 'communityImageUploader'
              }
              onBeforeUploadBegin={(files) => {
                setUploading(true)
                return generateFile(slug, type, files[0])
              }}
              onClientUploadComplete={() => {
                if (type === 'user') {
                  update()
                } else if (type === 'community') {
                  router.refresh()
                }
                queryClient
                  .invalidateQueries({
                    queryKey: [EXPLORE_POSTS_KEY, { cummunitySlug }],
                  })
                  .then(() => {
                    setUploading(false)
                  })
              }}
              onUploadError={(error: Error) => {
                setUploading(false)
                console.error('Error: ', error)
              }}
            />
          </div>
        </div>
      )}
    </Avatar>
  )
}

const generateFile = (slug: string, type: 'user' | 'community', file: File) => {
  return [
    new File(
      [file],
      `${type}_profile_image_${slug}_.${file.name.split('.').pop()}`,
      { type: file.type }
    ),
  ]
}
