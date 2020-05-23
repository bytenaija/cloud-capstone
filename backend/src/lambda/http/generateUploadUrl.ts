import 'source-map-support/register'
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'

import { generateUploadUrl } from '../../businessLogic/url'

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const urlId = event.pathParameters.urlId
  console.log('[generateUploadUrl]: Processing event: ', event)

  // URL: Return a presigned URL to upload a file for a URL item with the provided id

  const uploadUrl = await generateUploadUrl(urlId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uploadUrl
    })
  }
}
