import 'source-map-support/register'
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'

import { parseUserId } from '../../auth/utils'
import { getAllUrls } from '../../businessLogic/url'

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  // URL: Get all URL items for a current user
  console.log('[getUrls.ts] Processing event:', event)

  const authorization = event.headers.Authorization
  const jwtToken = authorization.split(' ')[1]
  const userId = parseUserId(jwtToken)
  const urls = await getAllUrls(userId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      urls
    })
  }
}
