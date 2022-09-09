/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
      verifierVerifications {
        items {
          id
          createdOn
          updatedOn
          sign
          userVerifierID
          userVerifiedID
          productFeatureID
          createdAt
          updatedAt
        }
        nextToken
      }
      verifiedVerifications {
        items {
          id
          createdOn
          updatedOn
          sign
          userVerifierID
          userVerifiedID
          productFeatureID
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
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        dateOfBirth
        isProfileUpdated
        addresss
        cellphone
        role
        wallets {
          nextToken
        }
        verifierVerifications {
          nextToken
        }
        verifiedVerifications {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getWallet = /* GraphQL */ `
  query GetWallet($id: ID!) {
    getWallet(id: $id) {
      id
      name
      status
      isSelected
      userID
      user {
        id
        name
        dateOfBirth
        isProfileUpdated
        addresss
        cellphone
        role
        wallets {
          nextToken
        }
        verifierVerifications {
          nextToken
        }
        verifiedVerifications {
          nextToken
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const listWallets = /* GraphQL */ `
  query ListWallets(
    $filter: ModelWalletFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listWallets(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        status
        isSelected
        userID
        user {
          id
          name
          dateOfBirth
          isProfileUpdated
          addresss
          cellphone
          role
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getVerification = /* GraphQL */ `
  query GetVerification($id: ID!) {
    getVerification(id: $id) {
      id
      createdOn
      updatedOn
      sign
      userVerifierID
      userVerifier {
        id
        name
        dateOfBirth
        isProfileUpdated
        addresss
        cellphone
        role
        wallets {
          nextToken
        }
        verifierVerifications {
          nextToken
        }
        verifiedVerifications {
          nextToken
        }
        createdAt
        updatedAt
      }
      userVerifiedID
      userVerified {
        id
        name
        dateOfBirth
        isProfileUpdated
        addresss
        cellphone
        role
        wallets {
          nextToken
        }
        verifierVerifications {
          nextToken
        }
        verifiedVerifications {
          nextToken
        }
        createdAt
        updatedAt
      }
      productFeatureID
      productFeature {
        id
        value
        isToBlockChain
        isVerifable
        productID
        product {
          id
          name
          description
          isActive
          counterNumberOfTimesBuyed
          amountToBuy
          order
          categoryID
          createdAt
          updatedAt
        }
        featureID
        feature {
          id
          name
          description
          order
          isTemplate
          createdAt
          updatedAt
        }
        verifications {
          nextToken
        }
        documents {
          nextToken
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const listVerifications = /* GraphQL */ `
  query ListVerifications(
    $filter: ModelVerificationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listVerifications(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        createdOn
        updatedOn
        sign
        userVerifierID
        userVerifier {
          id
          name
          dateOfBirth
          isProfileUpdated
          addresss
          cellphone
          role
          createdAt
          updatedAt
        }
        userVerifiedID
        userVerified {
          id
          name
          dateOfBirth
          isProfileUpdated
          addresss
          cellphone
          role
          createdAt
          updatedAt
        }
        productFeatureID
        productFeature {
          id
          value
          isToBlockChain
          isVerifable
          productID
          featureID
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getDocumentType = /* GraphQL */ `
  query GetDocumentType($id: ID!) {
    getDocumentType(id: $id) {
      id
      name
      description
      documents {
        items {
          id
          data
          timeStamp
          hash
          url
          signed
          isApproved
          status
          isUploadedToBlockChain
          documentTypeID
          productFeatureID
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
export const listDocumentTypes = /* GraphQL */ `
  query ListDocumentTypes(
    $filter: ModelDocumentTypeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDocumentTypes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        documents {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getDocument = /* GraphQL */ `
  query GetDocument($id: ID!) {
    getDocument(id: $id) {
      id
      data
      timeStamp
      hash
      url
      signed
      isApproved
      status
      isUploadedToBlockChain
      documentTypeID
      documentType {
        id
        name
        description
        documents {
          nextToken
        }
        createdAt
        updatedAt
      }
      productFeatureID
      productFeature {
        id
        value
        isToBlockChain
        isVerifable
        productID
        product {
          id
          name
          description
          isActive
          counterNumberOfTimesBuyed
          amountToBuy
          order
          categoryID
          createdAt
          updatedAt
        }
        featureID
        feature {
          id
          name
          description
          order
          isTemplate
          createdAt
          updatedAt
        }
        verifications {
          nextToken
        }
        documents {
          nextToken
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const listDocuments = /* GraphQL */ `
  query ListDocuments(
    $filter: ModelDocumentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDocuments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        data
        timeStamp
        hash
        url
        signed
        isApproved
        status
        isUploadedToBlockChain
        documentTypeID
        documentType {
          id
          name
          description
          createdAt
          updatedAt
        }
        productFeatureID
        productFeature {
          id
          value
          isToBlockChain
          isVerifable
          productID
          featureID
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getCategory = /* GraphQL */ `
  query GetCategory($id: ID!) {
    getCategory(id: $id) {
      id
      name
      products {
        items {
          id
          name
          description
          isActive
          counterNumberOfTimesBuyed
          amountToBuy
          order
          categoryID
          createdAt
          updatedAt
        }
        nextToken
      }
      isSelected
      createdAt
      updatedAt
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
        products {
          nextToken
        }
        isSelected
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getProduct = /* GraphQL */ `
  query GetProduct($id: ID!) {
    getProduct(id: $id) {
      id
      name
      description
      isActive
      counterNumberOfTimesBuyed
      amountToBuy
      order
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
          isVerifable
          productID
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
        counterNumberOfTimesBuyed
        amountToBuy
        order
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
        }
        productFeatures {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getImage = /* GraphQL */ `
  query GetImage($id: ID!) {
    getImage(id: $id) {
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
      product {
        id
        name
        description
        isActive
        counterNumberOfTimesBuyed
        amountToBuy
        order
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
        }
        productFeatures {
          nextToken
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const listImages = /* GraphQL */ `
  query ListImages(
    $filter: ModelImageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listImages(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
        product {
          id
          name
          description
          isActive
          counterNumberOfTimesBuyed
          amountToBuy
          order
          categoryID
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getFeature = /* GraphQL */ `
  query GetFeature($id: ID!) {
    getFeature(id: $id) {
      id
      name
      description
      order
      isTemplate
      productFeatures {
        items {
          id
          value
          isToBlockChain
          isVerifable
          productID
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
export const listFeatures = /* GraphQL */ `
  query ListFeatures(
    $filter: ModelFeatureFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listFeatures(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        order
        isTemplate
        productFeatures {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getProductFeature = /* GraphQL */ `
  query GetProductFeature($id: ID!) {
    getProductFeature(id: $id) {
      id
      value
      isToBlockChain
      isVerifable
      productID
      product {
        id
        name
        description
        isActive
        counterNumberOfTimesBuyed
        amountToBuy
        order
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
        }
        productFeatures {
          nextToken
        }
        createdAt
        updatedAt
      }
      featureID
      feature {
        id
        name
        description
        order
        isTemplate
        productFeatures {
          nextToken
        }
        createdAt
        updatedAt
      }
      verifications {
        items {
          id
          createdOn
          updatedOn
          sign
          userVerifierID
          userVerifiedID
          productFeatureID
          createdAt
          updatedAt
        }
        nextToken
      }
      documents {
        items {
          id
          data
          timeStamp
          hash
          url
          signed
          isApproved
          status
          isUploadedToBlockChain
          documentTypeID
          productFeatureID
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
export const listProductFeatures = /* GraphQL */ `
  query ListProductFeatures(
    $filter: ModelProductFeatureFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProductFeatures(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        value
        isToBlockChain
        isVerifable
        productID
        product {
          id
          name
          description
          isActive
          counterNumberOfTimesBuyed
          amountToBuy
          order
          categoryID
          createdAt
          updatedAt
        }
        featureID
        feature {
          id
          name
          description
          order
          isTemplate
          createdAt
          updatedAt
        }
        verifications {
          nextToken
        }
        documents {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
