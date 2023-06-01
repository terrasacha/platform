
const { SESClient, SendEmailCommand, verifyEmailIdentity } = require("@aws-sdk/client-ses");
const ses = new SESClient({ region: "us-east-1" });

exports.handler = async (event) => {
  console.log(event)

  var params = {
    EmailAddress: "robin8a@gmail.com"
   };
   
  //  ses.verifyEmailIdentity(params, function(err, data) {
  //    if (err) console.log(err, err.stack); // an error occurred
  //    else     console.log(data);           // successful response
  //    /*
  //    data = {
  //    }
  //    */
  //  });

  const command = new verifyEmailIdentity(params);

      try {
        const data = await ses.send(command);
        return { status: 'done', msg: data }
      } catch (error) {
        return { status: 'error', msg: error }
      }

  

  
  return { status: 'done' }
}