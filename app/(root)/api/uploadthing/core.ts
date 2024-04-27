import { deleteImage } from '@/actions/image/delete-image'
import { getCommunityBySlug } from '@/data/community'
import { db } from '@/db/client'
import { currentUser } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { UploadThingError } from 'uploadthing/server'

const f = createUploadthing()

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  userImageUploader: f({ image: { maxFileSize: '1MB' } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ files }) => {
      // This code runs on your server before upload
      if (files.length > 1) throw new UploadThingError('Only one file allowed')
      const user = await currentUser()

      // If you throw, the user will not be able to upload
      if (!user || !user.id) throw new UploadThingError('Unauthorized')

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id, previousImageKey: user.image?.split('/').pop() }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      await db.user.update({
        where: { id: metadata.userId },
        data: { image: file.url },
      })
      if (metadata.previousImageKey) {
        await deleteImage(metadata.previousImageKey)
      }
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId, fileUrl: file.url }
    }),
  communityImageUploader: f({ image: { maxFileSize: '1MB' } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ files }) => {
      // This code runs on your server before upload
      if (files.length > 1) throw new UploadThingError('Only one file allowed')
      const user = await currentUser()

      // If you throw, the user will not be able to upload
      if (!user || !user.id) throw new UploadThingError('Unauthorized')

      const community = await getCommunityBySlug(files[0].name.split('_')[3])

      if (!community || community.ownerId !== user.id)
        throw new UploadThingError('Unauthorized: not community owner')

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return {
        userId: user.id,
        communityId: community.id,
        communitySlug: community.slug,
        previousImageKey: community.image?.split('/').pop(),
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      await db.community.update({
        where: { id: metadata.communityId },
        data: { image: file.url },
      })
      if (metadata.previousImageKey) {
        await deleteImage(metadata.previousImageKey)
      }
      revalidatePath(`/community/${metadata.communitySlug}`)
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId, fileUrl: file.url }
    }),
  postImageUploader: f({ image: { maxFileSize: '1MB' } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ files }) => {
      // This code runs on your server before upload
      if (files.length > 1) throw new UploadThingError('Only one file allowed')
      const user = await currentUser()

      // If you throw, the user will not be able to upload
      if (!user || !user.id) throw new UploadThingError('Unauthorized')

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return {}
    })
    .onUploadComplete(async ({ file }) => {
      // This code RUNS ON YOUR SERVER after upload

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { fileUrl: file.url }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
