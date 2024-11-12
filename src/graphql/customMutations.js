
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
    images
  }
}`