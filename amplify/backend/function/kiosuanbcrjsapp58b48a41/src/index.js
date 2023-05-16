

// /**
//  * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
//  */
// exports.handler = event => {
//   console.log(`EVENT: ${JSON.stringify(event)}`);
//   for (const record of event.Records) {
//     console.log(record.eventID);
//     console.log(record.eventName);
//     console.log('DynamoDB Record: %j', record.dynamodb);
//   }
//   return Promise.resolve('Successfully processed DynamoDB record');
// };


const aws = require('aws-sdk')
const ses = new aws.SES()

exports.handler = async (event) => {
  console.log(event)
  for (const streamedItem of event.Records) {
    if (streamedItem.eventName === 'MODIFY') {
      //pull off items from stream
      const candidateName = 'streamedItem.dynamodb.NewImage.name.S'
      const candidateEmail = 'streamedItem.dynamodb.NewImage.email.S'

      await ses
          .sendEmail({
            Destination: {
              ToAddresses: ['robin@suan.global'], //ToAddresses: [process.env.SES_EMAIL],
            },
            Source: process.env.SES_EMAIL,
            Message: {
              Subject: { Data: 'Candidate Submission' },
              Body: {
                Text: { Data: `My name is ${candidateName}. You can reach me at ${candidateEmail}` },
              },
            },
          })
          .promise()
    }
  }
  return { status: 'done' }
}