
const fetch = require('node-fetch');
const { SESClient, SendTemplatedEmailCommand } = require("@aws-sdk/client-ses");
const ses = new SESClient({ region: "us-east-1" });
const { Request } = fetch

const SES_EMAIL = process.env.SES_EMAIL
const query = /* GraphQL */ `
query GetUserProduct($id: ID!) {
  getUserProduct(id: $id) {
    id
    userID
    user {
      id
      name
      role
      email
    }
    product {
      id
      name
    }
  }
}
`
/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async(event) => {
  for (const record of event.Records) { 
    /* console.log('DynamoDB Record: %j', record.dynamodb); */
    
    if (record.eventName === 'INSERT' && record.dynamodb.NewImage) {
      const sourceEvent = record.eventSourceARN.split('/')[1]
      let GRAPHQL_ENDPOINT = process.env.SUANTABLE === sourceEvent ? process.env.GRAPHQL_ENDPOINT_SUAN : process.env.GRAPHQL_ENDPOINT_TERRASASHA
      let GRAPHQL_API_KEY = process.env.SUANTABLE === sourceEvent ? process.env.GRAPHQL_API_KEY_SUAN : process.env.GRAPHQL_API_KEY_TERRASASHA

      console.log({
        GRAPHQL_ENDPOINT: GRAPHQL_ENDPOINT,
        GRAPHQL_API_KEY: GRAPHQL_API_KEY,
        sourceEvent: sourceEvent
      })
      let userProduct = record.dynamodb.NewImage.id.S
        const variables = { id: userProduct };
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
          console.log(`body ${JSON.stringify(body)}`)
          let userVerifierEmail = body.data.getUserProduct.user.email || null
          let userVerifierName = body.data.getUserProduct.user.name || null
          let userVerifierRole = body.data.getUserProduct.user.role
          let productName = body.data.getUserProduct.product.name
          if (body.errors) statusCode = 400;
          if(!userVerifierEmail){
            throw {status: 'error', msg: `no se encontró email del usuario ${userVerifierName}`}
          }else{
            if(userVerifierEmail && userVerifierRole && userVerifierRole === 'validator'){
              const fromMail = SES_EMAIL
              const toMail = [userVerifierEmail]  
              const data3 =   `Se te ha asignado el proyecto ${productName} para la revisión de documentación. Recuerda priorizar la asignación de valores a "Token Price", "Token Name" y "Amount of tokens" para que el proyecto pueda ser visualizado en el Marketplace`
              const templateData = {
                data: data3,
                user: userVerifierName
              }
              await sendValidatorEmail(fromMail, toMail, templateData)
            }else{
              return {status: 'error', msg: 'el usuario creado no es validador'}
            }
          }
        } catch (error) {
          statusCode = 400;
          console.log(error)
        }
    }
  }
};

const sendValidatorEmail = async(fromMail, toMail, templateData) => {
  try {
    const data = await ses.send(new SendTemplatedEmailCommand({
      Source: fromMail,
      Destination: {
        ToAddresses: toMail,
      },
      Template: "AWS-SES-HTML-Email-Default-Template",
      TemplateData: JSON.stringify(templateData),
    }));
    console.log(`email enviado a ${toMail}`)
    return { status: 'done', msg: data }
  } catch (error) {
    return { status: 'error', msg: error }
  }
}
