/* Amplify Params - DO NOT EDIT
    ENV
    REGION
    API_KIOSUANBCRJSAPP_GRAPHQLAPIIDOUTPUT
    API_KIOSUANBCRJSAPP_GRAPHQLAPIENDPOINTOUTPUT
    API_KIOSUANBCRJSAPP_GRAPHQLAPIKEYOUTPUT
    AUTH_KIOSUANBCRJSAPPA6ACCC93_USERPOOLID
    SES_EMAIL
Amplify Params - DO NOT EDIT */

const fetch = require('node-fetch')

const query = /* GraphQL */ `
  query LIST_PRODUCTS {
    listProducts {
      items {
        id
        name
        status
      }
    }
  }
`;


/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);


    const options = {
        method: 'POST',
        headers: {
            'x-api-key': process.env.API_KIOSUANBCRJSAPP_GRAPHQLAPIKEYOUTPUT,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
    };

    const request = new Request(process.env.API_KIOSUANBCRJSAPP_GRAPHQLAPIENDPOINTOUTPUT, options);

    let statusCode = 200;
    let body;
    let response;

    try {
        response = await fetch(request);
        body = await response.json();
        if (body.errors) statusCode = 400;
    } catch (error) {
        statusCode = 400;
        body = {
            errors: [
                {
                    status: response.status,
                    message: error.message,
                    stack: error.stack
                }
            ]
        };
    }

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
