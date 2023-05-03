/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	API_KIOSUANBCRJSAPP_GRAPHQLAPIIDOUTPUT
	API_KIOSUANBCRJSAPP_GRAPHQLAPIENDPOINTOUTPUT
	API_KIOSUANBCRJSAPP_GRAPHQLAPIKEYOUTPUT
	AUTH_KIOSUANBCRJSAPPA6ACCC93_USERPOOLID
	SES_EMAIL
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    return {
        statusCode: 200,
    //  Uncomment below to enable CORS requests
    //  headers: {
    //      "Access-Control-Allow-Origin": "*",
    //      "Access-Control-Allow-Headers": "*"
    //  }, 
        body: JSON.stringify('Hello from Lambda!'),
    };
};
