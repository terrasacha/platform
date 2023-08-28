const AWS = require('aws-sdk')
const fetch = require('node-fetch')

const {
  SESClient,
  SendTemplatedEmailCommand
} = require('@aws-sdk/client-ses')

AWS.config.update({ region: 'us-east-1' })

const cognito = new AWS.CognitoIdentityServiceProvider()
const ses = new SESClient({ region: 'us-east-1' })

const USER_POOL_ID = 'us-east-1_DFaBfYrB1'
const API_KEY = 'da2-zmafzaqndbc5blfoqw4kqddtlq'
const GRAPHQL_API_URL = 'https://hswl67byrvf7nkerr72oxbw62e.appsync-api.us-east-1.amazonaws.com/graphql'

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

async function sendEmailNotification() {
  const templateData = {
    data: 'Se ha creado un nuevo proyecto, por favor asigne un validador lo antes posible',
    user: 'Administrador'
  }

  try {
    const data = await ses.send(new SendTemplatedEmailCommand({
      Source: 'notificaciones@suan.global',
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
      'x-api-key': API_KEY
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
    const response = await fetch(GRAPHQL_API_URL, fetchOptions)
    const responseData = await response.json()

    console.log('User registration in GraphQL:', responseData)
  } catch (error) {
    console.error('Error creating user in GraphQL', error)
    throw error
  }
}

exports.handler = async (event) => {
  const usuario = 'usuariodepruebalambda'
  const email = 'ignaciodiaznanni@gmail.com'
  const role = 'constructor'
  const tempPassword = 'constraseñaSuperSegura1313$!'

  try {
    const sub = await createUserInCognito(usuario, email, role, tempPassword)
    await createUserInGraphQL(sub, usuario, email, role)
    await sendEmailNotification()
    
    return { status: 'done', msg: 'Process completed successfully' }
  } catch (error) {
    return { status: 'error', msg: 'An error occurred during processing' }
  }
}
