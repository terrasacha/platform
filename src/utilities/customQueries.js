export const getProduct = /* GraphQL */ `
  query GetProduct($id: ID!) {
    getProduct(id: $id) {
      id
      tokenGenesis
      name
      description
      isActive
      order
      status
      showOn
      timeOnVerification
      projectReadiness
      categoryID
      transactions {
        items {
          id
        }
      }
      userProducts {
        items {
          user {
            id
            role
            name
          }
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
      createdAt
      updatedAt
    }
  }
`;

export const listProducts = /* GraphQL */ `
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
        projectReadiness
        categoryID
        userProducts {
          items {
            user {
              id
              role
              name
            }
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
        createdAt
        updatedAt
      }
    }
  }
`;

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      name
      dateOfBirth
      isProfileUpdated
      addresss
      cellphone
      role
      subrole
      status
      email
      wallets {
        items {
          id
          name
          status
          isSelected
          userID
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`;

export const getUserProjects = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      userProducts {
        items {
          product {
            id
            categoryID
            createdAt
            description
            isActive
            name
            order
            projectReadiness
            status
            timeOnVerification
            updatedAt
          }
          isFavorite
        }
      }
    }
  }
`;

export const listCategories = /* GraphQL */ `
  query ListCategories(
    $filter: ModelCategoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCategories(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        isSelected
        products {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const listProductItems = /* GraphQL */ `
  query ListProductItems(
    $filter: ModelProductItemFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProductItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        type
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;

export const getFeature = /* GraphQL */ `
  query GetFeature($id: ID!) {
    getFeature(id: $id) {
      id
      name
      productFeatures {
        items {
          id
          value
          productID
        }
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;

export const getProductItem = /* GraphQL */ `
  query GetProductItem($id: ID!) {
    getProductItem(id: $id) {
      id
      name
      type
      createdAt
      updatedAt
      __typename
    }
  }
`;