/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser {
    onCreateUser {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser {
    onUpdateUser {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser {
    onDeleteUser {
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
export const onCreateWallet = /* GraphQL */ `
  subscription OnCreateWallet {
    onCreateWallet {
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
export const onUpdateWallet = /* GraphQL */ `
  subscription OnUpdateWallet {
    onUpdateWallet {
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
export const onDeleteWallet = /* GraphQL */ `
  subscription OnDeleteWallet {
    onDeleteWallet {
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
export const onCreateVerification = /* GraphQL */ `
  subscription OnCreateVerification {
    onCreateVerification {
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
export const onUpdateVerification = /* GraphQL */ `
  subscription OnUpdateVerification {
    onUpdateVerification {
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
export const onDeleteVerification = /* GraphQL */ `
  subscription OnDeleteVerification {
    onDeleteVerification {
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
export const onCreateDocumentType = /* GraphQL */ `
  subscription OnCreateDocumentType {
    onCreateDocumentType {
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
export const onUpdateDocumentType = /* GraphQL */ `
  subscription OnUpdateDocumentType {
    onUpdateDocumentType {
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
export const onDeleteDocumentType = /* GraphQL */ `
  subscription OnDeleteDocumentType {
    onDeleteDocumentType {
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
export const onCreateDocument = /* GraphQL */ `
  subscription OnCreateDocument {
    onCreateDocument {
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
export const onUpdateDocument = /* GraphQL */ `
  subscription OnUpdateDocument {
    onUpdateDocument {
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
export const onDeleteDocument = /* GraphQL */ `
  subscription OnDeleteDocument {
    onDeleteDocument {
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
export const onCreateCategory = /* GraphQL */ `
  subscription OnCreateCategory {
    onCreateCategory {
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
export const onUpdateCategory = /* GraphQL */ `
  subscription OnUpdateCategory {
    onUpdateCategory {
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
export const onDeleteCategory = /* GraphQL */ `
  subscription OnDeleteCategory {
    onDeleteCategory {
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
export const onCreateProduct = /* GraphQL */ `
  subscription OnCreateProduct {
    onCreateProduct {
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
export const onUpdateProduct = /* GraphQL */ `
  subscription OnUpdateProduct {
    onUpdateProduct {
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
export const onDeleteProduct = /* GraphQL */ `
  subscription OnDeleteProduct {
    onDeleteProduct {
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
export const onCreateImage = /* GraphQL */ `
  subscription OnCreateImage {
    onCreateImage {
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
export const onUpdateImage = /* GraphQL */ `
  subscription OnUpdateImage {
    onUpdateImage {
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
export const onDeleteImage = /* GraphQL */ `
  subscription OnDeleteImage {
    onDeleteImage {
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
export const onCreateFeature = /* GraphQL */ `
  subscription OnCreateFeature {
    onCreateFeature {
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
export const onUpdateFeature = /* GraphQL */ `
  subscription OnUpdateFeature {
    onUpdateFeature {
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
export const onDeleteFeature = /* GraphQL */ `
  subscription OnDeleteFeature {
    onDeleteFeature {
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
export const onCreateProductFeature = /* GraphQL */ `
  subscription OnCreateProductFeature {
    onCreateProductFeature {
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
export const onUpdateProductFeature = /* GraphQL */ `
  subscription OnUpdateProductFeature {
    onUpdateProductFeature {
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
export const onDeleteProductFeature = /* GraphQL */ `
  subscription OnDeleteProductFeature {
    onDeleteProductFeature {
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
