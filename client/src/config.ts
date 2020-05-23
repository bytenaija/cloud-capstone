const apiId = 'k6qdppwy6a'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-2.amazonaws.com/dev`

export const authConfig = {
  // URL: Create an Auth0 application and copy values from it into this map
  domain: 'bytenaija.auth0.com', // Auth0 domain
  clientId: 'YGU6wCOp5VfZrRI9ppWBa8XmiqiYgDs7', // Auth0 client id
  callbackUrl: 'http://localhost:3001/callback'
}
