import * as uuid from 'uuid'

import { UrlAccess } from '../dataLayer/urlsAccess'
import { CreateUrlRequest } from '../requests/CreateUrlRequest'
import { UrlItem } from '../models/UrlItem'

const urlAccess = new UrlAccess()
const bucketName = process.env.IMAGES_S3_BUCKET

// createUrl
export async function createUrl(data: CreateUrlRequest, userId: string) {
  const urlId = uuid.v4()

  const item = {
    userId,
    urlId,
    createdAt: new Date().toISOString(),
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${urlId}`,
    ...data
  }

  console.log('New url:', userId, item)
  return await urlAccess.CreateUrl(item)
}


// getAllUrls
export async function getAllUrls(userId: string): Promise<UrlItem[]> {
  return await urlAccess.getAllUrls(userId)
}

// deleteUrl
export async function deleteUrl(
  urlId: string,
  userId: string
): Promise<string> {
  return await urlAccess.deleteUrl(urlId, userId)
}

// updateUrl
export async function updateUrl(
  userId: string,
  urlId: string,
  updatedUrl
): Promise<string> {
  return await urlAccess.updateUrl(userId, urlId, updatedUrl)
}

// generateUrl
export async function generateUploadUrl(urlId: string): Promise<string> {
  return await urlAccess.generateUploadUrl(urlId)
}
