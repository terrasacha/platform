const AWS = require('aws-sdk')
const { SESClient, VerifyEmailIdentityCommand, SendTemplatedEmailCommand } = require("@aws-sdk/client-ses")
const generator = require('generate-password');
AWS.config.update({ region: 'us-east-1' })

const ses = new SESClient({ region: "us-east-1" })
const cognito = new AWS.CognitoIdentityServiceProvider()

const SES_EMAIL = process.env.SES_EMAIL
const MESSAGE_ACTION_SUPPRESS = 'SUPPRESS'

async function checkUserExistenceInCognito(usuario, email, USER_POOL_ID) {
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

async function createUserInCognito(usuario, email, role, password, subrole, USER_POOL_ID) {
  const params = {
    UserPoolId: USER_POOL_ID,
    Username: usuario,
    UserAttributes: [
      { Name: 'email', Value: email },
      { Name: 'custom:role', Value: role },
      { Name: 'custom:subrole', Value: subrole },
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

async function createUserInGraphQL(sub, usuario, email, role, subrole, GRAPHQL_ENDPOINT, GRAPHQL_API_KEY) {
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
            subrole
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
          subrole,
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

async function deleteUserInGraphQL(id, GRAPHQL_ENDPOINT, GRAPHQL_API_KEY) {
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
    if (record.eventName === 'INSERT' && record.dynamodb.NewImage && record.dynamodb.NewImage.role.S.includes('validator') && !record.dynamodb.NewImage.isProfileUpdated.BOOL) {
      const sourceEvent = record.eventSourceARN.split('/')[1]
      let GRAPHQL_ENDPOINT = process.env.SUANTABLE === sourceEvent ? process.env.GRAPHQL_ENDPOINT_SUAN : process.env.GRAPHQL_ENDPOINT_TERRASASHA
      let GRAPHQL_API_KEY = process.env.SUANTABLE === sourceEvent ? process.env.GRAPHQL_API_KEY_SUAN : process.env.GRAPHQL_API_KEY_TERRASASHA
      let USER_POOL_ID = process.env.SUANTABLE === sourceEvent ? process.env.USER_POOL_ID_SUAN : process.env.USER_POOL_ID_TERRASASHA
      console.log({
        GRAPHQL_ENDPOINT: GRAPHQL_ENDPOINT,
        GRAPHQL_API_KEY: GRAPHQL_API_KEY,
        USER_POOL_ID: USER_POOL_ID,
        sourceEvent: sourceEvent
      })
      const id = record.dynamodb.NewImage.id.S
      const email = record.dynamodb.NewImage.email.S
      const usuario = record.dynamodb.NewImage.name.S
      const role = record.dynamodb.NewImage.role.S.split('_')[0]
      const subrole = record.dynamodb.NewImage.role.S.split('_')[1]
      const password = generator.generate({
        length: 12,
        numbers: true
      });
      const verifyEmailIdentityCommand = new VerifyEmailIdentityCommand({ EmailAddress: email })
      console.log(id, email, usuario, role, subrole)

      try {
        await deleteUserInGraphQL(id, GRAPHQL_ENDPOINT, GRAPHQL_API_KEY)
        console.log(email, usuario, role)

        const { alreadyExist } = await checkUserExistenceInCognito(usuario, email, USER_POOL_ID)
        
        if (!alreadyExist) {
          const sub = await createUserInCognito(usuario, email, role, password, subrole, USER_POOL_ID)
          await createUserInGraphQL(sub, usuario, email, role, subrole, GRAPHQL_ENDPOINT, GRAPHQL_API_KEY)
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
