# Serverless URL
This is an application that allow you to save your favourite urls

# Functionality of the application

This application will allow creating/removing/updating/fetching URL items. Each URL item can optionally have an attachment image. Each user only has access to URL items that he/she has created.

# URL items

The application should store URL items, and each URL item contains the following fields:

* `urlId` (string) - a unique id for an item
* `createdAt` (string) - date and time when an item was created
* `url` (string) - the url of the website
* `description` (string) - why you like the url
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a URL item

You might also store an id of a user who created a URL item.


# Functions to be implemented

To implement this project, you need to implement the following functions and configure them in the `serverless.yml` file:

* `Auth` - this function should implement a custom authorizer for API Gateway that should be added to all other functions.

* `GetUrls` - should return all URLs for a current user. A user id can be extracted from a JWT token that is sent by the frontend

It should return data that looks like this:

```json
{
  "items": [
    {
      "urlId": "123",
      "createdAt": "2019-07-27T20:01:45.424Z",
      "name": "Buy milk",
      "dueDate": "2019-07-29T20:01:45.424Z",
      "done": false,
      "attachmentUrl": "http://example.com/image.png"
    },
    {
      "urlId": "456",
      "createdAt": "2019-07-27T20:01:45.424Z",
      "name": "Send a letter",
      "dueDate": "2019-07-29T20:01:45.424Z",
      "done": true,
      "attachmentUrl": "http://example.com/image.png"
    },
  ]
}
```

* `CreateUrl` - should create a new URL for a current user. A shape of data send by a client application to this function can be found in the `CreateUrlRequest.ts` file

It receives a new URL item to be created in JSON format that looks like this:

```json
{
  "createdAt": "2019-07-27T20:01:45.424Z",
  "name": "Buy milk",
  "dueDate": "2019-07-29T20:01:45.424Z",
  "done": false,
  "attachmentUrl": "http://example.com/image.png"
}
```

It should return a new URL item that looks like this:

```json
{
  "item": {
    "urlId": "123",
    "createdAt": "2019-07-27T20:01:45.424Z",
    "name": "Buy milk",
    "dueDate": "2019-07-29T20:01:45.424Z",
    "done": false,
    "attachmentUrl": "http://example.com/image.png"
  }
}
```

* `UpdateUrl` - should update a URL item created by a current user. A shape of data send by a client application to this function can be found in the `UpdateUrlRequest.ts` file

It receives an object that contains three fields that can be updated in a URL item:

```json
{
  "name": "Buy bread",
  "dueDate": "2019-07-29T20:01:45.424Z",
  "done": true
}
```

The id of an item that should be updated is passed as a URL parameter.

It should return an empty body.

* `DeleteUrl` - should delete a URL item created by a current user. Expects an id of a URL item to remove.

It should return an empty body.

* `GenerateUploadUrl` - returns a pre-signed URL that can be used to upload an attachment file for a URL item.

It should return a JSON object that looks like this:

```json
{
  "uploadUrl": "https://s3-bucket-name.s3.eu-west-2.amazonaws.com/image.png"
}
```

All functions are already connected to appropriate events from API Gateway.

An id of a user can be extracted from a JWT token passed by a client.

You also need to add any necessary resources to the `resources` section of the `serverless.yml` file such as DynamoDB table and S3 bucket.


# Frontend

The `client` folder contains a web application that can use the API that should be developed in the project.

This frontend should work with your serverless application once it is developed, you don't need to make any changes to the code. The only file that you need to edit is the `config.ts` file in the `client` folder. This file configures your client application just as it was done in the course and contains an API endpoint and Auth0 configuration:
