// DO NOT DELETE
// https://docs.aws.amazon.com/ses/latest/dg/example_ses_VerifyEmailIdentity_section.html
// https://dev.to/mtliendo/serverless-contact-form-using-aws-amplify-1e9m

const { SESClient, VerifyEmailIdentityCommand } = require("@aws-sdk/client-ses");
const ses = new SESClient({ region: "us-east-1" });

exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  for (const record of event.Records) {
    console.log(record.eventID);
    console.log(record.eventName);
    console.log('DynamoDB Record: %j', record.dynamodb);

    if (record.eventName === 'INSERT' && record.dynamodb.NewImage.role.S !== 'validator' ) {

      const EMAIL_ADDRESS = record.dynamodb.NewImage.email.S;
      const verifyEmailIdentityCommand = new VerifyEmailIdentityCommand({ EmailAddress: EMAIL_ADDRESS });
  
      try {
        return await ses.send(verifyEmailIdentityCommand);
      } catch (err) {
        console.log("Failed to verify email identity.", err);
        return err;
      }
  
    }
  }

  return { status: 'done' }
}

