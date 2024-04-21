import { UTApi } from 'uploadthing/server'

export const utapi = new UTApi()

export const deleteImage = async (imageKey: string) => {
  await utapi.deleteFiles(imageKey)
}
