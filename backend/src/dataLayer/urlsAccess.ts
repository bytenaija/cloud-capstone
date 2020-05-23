import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { UrlItem } from '../models/UrlItem'

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})
const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export class UrlAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly urlsTable = process.env.URLS_TABLE
  ) {}

  async getAllUrls(userId: string): Promise<UrlItem[]> {
    console.log('Getting all urls for user:', userId)

    const result = await this.docClient
      .query({
        TableName: this.urlsTable,
        KeyConditionExpression: '#userId = :userId',
        ExpressionAttributeNames: {
          '#userId': 'userId'
        },
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()

    const items = result.Items
    console.log('getAllUrls result:', items)
    return items as UrlItem[]
  }



  async CreateUrl(url): Promise<UrlItem> {
    console.log('creating url:', url)

    await this.docClient
      .put({
        TableName: this.urlsTable,
        Item: url
      })
      .promise()

    return url
  }

  async deleteUrl(urlId: string, userId: string): Promise<string> {
    console.log('Deleting url:', urlId)

    await this.docClient
      .delete({
        TableName: this.urlsTable,
        Key: {
          urlId,
          userId
        }
      })
      .promise()

    console.log('Url deleted. urlId:', urlId)
    return ''
  }

  async updateUrl(
    userId: string,
    urlId: string,
    updatedUrl
  ): Promise<string> {
    console.log('updating todo:', urlId, updatedUrl)

    await this.docClient
      .update({
        TableName: this.urlsTable,
        Key: {
          urlId,
          userId
        },
        UpdateExpression: 'set #url = :url, description = :description',
        ExpressionAttributeValues: {
          ':url': updatedUrl.url,
          ':description': updatedUrl.description,
        },
        ExpressionAttributeNames: {
          '#url': 'url'
        }
      })
      .promise()

    console.log('Url updated:', updatedUrl)

    return updatedUrl
  }

  async generateUploadUrl(urlId: string): Promise<string> {
    console.log('generating url', urlId)

    const url = s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: urlId,
      Expires: urlExpiration
    })

    console.log('generated upload url:', url)
    return url
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new AWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:3000'
    })
  }

  return new AWS.DynamoDB.DocumentClient()
}
