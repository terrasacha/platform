
const fetch = require('node-fetch');
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const ses = new SESClient({ region: "us-east-1" });
const { Request } = fetch

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT;
const GRAPHQL_API_KEY = process.env.GRAPHQL_API_KEY;
const SES_EMAIL = process.env.SES_EMAIL

const query = /* GraphQL */ `
query GetDocument($id: ID!) {
    getDocument(id: $id) {
      id
      createdAt
      productFeature {
        id
        featureID
        verifications {
          items {
            userVerifier {
              id
              email
              name
            }
          }
        }
        product {
          id
          name
          createdAt
        }
      }
    }
  }
`;
/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async(event) => {
  for (const record of event.Records) {
    console.log(record.eventID);
    console.log(record.eventName);
    console.log('DynamoDB Record: %j', record.dynamodb);
    
    if (record.eventName === 'INSERT' && record.dynamodb.NewImage) {
      let documentID = record.dynamodb.NewImage.id.S
        const variables = { id: documentID };
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
        let userVerifierEmail = ''
        let msInOneDay = 86400000
        let diffMsDates = ''
        let bodyInfo = {}
        try {
          response = await fetch(request);
          body = await response.json();
          let timestamp1 = new Date(body.data.getDocument.productFeature.product.createdAt).getTime();
          let timestamp2 = new Date(body.data.getDocument.createdAt).getTime();
          diffMsDates = Math.abs(timestamp2 - timestamp1)
          userVerifierEmail = body.data.getDocument.productFeature.verifications.items[0].userVerifier.email
          bodyInfo = {productName: body.data.getDocument.productFeature.product.name, featureID: body.data.getDocument.productFeature.featureID}
          if (body.errors) statusCode = 400;
        } catch (error) {
          statusCode = 400;
          console.log(error)
        }
        if(diffMsDates > msInOneDay){
          const mailParams = {
            Destination: {
              ToAddresses: [userVerifierEmail], 
            },
            Source: SES_EMAIL, 
            Message: {
              Subject: { Data: `Se ha subido un nuevo documento vinculado a ${bodyInfo.productName}` },
              Body: {
                Text: { Data: `El propietario del proyecto ${bodyInfo.productName} ha subido nueva documentación referida a ${bodyInfo.featureID}.` },
              },
            },
          }
          const command = new SendEmailCommand(mailParams);
          try {
            const data = await ses.send(command);
            return { status: 'done', msg: data }
          } catch (error) {
            return { status: 'error', msg: error }
          }
        }
    }
  }
};
