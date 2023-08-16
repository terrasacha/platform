
const fetch = require('node-fetch');
const { SESClient, SendTemplatedEmailCommand } = require("@aws-sdk/client-ses");
const ses = new SESClient({ region: "us-east-1" });
const { Request } = fetch

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT;
const GRAPHQL_API_KEY = process.env.GRAPHQL_API_KEY;
const SES_EMAIL = process.env.SES_EMAIL

const query = /* GraphQL */ `
query GetProduct($id: ID!) {
    getProduct(id: $id) {
      id
      name
      status
      userProducts {
        items {
          id
          userID
          user{
            name
            email
            role
          }
        }
        nextToken
      }
    }
  }
`;
const queryUpdate = `
      mutation UpdateProduct(
        $input: UpdateProductInput!
        $condition: ModelProductConditionInput
      ) {
        updateProduct(input: $input, condition: $condition) {
          id
          name
          description
          isActive
          order
          status
          categoryID
          category {
            id
            name
            products {
              nextToken
            }
            isSelected
            createdAt
            updatedAt
          }
          images {
            items {
              id
              imageURL
              format
              title
              imageURLToDisplay
              isOnCarousel
              carouselLabel
              carouselDescription
              isActive
              order
              productID
              createdAt
              updatedAt
            }
            nextToken
          }
          productFeatures {
            items {
              id
              value
              isToBlockChain
              order
              isOnMainCard
              productID
              featureID
              createdAt
              updatedAt
            }
            nextToken
          }
          userProducts {
            items {
              id
              isFavorite
              userID
              productID
              createdAt
              updatedAt
            }
            nextToken
          }
          transactions {
            items {
              id
              addressOrigin
              addressDestination
              txIn
              txCborhex
              txHash
              metadataUrl
              fees
              network
              txProcessed
              type
              productID
              createdAt
              updatedAt
            }
            nextToken
          }
          createdAt
          updatedAt
        }
      }
    `;
/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async(event) => {
  for (const record of event.Records) {
    /* console.log(record.eventID);
    console.log(record.eventName); */
    /* console.log('DynamoDB Record: %j', record.dynamodb); */
    
    if (record.eventName === 'MODIFY') {
      let newImage = record.dynamodb.NewImage;
      let oldImage = record.dynamodb.OldImage;
      let productID = record.dynamodb.NewImage.id.S
      console.log(`${oldImage.status.S} a ${newImage.status.S}`)

      if(oldImage.status.S !== newImage.status.S){
        if(newImage.status.S === 'on_verification'){
          let futureDate = new Date();
          futureDate.setMonth(futureDate.getMonth() + 3);
          let futureDateTimestamp = futureDate.getTime();
          const variables = {
            input: {
              id: productID,
              timeOnVerification: futureDateTimestamp
            }
          };
          let query = queryUpdate
          const options = {
            method: 'POST',
            headers: {
              'x-api-key': GRAPHQL_API_KEY,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query, variables })
          };
          const response = await fetch(GRAPHQL_ENDPOINT, options);
      const data = await response.json();

      if (response.ok) {
        console.log('Response:', data);
      } else {
        console.log('Error:', data);
      }
        }
        const variables = { id: productID };
        /** @type {import('node-fetch').RequestInit} */
        const options = {
          method: 'POST',
          headers: {
            'x-api-key': GRAPHQL_API_KEY, //GRAPHQL_API_KEY
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query, variables })
        };
        const request = new Request(GRAPHQL_ENDPOINT, options); //GRAPHQL_ENDPOINT
  
        let statusCode = 200;
        let body;
        let response;
        let constructorUserEmail = ''
        let infoProduct = ''
        try {
          response = await fetch(request);
          body = await response.json();
          infoProduct = {name: body.data.getProduct.name, status: body.data.getProduct.status}
          body.data.getProduct.userProducts.items.map(up => {if(up.user.role === 'constructor') constructorUserEmail = {name: up.user.name, email: up.user.email}})
          if (body.errors) statusCode = 400;
        } catch (error) {
          statusCode = 400;
          console.log(error)
        }
        if(constructorUserEmail !== ''){
          const fromMail = SES_EMAIL
          const toMail = [constructorUserEmail.email]
          const data3 = `Ha habido un cambio de estado en su proyecto llamado ${infoProduct.name}. Nuevo estado: ${infoProduct.status}`
          const templateData = {
            data: data3,
            user: constructorUserEmail.name
          };
          try {
            const data = await ses.send(new SendTemplatedEmailCommand({
              Source: fromMail,
              Destination: {
                ToAddresses: toMail,
              },
              Template: "AWS-SES-HTML-Email-Default-Template",
              TemplateData: JSON.stringify(templateData),
            }));
            return { status: 'done', msg: data }
          } catch (error) {
            return { status: 'error', msg: error }
          }
        }
      }else{
        console.log('NO CAMBIO EL STATUS')
      }
    }
  }
};
