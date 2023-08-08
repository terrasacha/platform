
const fetch = require('node-fetch');
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const ses = new SESClient({ region: "us-east-1" });
const { Request } = fetch

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT;
const GRAPHQL_API_KEY = process.env.GRAPHQL_API_KEY;
const SES_EMAIL = process.env.SES_EMAIL

const query = /* GraphQL */ `
query GetProduct($id: ID!) {
    getProduct(id: $id) {
      id
      name
      status
      userProducts {
        items {
          id
          userID
          user{
            name
            email
            role
          }
        }
        nextToken
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
      let productID = record.dynamodb.NewImage.id.S
        const variables = { id: productID };
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
        let constructorUserEmail = ''
        let infoProduct = ''
        try {
          response = await fetch(request);
          body = await response.json();
          infoProduct = {name: body.data.getProduct.name, status: body.data.getProduct.status}
          body.data.getProduct.userProducts.items.map(up => {if(up.user.role === 'constructor') constructorUserEmail = {name: up.user.name, email: up.user.email}})
          if (body.errors) statusCode = 400;
        } catch (error) {
          statusCode = 400;
          console.log(error)
        }
        if(constructorUserEmail !== ''){
          const mailParams = {
            Destination: {
              ToAddresses: [constructorUserEmail.email], 
            },
            Source: SES_EMAIL, 
            Message: {
              Subject: { Data: 'Creación de proyecto en Suan' },
              Body: {
                Text: { Data: `El proyecto llamado ${infoProduct.name} ha sido creado correctamente. Estado del proyecto: ${infoProduct.status}` },
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
