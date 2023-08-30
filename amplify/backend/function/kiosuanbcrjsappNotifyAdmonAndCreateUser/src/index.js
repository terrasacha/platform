const AWS = require('aws-sdk')
const fetch = require('node-fetch')
const generator = require('generate-password');
const {
  SESClient,
  SendTemplatedEmailCommand
} = require('@aws-sdk/client-ses')

AWS.config.update({ region: 'us-east-1' })

const cognito = new AWS.CognitoIdentityServiceProvider()
const ses = new SESClient({ region: 'us-east-1' })


const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT;
const GRAPHQL_API_KEY = process.env.GRAPHQL_API_KEY;
const SES_EMAIL = process.env.SES_EMAIL;
const USER_POOL_ID = process.env.USER_POOL_ID

const queryGetProduct = /* GraphQL */ `
query GetProduct($id: ID!) {
    getProduct(id: $id) {
      id
      name
      status
      productFeatures {
        items {
          id
          value
          featureID
        }
        nextToken
      }
    }
  }
`;
async function createUserInCognito(usuario, email, role, tempPassword) {
  const params = {
    UserPoolId: USER_POOL_ID,
    Username: usuario,
    UserAttributes: [
      { Name: 'email', Value: email },
      { Name: 'custom:role', Value: role }
    ],
    MessageAction: 'SUPPRESS' //con esto evito el codigo de verificacion
  }

  try {
    const createUserResult = await cognito.adminCreateUser(params).promise()
    const sub = createUserResult.User.Attributes.find(attr => attr.Name === 'sub').Value

    console.log('User SUB:', sub)

    await cognito.adminSetUserPassword({
      UserPoolId: USER_POOL_ID,
      Username: usuario,
      Password: tempPassword,
      Permanent: true
    }).promise()

    console.log('User created in Cognito with temporary password')
    
    return sub
  } catch (error) {
    console.error('Error creating user in Cognito', error)
    throw error
  }
}

async function sendEmailNotification(userEmail) {
  const templateData = {
    data: 'Se ha creado un nuevo proyecto, por favor asigne un validador lo antes posible',
    user: 'Administrador'
  }

  try {
    const data = await ses.send(new SendTemplatedEmailCommand({
      Source: SES_EMAIL,
      Destination: {
        ToAddresses: ['diaznannignacio@gmail.com']
      },
      Template: 'AWS-SES-HTML-Email-Default-Template',
      TemplateData: JSON.stringify(templateData),
    }))
    
    console.log('Email notification sent:', data)
  } catch (error) {
    console.error('Error sending email notification', error)
    throw error
  }
}

async function createUserInGraphQL(sub, usuario, email, role) {
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': GRAPHQL_API_KEY
    },
    body: JSON.stringify({
      query: `
        mutation CreateUser($input: CreateUserInput!) {
          createUser(input: $input) {
            id
            name
            role
            email
          }
        }
      `,
      variables: {
        input: {
          id: sub,
          name: usuario,
          email: email,
          role: role,
          isProfileUpdated: false
        }
      }
    })
  }

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, fetchOptions)
    const responseData = await response.json()

    console.log('User registration in GraphQL:', responseData)
  } catch (error) {
    console.error('Error creating user in GraphQL', error)
    throw error
  }
}

async function getProductInfo(productID){
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': GRAPHQL_API_KEY
    },
    body: JSON.stringify({ 
      query: `
        query GetProduct($id: ID!) {
            getProduct(id: $id) {
              id
              name
              status
              productFeatures {
                items {
                  id
                  value
                  featureID
                }
                nextToken
              }
            }
          }
        `,
        variables: {
          id: productID
        }
      })
  }

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, fetchOptions)
    const responseData = await response.json()
    const productFeatureEmail = responseData.data.getProduct.productFeatures.items.filter(pf => pf.featureID === 'A_postulante_email')
    if(productFeatureEmail[0].value) return productFeatureEmail[0].value
    return null
  } catch (error) {
    console.error('Error creating user in GraphQL', error)
    throw error
  }
}

exports.handler = async (event) => {
  console.log(event)
  for (const record of event.Records) {
    console.log(record.eventID);
    console.log(record.eventName);
    console.log('DynamoDB Record: %j', record.dynamodb);

    if (record.eventName === 'INSERT' && record.dynamodb.NewImage) {
      let productID = record.dynamodb.NewImage.id.S
      const email = await getProductInfo(productID)
      const usuario = email.split('@')[0]
      const role = 'constructor'
      const tempPassword  = generator.generate({
        length: 12,
        numbers: true
      });

      try {
        const sub = await createUserInCognito(usuario, email, role, tempPassword)
        await createUserInGraphQL(sub, usuario, email, role)
        await sendEmailNotification()
        return { status: 'done', msg: 'Process completed successfully' }
      } catch (error) {
        return { status: 'error', msg: 'An error occurred during processing' }
      }
    }
  }
}
