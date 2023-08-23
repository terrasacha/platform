const fetch = require('node-fetch');
const { SESClient, SendTemplatedEmailCommand } = require("@aws-sdk/client-ses");
const ses = new SESClient({ region: "us-east-1" });
const { Request } = fetch;

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT;
const GRAPHQL_API_KEY = process.env.GRAPHQL_API_KEY;
const SES_EMAIL = process.env.SES_EMAIL;

const query = /* GraphQL */ `
  query ListProducts(
    $filter: ModelProductFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProducts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        timeOnVerification
        status
        userProducts {
          items {
            id
            userID
            user {
              name
              email
              role
            }
          }
          nextToken
        }
      }
      nextToken
    }
  }
`;

const queryUpdate = /* GraphQL */ `
  mutation UpdateProduct(
    $input: UpdateProductInput!
    $condition: ModelProductConditionInput
  ) {
    updateProduct(input: $input, condition: $condition) {
      id
      name
      description
      isActive
      counterNumberOfTimesBuyed
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

exports.handler = async (event) => {
  const options = {
    method: 'POST',
    headers: {
      'x-api-key': GRAPHQL_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  };

  const request = new Request(GRAPHQL_ENDPOINT, options);

  let statusCode = 200;
  let body;
  let response;
  let constructorUserEmail = '';
  let listProducts = [];

  try {
    response = await fetch(request);
    body = await response.json();
    console.log(body, 'body');
    listProducts = body.data.listProducts.items;

    let fechaActual = new Date().getTime();

    listProducts = listProducts.filter((p) => p.status === 'on_verification');
    listProducts = listProducts.map((product) => {
      let info = { id: product.id, name: product.name, email: '', case: '', username: '' };

      if (product.timeOnVerification) info.case = '';
      if (product.timeOnVerification < fechaActual) info.case = 'out_of_time';
      if (product.timeOnVerification > fechaActual) info.case = 'still_on_verification';

      product.userProducts.items.map((up) => {
        if (up.user.role === 'constructor'){
          info.email = up.user.email
          info.username = up.user.name
        } ;
      });

      return info;
    });

    if (body.errors) statusCode = 400;
  } catch (error) {
    statusCode = 400;
    console.log(error);
  }

  for (const product of listProducts) {
    if (product.case === '') {
      console.log(`El proyecto ${product.id} no tiene un timeOnVerification`);
    }

    if (product.case === 'out_of_time') {
      const updateVariables = {
        input: {
          id: product.id,
          status: 'rejected',
        },
      };

      let query = queryUpdate;

      const updateOptions = {
        method: 'POST',
        headers: {
          'x-api-key': GRAPHQL_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables: updateVariables }),
      };

      const response = await fetch(GRAPHQL_ENDPOINT, updateOptions);
      const data = await response.json();
      console.log(data);

      if (product.email !== '') {
          const fromMail = SES_EMAIL
          const toMail = [product.email]
          const data3 =  `Su proyecto llamado ${product.name} ha excedido el tiempo límite de verificación, por lo tanto queda rechazado`
          const templateData = {
            data: data3,
            user: product.username
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
    }

    if (product.case === 'still_on_verification' && product.email !== '') {
      console.log('crea los params para enviar el mail');
      const fromMail = SES_EMAIL
          const toMail = [product.email]
          const data3 =   `Aún falta revisar documentación vinculada al proyecto ${product.name}`
          const templateData = {
            data: data3,
            user: product.username
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
  }
};
