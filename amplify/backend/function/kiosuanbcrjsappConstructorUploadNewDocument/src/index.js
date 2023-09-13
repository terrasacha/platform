
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
    console.log(record.eventID);
    console.log(record.eventName);
    console.log('DynamoDB Record: %j', record.dynamodb);
    if (record.eventName === 'INSERT' && record.dynamobd.NewImage.status.S === 'validatorFile') {
      newValidatorDocument(query, record.dynamodb.NewImage.id.S)

    } else if (record.eventName === 'MODIFY') {

        if (record.dynamobd.NewImage.status.S === 'denied' || record.dynamobd.NewImage.status.S === 'accepted') {
          validatorChangeTheStatus(query, record.dynamodb.NewImage.id.S)
        }

        if (record.dynamobd.OldImage.status.S === 'denied' && record.dynamobd.NewImage.status.S === 'pending') {
          updateDocumentConstructor(query, record.dynamodb.NewImage.id.S)
        }
    }

  }
};
