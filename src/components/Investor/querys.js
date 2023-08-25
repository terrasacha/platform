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
        order
        status
        timeOnVerification
        categoryID
        category {
          id
          name
          isSelected
          createdAt
          updatedAt
        }
        images {
          nextToken
          items {
            id
            imageURL
            title
            isActive
            isOnCarousel
        }
        }
        productFeatures {
          nextToken
          items {
            id
            featureID
            value
            documents {
              items {
                id
                isApproved
                signed
        }
            }
            feature {
              id
              name
              isVerifable
              isTemplate
              description
              unitOfMeasureID
              unitOfMeasure {
                description
              }
            }
            productFeatureResults {
              items {
                id
                resultID
                isActive
                result {
                  id
                  value
                  varID
                }
              }
            }
            verifications {
              items {
                id
                sign
                userVerifierID
                userVerifiedID
                createdAt
              }
            }
          }
        }
        userProducts {
          items {
            id
          }
        }
        transactions {
          nextToken
        }
        xlsFormProducts {
          nextToken
        }
        companies {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export { queryUserStatus, listProducts }