// https://repost.aws/knowledge-center/lambda-send-email-ses
// https://dev.to/aws-builders/signing-requests-with-aws-sdk-in-lambda-functions-476
// /https://aws.amazon.com/blogs/mobile/amplify-framework-local-mocking/

// /**
//  * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
//  */
// exports.handler = event => {
//   console.log(`EVENT: ${JSON.stringify(event)}`);
//   for (const record of event.Records) {
//     console.log(record.eventID);
//     console.log(record.eventName);
//     console.log('DynamoDB Record: %j', record.dynamodb);
//   }
//   return Promise.resolve('Successfully processed DynamoDB record');
// };


import { default as fetch, Request } from 'node-fetch';
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
const ses = new SESClient({ region: "us-east-1" });

const GRAPHQL_ENDPOINT = "https://hswl67byrvf7nkerr72oxbw62e.appsync-api.us-east-1.amazonaws.com/graphql";
const GRAPHQL_API_KEY = "da2-zmafzaqndbc5blfoqw4kqddtlq";

const query = /* GraphQL */ `
  query LIST_PRODUCTS {
    listProducts {
      items {
        id
        name
        status
      }
    }
  }
`;


/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export const handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  for (const streamedItem of event.Records) {
    if (streamedItem.eventName === 'MODIFY') {
      //pull off items from stream
      // const candidateName = 'streamedItem.dynamodb.NewImage.name.S'
      // const candidateEmail = 'streamedItem.dynamodb.NewImage.email.S'

      await ses
          // .sendEmail({
          //   Destination: {
          //     ToAddresses: ['robin@suan.global'], //ToAddresses: [process.env.SES_EMAIL],
          //   },
          //   Source: process.env.SES_EMAIL,
          //   Message: {
          //     Subject: { Data: 'Candidate Submission' },
          //     Body: {
          //       Text: { Data: `My name is ${candidateName}. You can reach me at ${candidateEmail}` },
          //     },
          //   },
          // })
          // .promise()
      
          const command = new SendEmailCommand({
            Destination: {
              ToAddresses: ["robin@suan.global"],
            },
            Message: {
              Body: {
                Text: { Data: "Test" },
              },
        
              Subject: { Data: "Test Email" },
            },
            Source: process.env.SES_EMAIL,
          });

          try {
            let response = await ses.send(command);
            console.log('### SES response: ', response)
            // process data.
            return response;
          }
          catch (error) {
            // error handling.
          }
          finally {
            // finally.
          }
    }
  }

  
  const options = {
    method: 'POST',
    headers: {
      'x-api-key': GRAPHQL_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query })
  };

  const request = new Request(GRAPHQL_ENDPOINT, options);

  let statusCode = 200;
  let body;
  let response;

  try {
    response = await fetch(request);
    body = await response.json();
    if (body.errors) statusCode = 400;
  } catch (error) {
    statusCode = 400;
    body = {
      errors: [
        {
          status: response.status,
          message: error.message,
          stack: error.stack
        }
      ]
    };
  }

  console.log("### body: ", JSON.stringify(body))

  return {
    statusCode,
    body: JSON.stringify(body)
  };

  // return { status: 'done' }
}