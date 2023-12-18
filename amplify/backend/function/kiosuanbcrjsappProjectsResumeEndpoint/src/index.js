/* Amplify Params - DO NOT EDIT
	API_KIOSUANBCRJSAPP_GRAPHQLAPIENDPOINTOUTPUT
	API_KIOSUANBCRJSAPP_GRAPHQLAPIIDOUTPUT
	API_KIOSUANBCRJSAPP_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */
//import { listProducts } from "./customQueries.js";
//import { mapProjectsData } from "./mapProjectsData.js";
const { Request } = require("node-fetch");
const fetch = require("node-fetch");
const { listProducts } = require("./lib/customQueries.js");
const { mapProjectsData } = require("./lib/mapProjectsData.js");

const GRAPHQL_ENDPOINT =
  process.env.API_KIOSUANBCRJSAPP_GRAPHQLAPIENDPOINTOUTPUT;
const GRAPHQL_API_KEY = process.env.API_KIOSUANBCRJSAPP_GRAPHQLAPIKEYOUTPUT;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  const options = {
    method: "POST",
    headers: {
      "x-api-key": GRAPHQL_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: listProducts }),
  };

  const request = new Request(GRAPHQL_ENDPOINT, options);

  let statusCode = 200;
  let body;
  let response;
  let mappedResponse;

  try {
    response = await fetch(request);
    body = await response.json();
    mappedResponse = await mapProjectsData(body.data.listProducts.items);
    console.log(mappedResponse)
    if (body.errors) statusCode = 400;
  } catch (error) {
    statusCode = 400;
    body = {
      errors: [
        {
          status: response.status,
          message: error.message,
          stack: error.stack,
        },
      ],
    };
  }

  return {
    statusCode,
    body: JSON.stringify(mappedResponse),
  };
};
