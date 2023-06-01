
// requires
const AWS = require('aws-sdk');
// Set region 
AWS.config.update({region: 'us-east-1'});

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = event => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  // Create promise and SES service object
  var verifyEmailPromise = new AWS.SES({apiVersion: '2010-12-01'}).verifyEmailIdentity({EmailAddress: "robin8a@gmail.com"}).promise();

  // Handle promise's fulfilled/rejected states
  verifyEmailPromise.then(
    function(data) {
      console.log("Data: ", data);
      console.log("Email verification initiated");
    }).catch(
      function(err) {
      console.error(err, err.stack);
    });
    // for (const record of event.Records) {
    //   console.log(record.eventID);
    //   console.log(record.eventName);
    //   console.log('DynamoDB Record: %j', record.dynamodb);
    // }
    // return Promise.resolve('Successfully processed DynamoDB record');
};
