export const createProduct = /* GraphQL */ `
  mutation CreateProduct(
    $input: CreateProductInput!
    $condition: ModelProductConditionInput
  ) {
    createProduct(input: $input, condition: $condition) {
      id
    }
  }
`;
export const createCampaign = /* GraphQL */ `
  mutation createCampaign(
    $input: CreateCampaignInput!
    $condition: ModelCampaignConditionInput
  ) {
    createCampaign(input: $input, condition: $condition) {
      id
      createdAt
    }
  }
`;

export const updateCampaign = `
mutation updateCampaign($input: UpdateCampaignInput!) {
  updateCampaign(input: $input) {
    id
    available
  }
}`

export const updateProperty = `
mutation updateProperty($input: UpdatePropertyInput!) {
  updateProperty(input: $input) {
    id
  }
}`