const fetch = require('node-fetch')
const { SESClient, SendTemplatedEmailCommand } = require("@aws-sdk/client-ses")

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT || 'https://hswl67byrvf7nkerr72oxbw62e.appsync-api.us-east-1.amazonaws.com/graphql'
const GRAPHQL_API_KEY = process.env.GRAPHQL_API_KEY || 'da2-zmafzaqndbc5blfoqw4kqddtlq'
const SES_EMAIL = process.env.SES_EMAIL || 'notificaciones@suan.global'

const ses = new SESClient({ region: "us-east-1" })

async function newValidatorDocument(query, documentID) {
  console.log('entra aqui')
  try {
    const variables = { id: documentID }
    const options = {
      method: 'POST',
      headers: {
        'x-api-key': GRAPHQL_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    }

    const response = await fetch(GRAPHQL_ENDPOINT, options)
    const body = await response.json()

    let constructorInfo = null
    let bodyInfo = null

    if (response.ok) {
      const constructor = body.data.getDocument.productFeature.product.userProducts.items.find(up => up.user.role === 'constructor')
      if (constructor) {
        constructorInfo = { email: constructor.user.email, name: constructor.user.name }
      }
      bodyInfo = { productName: body.data.getDocument.productFeature.product.name, featureID: body.data.getDocument.productFeature.featureID }
    }

    const textEmail = `Hola ${constructorInfo?.name || ''}. El validador asignado al proyecto ${bodyInfo?.productName || ''} ha subido nueva documentación referida a ${bodyInfo?.featureID || ''}.`

    if (constructorInfo && constructorInfo.email) {
      const templateData = {
        data: textEmail,
        user: constructorInfo.name || '',
      }

      const data = await ses.send(new SendTemplatedEmailCommand({
        Source: SES_EMAIL,
        Destination: {
          ToAddresses: [constructorInfo.email],
        },
        Template: "AWS-SES-HTML-Email-Default-Template",
        TemplateData: JSON.stringify(templateData),
      }))

      return { status: 'done', msg: data }
    } else {
      return { status: 'error', msg: 'Constructor not found or missing email address' }
    }
  } catch (error) {
    console.error(error)
    return { status: 'error', msg: error.message || 'An error occurred' }
  }
}

module.exports = newValidatorDocument;
