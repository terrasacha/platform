
const newValidatorDocument = require('./newValidatorDocument');
const validatorChangeTheStatus = require('./validatorChangeTheStatus');
const updateDocumentConstructor = require('./updateDocumentConstructor');

const query = /* GraphQL */ `
query GetDocument($id: ID!) {
    getDocument(id: $id) {
      id
      status
      createdAt
      productFeature {
        id
        featureID
        verifications {
          items {
            userVerifier {
              id
              email
              name
            }
          }
        }
        product {
          id
          name
          userProducts {
            items {
              id
              user {
                email
                name
                role
              }
            }
          }
          createdAt
        }
      }
    }
  }
`;
/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async(event) => {
  for (const record of event.Records) {
    console.log(record.eventName);
    console.log('DynamoDB Record: %j', record.dynamodb);
    const sourceEvent = record.eventSourceARN.split('/')[1]
      let GRAPHQL_ENDPOINT = process.env.SUANTABLE === sourceEvent ? process.env.GRAPHQL_ENDPOINT_SUAN : process.env.GRAPHQL_ENDPOINT_TERRASASHA
      let GRAPHQL_API_KEY = process.env.SUANTABLE === sourceEvent ? process.env.GRAPHQL_API_KEY_SUAN : process.env.GRAPHQL_API_KEY_TERRASASHA

      console.log({
        GRAPHQL_ENDPOINT: GRAPHQL_ENDPOINT,
        GRAPHQL_API_KEY: GRAPHQL_API_KEY,
        sourceEvent: sourceEvent
      })
    if (record.eventName === 'INSERT' && record.dynamodb.NewImage.status.S === 'validatorFile') {
      return await newValidatorDocument(query, record.dynamodb.NewImage.id.S, GRAPHQL_ENDPOINT, GRAPHQL_API_KEY)

    } else if (record.eventName === 'MODIFY') {

        if (record.dynamodb.NewImage.status.S === 'denied' || record.dynamodb.NewImage.status.S === 'accepted') {
          return await validatorChangeTheStatus(query, record.dynamodb.NewImage.id.S, GRAPHQL_ENDPOINT, GRAPHQL_API_KEY)
        }

        if (record.dynamodb.OldImage.status.S === 'denied' && record.dynamodb.NewImage.status.S === 'pending') {
          return await updateDocumentConstructor(query, record.dynamodb.NewImage.id.S, GRAPHQL_ENDPOINT, GRAPHQL_API_KEY)
        }
    }

  }
};
