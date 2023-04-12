const queryUserStatus = `query GetProduct($id: ID!, $featureID: ID!) {
    getProduct(id: $id) {
        productFeatures(filter: { featureID: { eq: $featureID } }) {
        items {
          id
          value
        }
      }
    }
  }`

export { queryUserStatus }