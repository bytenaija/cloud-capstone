import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'

import { CreateUrlRequest } from '../../requests/CreateUrlRequest'
import { createUrl } from '../../businessLogic/url'
import { parseUserId } from '../../auth/utils'

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const data: CreateUrlRequest = JSON.parse(event.body)

  // URL: Implement creating a new URL item
  console.log('[createUrl.ts]: Processing event: ', event)

  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  const userId = parseUserId(jwtToken)
  const url = await createUrl(data, userId)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      url
    })
  }
}
