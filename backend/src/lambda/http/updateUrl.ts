import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'

import { parseUserId } from '../../auth/utils'
import { UpdateUrlRequest } from '../../requests/UpdateUrlRequest'
import { updateUrl } from '../../businessLogic/url'

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const urlId = event.pathParameters.urlId
  const updatedUrl: UpdateUrlRequest = JSON.parse(event.body)
  console.log('[update url]: Processing event: ', event)

  // URL: Update a URL item with the provided id using values in the "updatedUrl" object

  const authorization = event.headers.Authorization
  const jwtToken = authorization.split(' ')[1]
  const userId = parseUserId(jwtToken)
  const item = await updateUrl(userId, urlId, updatedUrl)
  console.log('updatedResult', item)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(item)
  }
}
