
const fetch = require('node-fetch');
const { SESClient, SendTemplatedEmailCommand } = require("@aws-sdk/client-ses");
const ses = new SESClient({ region: "us-east-1" });
const { Request } = fetch

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
      const sourceEvent = record.eventSourceARN.split('/')[1]
      let GRAPHQL_ENDPOINT = process.env.SUANTABLE === sourceEvent ? process.env.GRAPHQL_ENDPOINT_SUAN : process.env.GRAPHQL_ENDPOINT_TERRASASHA
      let GRAPHQL_API_KEY = process.env.SUANTABLE === sourceEvent ? process.env.GRAPHQL_API_KEY_SUAN : process.env.GRAPHQL_API_KEY_TERRASASHA

      console.log({
        GRAPHQL_ENDPOINT: GRAPHQL_ENDPOINT,
        GRAPHQL_API_KEY: GRAPHQL_API_KEY,
        sourceEvent: sourceEvent
      })
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
        let infoProduct = ''
        try {
          response = await fetch(request);
          body = await response.json();
          infoProduct = {name: body.data.getProduct.name, status: body.data.getProduct.status}
          let constructorUser = body.data.getProduct.userProducts.items.find(up => up.user.role === 'constructor');
          let constructorUserEmail = constructorUser ? { name: constructorUser.user.name, email: constructorUser.user.email } : null;

          if (body.errors) statusCode = 400;
          if(!constructorUserEmail){
            throw `No se encontró el mail del usuario constructor. Información del constructor: ${constructorUser}`
          }else{
            const fromMail = SES_EMAIL
            const toMail = [constructorUserEmail.email]
            const data3 =   `El proyecto llamado ${infoProduct.name} ha sido creado correctamente. Estado del proyecto: ${infoProduct.status}`
            const templateData = {
              data: data3,
              user: constructorUserEmail.name
            };
            await sendConstructorEmail(fromMail, toMail, templateData)
          }
        } catch (error) {
          statusCode = 400;
          console.log(error)
        }
        
    }
  }
};

const sendConstructorEmail = async (fromMail, toMail, templateData) => {
  try {
    const data = await ses.send(new SendTemplatedEmailCommand({
      Source: fromMail,
      Destination: {
        ToAddresses: toMail,
      },
      Template: "AWS-SES-HTML-Email-Default-Template",
      TemplateData: JSON.stringify(templateData),
    }));
    console.log(`Email enviado a ${toMail}`)
    return { status: 'done', msg: data }
  } catch (error) {
    console.log(`no se pudo enviar el email a ${toMail}`)
    return { status: 'error', msg: error }
  }
}
