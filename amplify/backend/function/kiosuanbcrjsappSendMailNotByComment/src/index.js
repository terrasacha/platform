/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	GRAPHQL_ENDPOINT
	GRAPHQL_API_KEY
Amplify Params - DO NOT EDIT */

const fetch = require('node-fetch');
const { SESClient, SendTemplatedEmailCommand } = require("@aws-sdk/client-ses");

const ses = new SESClient({ region: "us-east-1" });

const { Request } = fetch

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT;
const GRAPHQL_API_KEY = process.env.GRAPHQL_API_KEY;

console.log(GRAPHQL_ENDPOINT)
console.log(GRAPHQL_API_KEY)

const query = /* GraphQL */ `
query GetVerification($id: ID!) {
    getVerification(id: $id) {
      userVerifierID
      userVerifiedID
      userVerified {
        email
        name
      }
      userVerifier {
        email
        name
      }
    }
  }
`;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  //console.log(`EVENT: ${JSON.stringify(event)}`);

  for (const streamedItem of event.Records) {
    //console.log(streamedItem.eventID);
    //console.log(streamedItem.eventName);
    //console.log('DynamoDB Record: %j', streamedItem.dynamodb);
    if (streamedItem.eventName === 'INSERT') {
      verificationID = streamedItem.dynamodb.NewImage.verificationID.S;
      isCommentByVerifier = streamedItem.dynamodb.NewImage.isCommentByVerifier.BOOL;
      console.log(verificationID)
        
      const variables = { id: verificationID };

      /** @type {import('node-fetch').RequestInit} */
      const options = {
        method: 'POST',
        headers: {
          'x-api-key': GRAPHQL_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query, variables })
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

      if (!isCommentByVerifier) {
        // Send mail to user
        userEmail = body.data.getVerification.userVerified.email
        userName = body.data.getVerification.userVerified.name
        console.log("Envio de mensaje a usuario")
        console.log(userEmail)
      } else {
        userEmail = body.data.getVerification.userVerifier.email
        userName = body.data.getVerification.userVerifier.name
        console.log("Envio de mensaje a verificador")
        console.log(userEmail)
        // Send mail to verifier
      }
        const fromMail = SES_EMAIL
          const toMail = [userEmail]
          const data3 =   `Se ha realizado un nuevo comentario sobre la verificacion de un documento`
          const templateData = {
            data: data3,
            user: userName
          };
          try {
            const data = await ses.send(new SendTemplatedEmailCommand({
              Source: fromMail,
              Destination: {
                ToAddresses: toMail,
              },
              Template: "AWS-SES-HTML-Email-Default-Template",
              TemplateData: JSON.stringify(templateData),
            }));
            return { status: 'done', msg: data }
          } catch (error) {
            return { status: 'error', msg: error }
          }
    }
  }
};
