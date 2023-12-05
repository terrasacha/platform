const listProducts = /* GraphQL */ `
  query ListProducts(
    $filter: ModelProductFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProducts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        isActive
        status
        timeOnVerification
        projectReadiness
        categoryID
        transactions {
          items {
            id
          }
        }
        productFeatures {
          items {
            id
            value
            isToBlockChain
            order
            isOnMainCard
            isResult
            productID
            feature {
              name
              isVerifable
            }
            featureID
          }
          nextToken
        }
      }
    }
  }
`;

module.exports = { listProducts };
