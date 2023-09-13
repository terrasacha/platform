const fetch = require('node-fetch')
const { SESClient, SendTemplatedEmailCommand } = require("@aws-sdk/client-ses")

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT
const GRAPHQL_API_KEY = process.env.GRAPHQL_API_KEY
const SES_EMAIL = process.env.SES_EMAIL

const ses = new SESClient({ region: "us-east-1" })

async function upddateDocumentConstructor(query, documentID) {
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

    let verificatorInfo = null
    let bodyInfo = null

    if (response.ok) {
      const verificator = body.data.getDocument.productFeature.verifications.items[0].userVerifier
      if (verificator) {
        verificatorInfo = { email: verificator.email, name: verificator.name }
      }
      bodyInfo = { productName: body.data.getDocument.productFeature.product.name, featureID: body.data.getDocument.productFeature.featureID }
    }

    const textEmail = `Hola ${verificatorInfo?.name || ''}. El usuario propietario del proyecto ${bodyInfo?.productName || ''} ha subido nueva documentación referida a ${bodyInfo?.featureID || ''}.`

    if (verificatorInfo && verificatorInfo.email) {
      const templateData = {
        data: textEmail,
        user: verificatorInfo.name || '',
      }

      const data = await ses.send(new SendTemplatedEmailCommand({
        Source: SES_EMAIL,
        Destination: {
          ToAddresses: [verificatorInfo.email],
        },
        Template: "AWS-SES-HTML-Email-Default-Template",
        TemplateData: JSON.stringify(templateData),
      }))

      return { status: 'done', msg: data }
    } else {
      return { status: 'error', msg: 'Verificator not found or missing email address' }
    }
  } catch (error) {
    console.error(error)
    return { status: 'error', msg: error.message || 'An error occurred' }
  }
}

export default upddateDocumentConstructor
