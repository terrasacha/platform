
const fetch = require('node-fetch');
const { SESClient, SendTemplatedEmailCommand } = require("@aws-sdk/client-ses");
const ses = new SESClient({ region: "us-east-1" });
const { Request } = fetch

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT;
const GRAPHQL_API_KEY = process.env.GRAPHQL_API_KEY;
const SES_EMAIL = process.env.SES_EMAIL

const query = /* GraphQL */ `
query GetDocument($id: ID!) {
    getDocument(id: $id) {
      id
      productFeature {
        id
        featureID
        product {
          id
          name
          userProducts {
            items {
              id
              user {
                id
                name
                email
                role
              }
            }
          }
        }
      }
    }
  }
`;
/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async(event) => {
  console.log(event)
  for (const record of event.Records) {
    console.log(record);
    console.log(record.eventID);
    console.log(record.eventName);
    console.log('DynamoDB Record: %j', record.dynamodb);
    
    if (record.eventName === 'MODIFY') {
      let newImage = record.dynamodb.NewImage;
      let oldImage = record.dynamodb.OldImage;
      let documentID = record.dynamodb.NewImage.id.S
      if(oldImage.status.S !== newImage.status.S && newImage.status.S === 'denied'){
        const variables = { id: documentID };
        /** @type {import('node-fetch').RequestInit} */
        const options = {
          method: 'POST',
          headers: {
            'x-api-key': GRAPHQL_API_KEY, //GRAPHQL_API_KEY
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query, variables })
        };
        const request = new Request(GRAPHQL_ENDPOINT, options); //GRAPHQL_ENDPOINT
  
        let statusCode = 200;
        let body;
        let response;
        let constructorUserEmail = ''
        let infoProduct = ''
        try {
          response = await fetch(request);
          body = await response.json();
          console.log('body 71', body)
          infoProduct = { name: body.data.getDocument.productFeature.product.name, featureID: body.data.getDocument.productFeature.featureID }
          body.data.getDocument.productFeature.product.userProducts.items.map(up => {if(up.user.role === 'constructor') constructorUserEmail = {name: up.user.name, email: up.user.email}})
          if (body.errors) statusCode = 400;
        } catch (error) {
          statusCode = 400;
          console.log(error)
        }
        if(constructorUserEmail !== ''){
          const fromMail = SES_EMAIL
          const toMail = [constructorUserEmail.email]
          const data3 =  `Por favor, ingrese a su perfil para poder ver más detalles acerca de su proyecto ${infoProduct.name}. Documento rechazado ${infoProduct.featureID}`
          const templateData = {
            data: data3,
            user: constructorUserEmail.name
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
      }else{
        console.log('NO CAMBIO EL STATUS')
      }
    }
  }
};
