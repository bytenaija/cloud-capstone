import { apiEndpoint } from '../config'
import { Url } from '../types/Url'
import { CreateUrlRequest } from '../types/CreateUrlRequest'
import Axios from 'axios'
import { UpdateUrlRequest } from '../types/UpdateUrlRequest'

export async function getUrls(idToken: string): Promise<Url[]> {
  console.log('Fetching urls')

  const response = await Axios.get(`${apiEndpoint}/urls`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
  console.log('Urls:', response.data)
  return response.data.urls
}

export async function createUrl(
  idToken: string,
  newUrl: CreateUrlRequest
): Promise<Url> {
  const response = await Axios.post(
    `${apiEndpoint}/urls`,
    JSON.stringify(newUrl),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  return response.data.url
}

export async function patchUrl(
  idToken: string,
  urlId: string,
  updatedUrl: UpdateUrlRequest
): Promise<void> {
  await Axios.patch(
    `${apiEndpoint}/urls/${urlId}`,
    JSON.stringify(updatedUrl),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
}

export async function deleteUrl(
  idToken: string,
  urlId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/urls/${urlId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  urlId: string
): Promise<string> {
  const response = await Axios.post(
    `${apiEndpoint}/urls/${urlId}/attachment`,
    '',
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  return response.data.uploadUrl
}

export async function uploadFile(
  uploadUrl: string,
  file: Buffer
): Promise<void> {
  await Axios.put(uploadUrl, file)
}
