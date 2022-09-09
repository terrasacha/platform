/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
export const createWallet = /* GraphQL */ `
  mutation CreateWallet(
    $input: CreateWalletInput!
    $condition: ModelWalletConditionInput
  ) {
    createWallet(input: $input, condition: $condition) {
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
export const updateWallet = /* GraphQL */ `
  mutation UpdateWallet(
    $input: UpdateWalletInput!
    $condition: ModelWalletConditionInput
  ) {
    updateWallet(input: $input, condition: $condition) {
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
export const deleteWallet = /* GraphQL */ `
  mutation DeleteWallet(
    $input: DeleteWalletInput!
    $condition: ModelWalletConditionInput
  ) {
    deleteWallet(input: $input, condition: $condition) {
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
export const createVerification = /* GraphQL */ `
  mutation CreateVerification(
    $input: CreateVerificationInput!
    $condition: ModelVerificationConditionInput
  ) {
    createVerification(input: $input, condition: $condition) {
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
export const updateVerification = /* GraphQL */ `
  mutation UpdateVerification(
    $input: UpdateVerificationInput!
    $condition: ModelVerificationConditionInput
  ) {
    updateVerification(input: $input, condition: $condition) {
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
export const deleteVerification = /* GraphQL */ `
  mutation DeleteVerification(
    $input: DeleteVerificationInput!
    $condition: ModelVerificationConditionInput
  ) {
    deleteVerification(input: $input, condition: $condition) {
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
export const createDocumentType = /* GraphQL */ `
  mutation CreateDocumentType(
    $input: CreateDocumentTypeInput!
    $condition: ModelDocumentTypeConditionInput
  ) {
    createDocumentType(input: $input, condition: $condition) {
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
export const updateDocumentType = /* GraphQL */ `
  mutation UpdateDocumentType(
    $input: UpdateDocumentTypeInput!
    $condition: ModelDocumentTypeConditionInput
  ) {
    updateDocumentType(input: $input, condition: $condition) {
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
export const deleteDocumentType = /* GraphQL */ `
  mutation DeleteDocumentType(
    $input: DeleteDocumentTypeInput!
    $condition: ModelDocumentTypeConditionInput
  ) {
    deleteDocumentType(input: $input, condition: $condition) {
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
export const createDocument = /* GraphQL */ `
  mutation CreateDocument(
    $input: CreateDocumentInput!
    $condition: ModelDocumentConditionInput
  ) {
    createDocument(input: $input, condition: $condition) {
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
export const updateDocument = /* GraphQL */ `
  mutation UpdateDocument(
    $input: UpdateDocumentInput!
    $condition: ModelDocumentConditionInput
  ) {
    updateDocument(input: $input, condition: $condition) {
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
export const deleteDocument = /* GraphQL */ `
  mutation DeleteDocument(
    $input: DeleteDocumentInput!
    $condition: ModelDocumentConditionInput
  ) {
    deleteDocument(input: $input, condition: $condition) {
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
export const createCategory = /* GraphQL */ `
  mutation CreateCategory(
    $input: CreateCategoryInput!
    $condition: ModelCategoryConditionInput
  ) {
    createCategory(input: $input, condition: $condition) {
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
export const updateCategory = /* GraphQL */ `
  mutation UpdateCategory(
    $input: UpdateCategoryInput!
    $condition: ModelCategoryConditionInput
  ) {
    updateCategory(input: $input, condition: $condition) {
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
export const deleteCategory = /* GraphQL */ `
  mutation DeleteCategory(
    $input: DeleteCategoryInput!
    $condition: ModelCategoryConditionInput
  ) {
    deleteCategory(input: $input, condition: $condition) {
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
export const createProduct = /* GraphQL */ `
  mutation CreateProduct(
    $input: CreateProductInput!
    $condition: ModelProductConditionInput
  ) {
    createProduct(input: $input, condition: $condition) {
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
export const updateProduct = /* GraphQL */ `
  mutation UpdateProduct(
    $input: UpdateProductInput!
    $condition: ModelProductConditionInput
  ) {
    updateProduct(input: $input, condition: $condition) {
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
export const deleteProduct = /* GraphQL */ `
  mutation DeleteProduct(
    $input: DeleteProductInput!
    $condition: ModelProductConditionInput
  ) {
    deleteProduct(input: $input, condition: $condition) {
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
export const createImage = /* GraphQL */ `
  mutation CreateImage(
    $input: CreateImageInput!
    $condition: ModelImageConditionInput
  ) {
    createImage(input: $input, condition: $condition) {
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
export const updateImage = /* GraphQL */ `
  mutation UpdateImage(
    $input: UpdateImageInput!
    $condition: ModelImageConditionInput
  ) {
    updateImage(input: $input, condition: $condition) {
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
export const deleteImage = /* GraphQL */ `
  mutation DeleteImage(
    $input: DeleteImageInput!
    $condition: ModelImageConditionInput
  ) {
    deleteImage(input: $input, condition: $condition) {
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
export const createFeature = /* GraphQL */ `
  mutation CreateFeature(
    $input: CreateFeatureInput!
    $condition: ModelFeatureConditionInput
  ) {
    createFeature(input: $input, condition: $condition) {
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
export const updateFeature = /* GraphQL */ `
  mutation UpdateFeature(
    $input: UpdateFeatureInput!
    $condition: ModelFeatureConditionInput
  ) {
    updateFeature(input: $input, condition: $condition) {
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
export const deleteFeature = /* GraphQL */ `
  mutation DeleteFeature(
    $input: DeleteFeatureInput!
    $condition: ModelFeatureConditionInput
  ) {
    deleteFeature(input: $input, condition: $condition) {
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
export const createProductFeature = /* GraphQL */ `
  mutation CreateProductFeature(
    $input: CreateProductFeatureInput!
    $condition: ModelProductFeatureConditionInput
  ) {
    createProductFeature(input: $input, condition: $condition) {
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
export const updateProductFeature = /* GraphQL */ `
  mutation UpdateProductFeature(
    $input: UpdateProductFeatureInput!
    $condition: ModelProductFeatureConditionInput
  ) {
    updateProductFeature(input: $input, condition: $condition) {
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
export const deleteProductFeature = /* GraphQL */ `
  mutation DeleteProductFeature(
    $input: DeleteProductFeatureInput!
    $condition: ModelProductFeatureConditionInput
  ) {
    deleteProductFeature(input: $input, condition: $condition) {
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
