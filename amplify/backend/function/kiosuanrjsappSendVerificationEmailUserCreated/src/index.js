// DO NOT DELETE
// https://docs.aws.amazon.com/ses/latest/dg/example_ses_VerifyEmailIdentity_section.html
// 

const { SESClient, VerifyEmailIdentityCommand } = require("@aws-sdk/client-ses");
const ses = new SESClient({ region: "us-east-1" });

exports.handler = async (event) => {
  console.log(event)

  for (const streamedItem of event.Records) {
    if (streamedItem.eventName === 'INSERT') {

      const EMAIL_ADDRESS = "robin8a@gmail.com"
      const verifyEmailIdentityCommand = new VerifyEmailIdentityCommand({ EmailAddress: EMAIL_ADDRESS });
  
      try {
        return await ses.send(verifyEmailIdentityCommand);
      } catch (err) {
        console.log("Failed to verify email identity.", err);
        return err;
      }
    }
  }



  // var params = {
  //   EmailAddress: "robin8a@gmail.com"
  //  };

  //  ses.verifyEmailIdentity(params, function(err, data) {
  //    if (err) console.log(err, err.stack); // an error occurred
  //    else     console.log(data);           // successful response
  //    /*
  //    data = {
  //    }
  //    */
  //  });

  // const command = new verifyEmailIdentity(params);

  //     try {
  //       const data = await ses.send(command);
  //       return { status: 'done', msg: data }
  //     } catch (error) {
  //       return { status: 'error', msg: error }
  //     }

  

  
  return { status: 'done' }
}