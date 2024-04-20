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
  type,
}: {
  source: string | null
  name: string
  className?: string
  type: 'display' | 'deleted'
}) => {
  const initial = name[0].toUpperCase()
  return (
    <Avatar className={className}>
      {type === 'display' && (
        <>
          {source ? (
            <>
              <AvatarImage
                src={source}
                alt="profile pic"
                className="rounded-full border"
              />
              <AvatarFallback className="border">{initial}</AvatarFallback>
            </>
          ) : (
            <AvatarFallback className="border border-background">
              {initial}
            </AvatarFallback>
          )}
        </>
      )}
      {type === 'deleted' && (
        <AvatarFallback className="border">
          <BiSolidUser />
        </AvatarFallback>
      )}
    </Avatar>
  )
}

export const EditableProfileAvatarCard = ({
  source,
  name,
  className,
  slug,
}: {
  source: string | null
  name: string
  className?: string
  slug: string
}) => {
  const initial = name[0].toUpperCase()
  const [uploading, setUploading] = useState(false)
  const queryClient = useQueryClient()
  const { update } = useSession()

  return (
    <Avatar className={className}>
      {uploading ? (
        <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">
          <Cliploader color="#8585ad" />
        </span>
      ) : (
        <div className="group w-full h-full relative">
          <div className="group-hover:opacity-30 transition-opacity duration-300 w-full h-full">
            {source ? (
              <>
                <AvatarImage
                  src={source}
                  alt="profile pic"
                  className="rounded-full border"
                />
                <AvatarFallback className="border">{initial}</AvatarFallback>
              </>
            ) : (
              <AvatarFallback className="border border-background">
                {initial}
              </AvatarFallback>
            )}
          </div>
          <div className="absolute opacity-0 hover:opacity-100 transition-opacity duration-300 top-0 bottom-0 left-0 right-0 px-6">
            <UploadButton
              className="flex w-full h-full text-sm"
              appearance={{
                button:
                  'w-full rounded-md font-medium border border-input hover:bg-accent hover:text-accent-foreground bg-background text-foreground transition-colors',
              }}
              endpoint="profileImageUploader"
              onBeforeUploadBegin={(files) => {
                setUploading(true)
                files = [
                  new File(
                    [files[0]],
                    `user_profile_image_${slug}_${files[0].name}`,
                    {
                      type: files[0].type,
                    }
                  ),
                ]
                return files
              }}
              onClientUploadComplete={(res) => {
                update().then(() => {
                  queryClient.invalidateQueries({
                    queryKey: [EXPLORE_POSTS_KEY, { undefined }],
                  })
                  setUploading(false)
                })
              }}
              onUploadError={(error: Error) => {
                // Do something with the error.
                console.error('Error: ', error)
              }}
            />
          </div>
        </div>
      )}
    </Avatar>
  )
}

export const EditableCommunityAvatarCard = ({
  source,
  name,
  className,
  slug,
}: {
  source: string | null
  name: string
  className?: string
  slug: string
}) => {
  const router = useRouter()
  const initial = name[0].toUpperCase()
  const [uploading, setUploading] = useState(false)
  const queryClient = useQueryClient()

  return (
    <Avatar className={className}>
      {uploading ? (
        <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">
          <Cliploader color="#8585ad" />
        </span>
      ) : (
        <div className="group w-full h-full relative">
          <div className="group-hover:opacity-30 transition-opacity duration-300 w-full h-full">
            {source ? (
              <>
                <AvatarImage
                  src={source}
                  alt="profile pic"
                  className="rounded-full border"
                />
                <AvatarFallback className="border">{initial}</AvatarFallback>
              </>
            ) : (
              <AvatarFallback className="border border-background">
                {initial}
              </AvatarFallback>
            )}
          </div>
          <div className="absolute opacity-0 hover:opacity-100 transition-opacity duration-300 top-0 bottom-0 left-0 right-0 px-6">
            <UploadButton
              className="flex w-full h-full text-sm"
              appearance={{
                button:
                  'w-full rounded-md font-medium border border-input hover:bg-accent hover:text-accent-foreground bg-background text-foreground transition-colors',
              }}
              endpoint="communityImageUploader"
              onBeforeUploadBegin={(files) => {
                setUploading(true)
                files = [
                  new File(
                    [files[0]],
                    `community_profile_image_${slug}_${files[0].name}`,
                    {
                      type: files[0].type,
                    }
                  ),
                ]
                return files
              }}
              onClientUploadComplete={(res) => {
                queryClient.invalidateQueries({
                  queryKey: [EXPLORE_POSTS_KEY, { communitySlug: slug }],
                })
                router.refresh()
                setUploading(false)
              }}
              onUploadError={(error: Error) => {
                // Do something with the error.
                console.error('Error: ', error)
              }}
            />
          </div>
        </div>
      )}
    </Avatar>
  )
}
