/* Amplify Params - DO NOT EDIT
    ENV
    REGION
    API_KIOSUANBCRJSAPP_GRAPHQLAPIIDOUTPUT
    API_KIOSUANBCRJSAPP_GRAPHQLAPIENDPOINTOUTPUT
    API_KIOSUANBCRJSAPP_GRAPHQLAPIKEYOUTPUT
    AUTH_KIOSUANBCRJSAPPA6ACCC93_USERPOOLID
    SES_EMAIL
Amplify Params - DO NOT EDIT */

import { default as fetch, Request } from 'node-fetch';

const GRAPHQL_ENDPOINT = process.env.API_KIOSUANBCRJSAPP_GRAPHQLAPIENDPOINTOUTPUT;
const GRAPHQL_API_KEY = process.env.API_KIOSUANBCRJSAPP_GRAPHQLAPIKEYOUTPUT;

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
export const handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    /** @type {import('node-fetch').RequestInit} */
    const options = {
        method: 'POST',
        headers: {
            'x-api-key': GRAPHQL_API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
    };

    const request = new Request(GRAPHQL_ENDPOINT, options);

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
        statusCode,
        body: JSON.stringify(body)
    };
};