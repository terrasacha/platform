export const onUpdateProperty = /* GraphQL */ `
subscription OnUpdateProperty($filter: ModelSubscriptionPropertyFilterInput) {
  onUpdateProperty(filter: $filter) {
    id
    cadastralNumber
    productID
    campaignID
    status
  }
}
`;