// DO NOT DELETE
// https://docs.aws.amazon.com/ses/latest/dg/example_ses_VerifyEmailIdentity_section.html
// 

const { SESClient, VerifyEmailIdentityCommand } = require("@aws-sdk/client-ses");
const ses = new SESClient({ region: "us-east-1" });

exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  for (const record of event.Records) {
    console.log(record.eventID);
    console.log(record.eventName);
    console.log('DynamoDB Record: %j', record.dynamodb);

    if (record.eventName === 'INSERT') {

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

