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
            verifications {
              items {
                userVerifierID
                userVerifiedID
                verificationComments {
                  items {
                    comment
                    createdAt
                    id
                    isCommentByVerifier
                  }
                }
                userVerified {
                  name
                }
                userVerifier {
                  name
                }
                id
              }
            }
            documents {
              items {
                id
                url
                isApproved
                docHash
                data
                isUploadedToBlockChain
                productFeatureID
                signed
                signedHash
                status
                timeStamp
                userID
              }
            }
            feature {
              name
              isVerifable
            }
            featureID
            createdAt
            updatedAt
          }
          nextToken
        }
      }
    }
  }
`;

module.exports = { listProducts };
