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
      userProducts {
        items {
          id
          isFavorite
          userID
          productID
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
          userID
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
      userProducts {
        items {
          id
          isFavorite
          userID
          productID
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
          userID
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
      userProducts {
        items {
          id
          isFavorite
          userID
          productID
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
          userID
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
        userProducts {
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
        userProducts {
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
        userProducts {
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
        userProducts {
          nextToken
        }
        documents {
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
        userProducts {
          nextToken
        }
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
        order
        isOnMainCard
        productID
        product {
          id
          name
          description
          isActive
          counterNumberOfTimesBuyed
          amountToBuy
          order
          status
          categoryID
          createdAt
          updatedAt
        }
        featureID
        feature {
          id
          name
          description
          isTemplate
          defaultValue
          featureTypeID
          unitOfMeasureID
          createdAt
          updatedAt
        }
        verifications {
          nextToken
        }
        documents {
          nextToken
        }
        productFeatureResults {
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
        userProducts {
          nextToken
        }
        documents {
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
        userProducts {
          nextToken
        }
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
        order
        isOnMainCard
        productID
        product {
          id
          name
          description
          isActive
          counterNumberOfTimesBuyed
          amountToBuy
          order
          status
          categoryID
          createdAt
          updatedAt
        }
        featureID
        feature {
          id
          name
          description
          isTemplate
          defaultValue
          featureTypeID
          unitOfMeasureID
          createdAt
          updatedAt
        }
        verifications {
          nextToken
        }
        documents {
          nextToken
        }
        productFeatureResults {
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
        userProducts {
          nextToken
        }
        documents {
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
        userProducts {
          nextToken
        }
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
        order
        isOnMainCard
        productID
        product {
          id
          name
          description
          isActive
          counterNumberOfTimesBuyed
          amountToBuy
          order
          status
          categoryID
          createdAt
          updatedAt
        }
        featureID
        feature {
          id
          name
          description
          isTemplate
          defaultValue
          featureTypeID
          unitOfMeasureID
          createdAt
          updatedAt
        }
        verifications {
          nextToken
        }
        documents {
          nextToken
        }
        productFeatureResults {
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
          userID
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
          userID
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
          userID
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
        order
        isOnMainCard
        productID
        product {
          id
          name
          description
          isActive
          counterNumberOfTimesBuyed
          amountToBuy
          order
          status
          categoryID
          createdAt
          updatedAt
        }
        featureID
        feature {
          id
          name
          description
          isTemplate
          defaultValue
          featureTypeID
          unitOfMeasureID
          createdAt
          updatedAt
        }
        verifications {
          nextToken
        }
        documents {
          nextToken
        }
        productFeatureResults {
          nextToken
        }
        createdAt
        updatedAt
      }
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
        userProducts {
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
        order
        isOnMainCard
        productID
        product {
          id
          name
          description
          isActive
          counterNumberOfTimesBuyed
          amountToBuy
          order
          status
          categoryID
          createdAt
          updatedAt
        }
        featureID
        feature {
          id
          name
          description
          isTemplate
          defaultValue
          featureTypeID
          unitOfMeasureID
          createdAt
          updatedAt
        }
        verifications {
          nextToken
        }
        documents {
          nextToken
        }
        productFeatureResults {
          nextToken
        }
        createdAt
        updatedAt
      }
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
        userProducts {
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
        order
        isOnMainCard
        productID
        product {
          id
          name
          description
          isActive
          counterNumberOfTimesBuyed
          amountToBuy
          order
          status
          categoryID
          createdAt
          updatedAt
        }
        featureID
        feature {
          id
          name
          description
          isTemplate
          defaultValue
          featureTypeID
          unitOfMeasureID
          createdAt
          updatedAt
        }
        verifications {
          nextToken
        }
        documents {
          nextToken
        }
        productFeatureResults {
          nextToken
        }
        createdAt
        updatedAt
      }
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
        userProducts {
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
          status
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
          status
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
          status
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
      status
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
          order
          isOnMainCard
          productID
          featureID
          createdAt
          updatedAt
        }
        nextToken
      }
      userProducts {
        items {
          id
          isFavorite
          userID
          productID
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
      status
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
          order
          isOnMainCard
          productID
          featureID
          createdAt
          updatedAt
        }
        nextToken
      }
      userProducts {
        items {
          id
          isFavorite
          userID
          productID
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
      status
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
          order
          isOnMainCard
          productID
          featureID
          createdAt
          updatedAt
        }
        nextToken
      }
      userProducts {
        items {
          id
          isFavorite
          userID
          productID
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
        status
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
        userProducts {
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
        status
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
        userProducts {
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
        status
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
        userProducts {
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
export const createFeatureType = /* GraphQL */ `
  mutation CreateFeatureType(
    $input: CreateFeatureTypeInput!
    $condition: ModelFeatureTypeConditionInput
  ) {
    createFeatureType(input: $input, condition: $condition) {
      id
      name
      description
      features {
        items {
          id
          name
          description
          isTemplate
          defaultValue
          featureTypeID
          unitOfMeasureID
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
export const updateFeatureType = /* GraphQL */ `
  mutation UpdateFeatureType(
    $input: UpdateFeatureTypeInput!
    $condition: ModelFeatureTypeConditionInput
  ) {
    updateFeatureType(input: $input, condition: $condition) {
      id
      name
      description
      features {
        items {
          id
          name
          description
          isTemplate
          defaultValue
          featureTypeID
          unitOfMeasureID
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
export const deleteFeatureType = /* GraphQL */ `
  mutation DeleteFeatureType(
    $input: DeleteFeatureTypeInput!
    $condition: ModelFeatureTypeConditionInput
  ) {
    deleteFeatureType(input: $input, condition: $condition) {
      id
      name
      description
      features {
        items {
          id
          name
          description
          isTemplate
          defaultValue
          featureTypeID
          unitOfMeasureID
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
export const createFeature = /* GraphQL */ `
  mutation CreateFeature(
    $input: CreateFeatureInput!
    $condition: ModelFeatureConditionInput
  ) {
    createFeature(input: $input, condition: $condition) {
      id
      name
      description
      isTemplate
      defaultValue
      featureTypeID
      featureType {
        id
        name
        description
        features {
          nextToken
        }
        createdAt
        updatedAt
      }
      unitOfMeasureID
      unitOfMeasure {
        id
        engineeringUnit
        description
        isFloat
        features {
          nextToken
        }
        formulas {
          nextToken
        }
        createdAt
        updatedAt
      }
      productFeatures {
        items {
          id
          value
          isToBlockChain
          isVerifable
          order
          isOnMainCard
          productID
          featureID
          createdAt
          updatedAt
        }
        nextToken
      }
      featureFormulas {
        items {
          id
          featureID
          formulaID
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
      isTemplate
      defaultValue
      featureTypeID
      featureType {
        id
        name
        description
        features {
          nextToken
        }
        createdAt
        updatedAt
      }
      unitOfMeasureID
      unitOfMeasure {
        id
        engineeringUnit
        description
        isFloat
        features {
          nextToken
        }
        formulas {
          nextToken
        }
        createdAt
        updatedAt
      }
      productFeatures {
        items {
          id
          value
          isToBlockChain
          isVerifable
          order
          isOnMainCard
          productID
          featureID
          createdAt
          updatedAt
        }
        nextToken
      }
      featureFormulas {
        items {
          id
          featureID
          formulaID
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
      isTemplate
      defaultValue
      featureTypeID
      featureType {
        id
        name
        description
        features {
          nextToken
        }
        createdAt
        updatedAt
      }
      unitOfMeasureID
      unitOfMeasure {
        id
        engineeringUnit
        description
        isFloat
        features {
          nextToken
        }
        formulas {
          nextToken
        }
        createdAt
        updatedAt
      }
      productFeatures {
        items {
          id
          value
          isToBlockChain
          isVerifable
          order
          isOnMainCard
          productID
          featureID
          createdAt
          updatedAt
        }
        nextToken
      }
      featureFormulas {
        items {
          id
          featureID
          formulaID
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
export const createUnitOfMeasure = /* GraphQL */ `
  mutation CreateUnitOfMeasure(
    $input: CreateUnitOfMeasureInput!
    $condition: ModelUnitOfMeasureConditionInput
  ) {
    createUnitOfMeasure(input: $input, condition: $condition) {
      id
      engineeringUnit
      description
      isFloat
      features {
        items {
          id
          name
          description
          isTemplate
          defaultValue
          featureTypeID
          unitOfMeasureID
          createdAt
          updatedAt
        }
        nextToken
      }
      formulas {
        items {
          id
          varID
          equation
          unitOfMeasureID
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
export const updateUnitOfMeasure = /* GraphQL */ `
  mutation UpdateUnitOfMeasure(
    $input: UpdateUnitOfMeasureInput!
    $condition: ModelUnitOfMeasureConditionInput
  ) {
    updateUnitOfMeasure(input: $input, condition: $condition) {
      id
      engineeringUnit
      description
      isFloat
      features {
        items {
          id
          name
          description
          isTemplate
          defaultValue
          featureTypeID
          unitOfMeasureID
          createdAt
          updatedAt
        }
        nextToken
      }
      formulas {
        items {
          id
          varID
          equation
          unitOfMeasureID
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
export const deleteUnitOfMeasure = /* GraphQL */ `
  mutation DeleteUnitOfMeasure(
    $input: DeleteUnitOfMeasureInput!
    $condition: ModelUnitOfMeasureConditionInput
  ) {
    deleteUnitOfMeasure(input: $input, condition: $condition) {
      id
      engineeringUnit
      description
      isFloat
      features {
        items {
          id
          name
          description
          isTemplate
          defaultValue
          featureTypeID
          unitOfMeasureID
          createdAt
          updatedAt
        }
        nextToken
      }
      formulas {
        items {
          id
          varID
          equation
          unitOfMeasureID
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
export const createFormula = /* GraphQL */ `
  mutation CreateFormula(
    $input: CreateFormulaInput!
    $condition: ModelFormulaConditionInput
  ) {
    createFormula(input: $input, condition: $condition) {
      id
      varID
      equation
      unitOfMeasureID
      unitOfMeasure {
        id
        engineeringUnit
        description
        isFloat
        features {
          nextToken
        }
        formulas {
          nextToken
        }
        createdAt
        updatedAt
      }
      results {
        items {
          id
          varID
          value
          formulaID
          createdAt
          updatedAt
        }
        nextToken
      }
      featureFormulas {
        items {
          id
          featureID
          formulaID
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
export const updateFormula = /* GraphQL */ `
  mutation UpdateFormula(
    $input: UpdateFormulaInput!
    $condition: ModelFormulaConditionInput
  ) {
    updateFormula(input: $input, condition: $condition) {
      id
      varID
      equation
      unitOfMeasureID
      unitOfMeasure {
        id
        engineeringUnit
        description
        isFloat
        features {
          nextToken
        }
        formulas {
          nextToken
        }
        createdAt
        updatedAt
      }
      results {
        items {
          id
          varID
          value
          formulaID
          createdAt
          updatedAt
        }
        nextToken
      }
      featureFormulas {
        items {
          id
          featureID
          formulaID
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
export const deleteFormula = /* GraphQL */ `
  mutation DeleteFormula(
    $input: DeleteFormulaInput!
    $condition: ModelFormulaConditionInput
  ) {
    deleteFormula(input: $input, condition: $condition) {
      id
      varID
      equation
      unitOfMeasureID
      unitOfMeasure {
        id
        engineeringUnit
        description
        isFloat
        features {
          nextToken
        }
        formulas {
          nextToken
        }
        createdAt
        updatedAt
      }
      results {
        items {
          id
          varID
          value
          formulaID
          createdAt
          updatedAt
        }
        nextToken
      }
      featureFormulas {
        items {
          id
          featureID
          formulaID
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
export const createFeatureFormula = /* GraphQL */ `
  mutation CreateFeatureFormula(
    $input: CreateFeatureFormulaInput!
    $condition: ModelFeatureFormulaConditionInput
  ) {
    createFeatureFormula(input: $input, condition: $condition) {
      id
      featureID
      feature {
        id
        name
        description
        isTemplate
        defaultValue
        featureTypeID
        featureType {
          id
          name
          description
          createdAt
          updatedAt
        }
        unitOfMeasureID
        unitOfMeasure {
          id
          engineeringUnit
          description
          isFloat
          createdAt
          updatedAt
        }
        productFeatures {
          nextToken
        }
        featureFormulas {
          nextToken
        }
        createdAt
        updatedAt
      }
      formulaID
      formula {
        id
        varID
        equation
        unitOfMeasureID
        unitOfMeasure {
          id
          engineeringUnit
          description
          isFloat
          createdAt
          updatedAt
        }
        results {
          nextToken
        }
        featureFormulas {
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
export const updateFeatureFormula = /* GraphQL */ `
  mutation UpdateFeatureFormula(
    $input: UpdateFeatureFormulaInput!
    $condition: ModelFeatureFormulaConditionInput
  ) {
    updateFeatureFormula(input: $input, condition: $condition) {
      id
      featureID
      feature {
        id
        name
        description
        isTemplate
        defaultValue
        featureTypeID
        featureType {
          id
          name
          description
          createdAt
          updatedAt
        }
        unitOfMeasureID
        unitOfMeasure {
          id
          engineeringUnit
          description
          isFloat
          createdAt
          updatedAt
        }
        productFeatures {
          nextToken
        }
        featureFormulas {
          nextToken
        }
        createdAt
        updatedAt
      }
      formulaID
      formula {
        id
        varID
        equation
        unitOfMeasureID
        unitOfMeasure {
          id
          engineeringUnit
          description
          isFloat
          createdAt
          updatedAt
        }
        results {
          nextToken
        }
        featureFormulas {
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
export const deleteFeatureFormula = /* GraphQL */ `
  mutation DeleteFeatureFormula(
    $input: DeleteFeatureFormulaInput!
    $condition: ModelFeatureFormulaConditionInput
  ) {
    deleteFeatureFormula(input: $input, condition: $condition) {
      id
      featureID
      feature {
        id
        name
        description
        isTemplate
        defaultValue
        featureTypeID
        featureType {
          id
          name
          description
          createdAt
          updatedAt
        }
        unitOfMeasureID
        unitOfMeasure {
          id
          engineeringUnit
          description
          isFloat
          createdAt
          updatedAt
        }
        productFeatures {
          nextToken
        }
        featureFormulas {
          nextToken
        }
        createdAt
        updatedAt
      }
      formulaID
      formula {
        id
        varID
        equation
        unitOfMeasureID
        unitOfMeasure {
          id
          engineeringUnit
          description
          isFloat
          createdAt
          updatedAt
        }
        results {
          nextToken
        }
        featureFormulas {
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
export const createResult = /* GraphQL */ `
  mutation CreateResult(
    $input: CreateResultInput!
    $condition: ModelResultConditionInput
  ) {
    createResult(input: $input, condition: $condition) {
      id
      varID
      value
      formulaID
      formula {
        id
        varID
        equation
        unitOfMeasureID
        unitOfMeasure {
          id
          engineeringUnit
          description
          isFloat
          createdAt
          updatedAt
        }
        results {
          nextToken
        }
        featureFormulas {
          nextToken
        }
        createdAt
        updatedAt
      }
      productFeatureResults {
        items {
          id
          isActive
          productFeatureID
          resultID
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
export const updateResult = /* GraphQL */ `
  mutation UpdateResult(
    $input: UpdateResultInput!
    $condition: ModelResultConditionInput
  ) {
    updateResult(input: $input, condition: $condition) {
      id
      varID
      value
      formulaID
      formula {
        id
        varID
        equation
        unitOfMeasureID
        unitOfMeasure {
          id
          engineeringUnit
          description
          isFloat
          createdAt
          updatedAt
        }
        results {
          nextToken
        }
        featureFormulas {
          nextToken
        }
        createdAt
        updatedAt
      }
      productFeatureResults {
        items {
          id
          isActive
          productFeatureID
          resultID
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
export const deleteResult = /* GraphQL */ `
  mutation DeleteResult(
    $input: DeleteResultInput!
    $condition: ModelResultConditionInput
  ) {
    deleteResult(input: $input, condition: $condition) {
      id
      varID
      value
      formulaID
      formula {
        id
        varID
        equation
        unitOfMeasureID
        unitOfMeasure {
          id
          engineeringUnit
          description
          isFloat
          createdAt
          updatedAt
        }
        results {
          nextToken
        }
        featureFormulas {
          nextToken
        }
        createdAt
        updatedAt
      }
      productFeatureResults {
        items {
          id
          isActive
          productFeatureID
          resultID
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
      order
      isOnMainCard
      productID
      product {
        id
        name
        description
        isActive
        counterNumberOfTimesBuyed
        amountToBuy
        order
        status
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
        userProducts {
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
        isTemplate
        defaultValue
        featureTypeID
        featureType {
          id
          name
          description
          createdAt
          updatedAt
        }
        unitOfMeasureID
        unitOfMeasure {
          id
          engineeringUnit
          description
          isFloat
          createdAt
          updatedAt
        }
        productFeatures {
          nextToken
        }
        featureFormulas {
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
          userID
          createdAt
          updatedAt
        }
        nextToken
      }
      productFeatureResults {
        items {
          id
          isActive
          productFeatureID
          resultID
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
      order
      isOnMainCard
      productID
      product {
        id
        name
        description
        isActive
        counterNumberOfTimesBuyed
        amountToBuy
        order
        status
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
        userProducts {
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
        isTemplate
        defaultValue
        featureTypeID
        featureType {
          id
          name
          description
          createdAt
          updatedAt
        }
        unitOfMeasureID
        unitOfMeasure {
          id
          engineeringUnit
          description
          isFloat
          createdAt
          updatedAt
        }
        productFeatures {
          nextToken
        }
        featureFormulas {
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
          userID
          createdAt
          updatedAt
        }
        nextToken
      }
      productFeatureResults {
        items {
          id
          isActive
          productFeatureID
          resultID
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
      order
      isOnMainCard
      productID
      product {
        id
        name
        description
        isActive
        counterNumberOfTimesBuyed
        amountToBuy
        order
        status
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
        userProducts {
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
        isTemplate
        defaultValue
        featureTypeID
        featureType {
          id
          name
          description
          createdAt
          updatedAt
        }
        unitOfMeasureID
        unitOfMeasure {
          id
          engineeringUnit
          description
          isFloat
          createdAt
          updatedAt
        }
        productFeatures {
          nextToken
        }
        featureFormulas {
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
          userID
          createdAt
          updatedAt
        }
        nextToken
      }
      productFeatureResults {
        items {
          id
          isActive
          productFeatureID
          resultID
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
export const createProductFeatureResult = /* GraphQL */ `
  mutation CreateProductFeatureResult(
    $input: CreateProductFeatureResultInput!
    $condition: ModelProductFeatureResultConditionInput
  ) {
    createProductFeatureResult(input: $input, condition: $condition) {
      id
      isActive
      productFeatureID
      productFeature {
        id
        value
        isToBlockChain
        isVerifable
        order
        isOnMainCard
        productID
        product {
          id
          name
          description
          isActive
          counterNumberOfTimesBuyed
          amountToBuy
          order
          status
          categoryID
          createdAt
          updatedAt
        }
        featureID
        feature {
          id
          name
          description
          isTemplate
          defaultValue
          featureTypeID
          unitOfMeasureID
          createdAt
          updatedAt
        }
        verifications {
          nextToken
        }
        documents {
          nextToken
        }
        productFeatureResults {
          nextToken
        }
        createdAt
        updatedAt
      }
      resultID
      result {
        id
        varID
        value
        formulaID
        formula {
          id
          varID
          equation
          unitOfMeasureID
          createdAt
          updatedAt
        }
        productFeatureResults {
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
export const updateProductFeatureResult = /* GraphQL */ `
  mutation UpdateProductFeatureResult(
    $input: UpdateProductFeatureResultInput!
    $condition: ModelProductFeatureResultConditionInput
  ) {
    updateProductFeatureResult(input: $input, condition: $condition) {
      id
      isActive
      productFeatureID
      productFeature {
        id
        value
        isToBlockChain
        isVerifable
        order
        isOnMainCard
        productID
        product {
          id
          name
          description
          isActive
          counterNumberOfTimesBuyed
          amountToBuy
          order
          status
          categoryID
          createdAt
          updatedAt
        }
        featureID
        feature {
          id
          name
          description
          isTemplate
          defaultValue
          featureTypeID
          unitOfMeasureID
          createdAt
          updatedAt
        }
        verifications {
          nextToken
        }
        documents {
          nextToken
        }
        productFeatureResults {
          nextToken
        }
        createdAt
        updatedAt
      }
      resultID
      result {
        id
        varID
        value
        formulaID
        formula {
          id
          varID
          equation
          unitOfMeasureID
          createdAt
          updatedAt
        }
        productFeatureResults {
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
export const deleteProductFeatureResult = /* GraphQL */ `
  mutation DeleteProductFeatureResult(
    $input: DeleteProductFeatureResultInput!
    $condition: ModelProductFeatureResultConditionInput
  ) {
    deleteProductFeatureResult(input: $input, condition: $condition) {
      id
      isActive
      productFeatureID
      productFeature {
        id
        value
        isToBlockChain
        isVerifable
        order
        isOnMainCard
        productID
        product {
          id
          name
          description
          isActive
          counterNumberOfTimesBuyed
          amountToBuy
          order
          status
          categoryID
          createdAt
          updatedAt
        }
        featureID
        feature {
          id
          name
          description
          isTemplate
          defaultValue
          featureTypeID
          unitOfMeasureID
          createdAt
          updatedAt
        }
        verifications {
          nextToken
        }
        documents {
          nextToken
        }
        productFeatureResults {
          nextToken
        }
        createdAt
        updatedAt
      }
      resultID
      result {
        id
        varID
        value
        formulaID
        formula {
          id
          varID
          equation
          unitOfMeasureID
          createdAt
          updatedAt
        }
        productFeatureResults {
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
export const createUserProduct = /* GraphQL */ `
  mutation CreateUserProduct(
    $input: CreateUserProductInput!
    $condition: ModelUserProductConditionInput
  ) {
    createUserProduct(input: $input, condition: $condition) {
      id
      isFavorite
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
        userProducts {
          nextToken
        }
        documents {
          nextToken
        }
        createdAt
        updatedAt
      }
      productID
      product {
        id
        name
        description
        isActive
        counterNumberOfTimesBuyed
        amountToBuy
        order
        status
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
        userProducts {
          nextToken
        }
        createdAt
        updatedAt
      }
      orders {
        items {
          id
          amountOfTokens
          currencyCode
          fiatTotalAmount
          statusCode
          externalOrderId
          confirmation
          userProductID
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
export const updateUserProduct = /* GraphQL */ `
  mutation UpdateUserProduct(
    $input: UpdateUserProductInput!
    $condition: ModelUserProductConditionInput
  ) {
    updateUserProduct(input: $input, condition: $condition) {
      id
      isFavorite
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
        userProducts {
          nextToken
        }
        documents {
          nextToken
        }
        createdAt
        updatedAt
      }
      productID
      product {
        id
        name
        description
        isActive
        counterNumberOfTimesBuyed
        amountToBuy
        order
        status
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
        userProducts {
          nextToken
        }
        createdAt
        updatedAt
      }
      orders {
        items {
          id
          amountOfTokens
          currencyCode
          fiatTotalAmount
          statusCode
          externalOrderId
          confirmation
          userProductID
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
export const deleteUserProduct = /* GraphQL */ `
  mutation DeleteUserProduct(
    $input: DeleteUserProductInput!
    $condition: ModelUserProductConditionInput
  ) {
    deleteUserProduct(input: $input, condition: $condition) {
      id
      isFavorite
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
        userProducts {
          nextToken
        }
        documents {
          nextToken
        }
        createdAt
        updatedAt
      }
      productID
      product {
        id
        name
        description
        isActive
        counterNumberOfTimesBuyed
        amountToBuy
        order
        status
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
        userProducts {
          nextToken
        }
        createdAt
        updatedAt
      }
      orders {
        items {
          id
          amountOfTokens
          currencyCode
          fiatTotalAmount
          statusCode
          externalOrderId
          confirmation
          userProductID
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
export const createOrder = /* GraphQL */ `
  mutation CreateOrder(
    $input: CreateOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    createOrder(input: $input, condition: $condition) {
      id
      amountOfTokens
      currencyCode
      fiatTotalAmount
      statusCode
      externalOrderId
      confirmation
      userProductID
      userProduct {
        id
        isFavorite
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
        productID
        product {
          id
          name
          description
          isActive
          counterNumberOfTimesBuyed
          amountToBuy
          order
          status
          categoryID
          createdAt
          updatedAt
        }
        orders {
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
export const updateOrder = /* GraphQL */ `
  mutation UpdateOrder(
    $input: UpdateOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    updateOrder(input: $input, condition: $condition) {
      id
      amountOfTokens
      currencyCode
      fiatTotalAmount
      statusCode
      externalOrderId
      confirmation
      userProductID
      userProduct {
        id
        isFavorite
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
        productID
        product {
          id
          name
          description
          isActive
          counterNumberOfTimesBuyed
          amountToBuy
          order
          status
          categoryID
          createdAt
          updatedAt
        }
        orders {
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
export const deleteOrder = /* GraphQL */ `
  mutation DeleteOrder(
    $input: DeleteOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    deleteOrder(input: $input, condition: $condition) {
      id
      amountOfTokens
      currencyCode
      fiatTotalAmount
      statusCode
      externalOrderId
      confirmation
      userProductID
      userProduct {
        id
        isFavorite
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
        productID
        product {
          id
          name
          description
          isActive
          counterNumberOfTimesBuyed
          amountToBuy
          order
          status
          categoryID
          createdAt
          updatedAt
        }
        orders {
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
