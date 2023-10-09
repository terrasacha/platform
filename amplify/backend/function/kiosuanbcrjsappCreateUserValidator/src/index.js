const AWS = require('aws-sdk')
const { SESClient, VerifyEmailIdentityCommand, SendTemplatedEmailCommand } = require("@aws-sdk/client-ses")
const generator = require('generate-password');
AWS.config.update({ region: 'us-east-1' })

const ses = new SESClient({ region: "us-east-1" })
const cognito = new AWS.CognitoIdentityServiceProvider()

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT 
const GRAPHQL_API_KEY = process.env.GRAPHQL_API_KEY
const SES_EMAIL = process.env.SES_EMAIL
const USER_POOL_ID = process.env.USER_POOL_ID
const MESSAGE_ACTION_SUPPRESS = 'SUPPRESS'

async function checkUserExistenceInCognito(usuario, email) {
  const params = {
    UserPoolId: USER_POOL_ID,
    Username: usuario,
  }

  try {
    const existingUser = await cognito.adminGetUser(params).promise()
    const sub = existingUser.UserAttributes.find(attr => attr.Name === 'sub').Value
    console.log('User already exists in Cognito, returning existing sub:', sub)
    return { alreadyExist: true }
  } catch (error) {
    if (error.code === 'UserNotFoundException') {
      return { alreadyExist: false }
    }
    console.error('Error getting user from Cognito', error)
    throw error
  }
}

async function createUserInCognito(usuario, email, role, password) {
  const params = {
    UserPoolId: USER_POOL_ID,
    Username: usuario,
    UserAttributes: [
      { Name: 'email', Value: email },
      { Name: 'custom:role', Value: role }
    ],
    MessageAction: MESSAGE_ACTION_SUPPRESS
  }

  try {
    const createUserResult = await cognito.adminCreateUser(params).promise()
    const sub = createUserResult.User.Attributes.find(attr => attr.Name === 'sub').Value
    console.log(`User created in Cognito with temporary password. ${password}`)
    await cognito.adminSetUserPassword({
      UserPoolId: USER_POOL_ID,
      Username: usuario,
      Password: password,
      Permanent: false
    }).promise()
    
     await cognito.adminUpdateUserAttributes({
      UserPoolId: USER_POOL_ID,
      Username: usuario,
      UserAttributes: [{ Name: 'email_verified', Value: 'true' }]
    }).promise();
    return sub 
  } catch (error) {
    console.error('Error creating user in Cognito', error)
    throw error
  }
}

async function createUserInGraphQL(sub, usuario, email, role) {
  const fetchOptionsUser = {
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
          email,
          role,
          isProfileUpdated: true
        }
      }
    })
  }

  try {
    const responseUser = await fetch(GRAPHQL_ENDPOINT, fetchOptionsUser)
    const responseDataUser = await responseUser.json()
    console.log('User registration in GraphQL:', responseDataUser)
  } catch (error) {
    console.error('Error creating user in GraphQL', error)
    throw error
  }
}

async function deleteUserInGraphQL(id) {
  const fetchOptionsUser = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': GRAPHQL_API_KEY
    },
    body: JSON.stringify({
      query: `
        mutation DeleteUser(
          $input: DeleteUserInput!
          $condition: ModelUserConditionInput
        ) {
          deleteUser(input: $input, condition: $condition) {
            id
          }
        }
      `,
      variables: {
        input: { id }
      }
    })
  }

  try {
    const responseUser = await fetch(GRAPHQL_ENDPOINT, fetchOptionsUser)
    const responseDataUser = await responseUser.json()
    console.log('User delete in GraphQL:', responseDataUser)
  } catch (error) {
    console.error('Error deleting user in GraphQL', error)
    throw error
  }
}

exports.handler = async (event) => {
  /* const verifyEmailIdentityCommand = new VerifyEmailIdentityCommand({ EmailAddress: 'diaznannignacio@gmail.com' })
  await ses.send(verifyEmailIdentityCommand) */


  for (const record of event.Records) {
    if (record.eventName === 'INSERT' && record.dynamodb.NewImage && record.dynamodb.NewImage.role.S === 'validator' && !record.dynamodb.NewImage.isProfileUpdated.BOOL) {
      const id = record.dynamodb.NewImage.id.S
      const email = record.dynamodb.NewImage.email.S
      const usuario = record.dynamodb.NewImage.name.S
      const role = 'validator'
      const password = generator.generate({
        length: 12,
        numbers: true
      });
      const verifyEmailIdentityCommand = new VerifyEmailIdentityCommand({ EmailAddress: email })
      console.log(id, email, usuario, role)

      try {
        await deleteUserInGraphQL(id)
        console.log(email, usuario, role)

        const { alreadyExist } = await checkUserExistenceInCognito(usuario, email)
        
        if (!alreadyExist) {
          const sub = await createUserInCognito(usuario, email, role, password)
          await createUserInGraphQL(sub, usuario, email, role)
          await ses.send(verifyEmailIdentityCommand)
          const fromMail = SES_EMAIL
          const toMail = [email]
          const data3 =   `Su usuario para ingresar a la plataforma es ${usuario} y su contraseña temporal es ${password}`
          const templateData = {
            data: data3,
            user: 'test'
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

      } catch (error) {
        console.error('An error occurred during processing', error)
        return { status: 'error', msg: 'An error occurred during processing' }
      }
    }
  }
}
