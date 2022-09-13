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
      results {
        items {
          id
          varID
          equation
          productID
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
      results {
        items {
          id
          varID
          equation
          productID
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
      results {
        items {
          id
          varID
          equation
          productID
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
        results {
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
        results {
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
        results {
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
export const onCreateFeatureType = /* GraphQL */ `
  subscription OnCreateFeatureType {
    onCreateFeatureType {
      id
      name
      description
      features {
        items {
          id
          name
          description
          order
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
export const onUpdateFeatureType = /* GraphQL */ `
  subscription OnUpdateFeatureType {
    onUpdateFeatureType {
      id
      name
      description
      features {
        items {
          id
          name
          description
          order
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
export const onDeleteFeatureType = /* GraphQL */ `
  subscription OnDeleteFeatureType {
    onDeleteFeatureType {
      id
      name
      description
      features {
        items {
          id
          name
          description
          order
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
export const onCreateFeature = /* GraphQL */ `
  subscription OnCreateFeature {
    onCreateFeature {
      id
      name
      description
      order
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
          productID
          featureID
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
          featureID
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
export const onUpdateFeature = /* GraphQL */ `
  subscription OnUpdateFeature {
    onUpdateFeature {
      id
      name
      description
      order
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
          productID
          featureID
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
          featureID
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
export const onDeleteFeature = /* GraphQL */ `
  subscription OnDeleteFeature {
    onDeleteFeature {
      id
      name
      description
      order
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
          productID
          featureID
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
          featureID
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
export const onCreateUnitOfMeasure = /* GraphQL */ `
  subscription OnCreateUnitOfMeasure {
    onCreateUnitOfMeasure {
      id
      engineeringUnit
      description
      features {
        items {
          id
          name
          description
          order
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
          featureID
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
export const onUpdateUnitOfMeasure = /* GraphQL */ `
  subscription OnUpdateUnitOfMeasure {
    onUpdateUnitOfMeasure {
      id
      engineeringUnit
      description
      features {
        items {
          id
          name
          description
          order
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
          featureID
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
export const onDeleteUnitOfMeasure = /* GraphQL */ `
  subscription OnDeleteUnitOfMeasure {
    onDeleteUnitOfMeasure {
      id
      engineeringUnit
      description
      features {
        items {
          id
          name
          description
          order
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
          featureID
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
export const onCreateFormula = /* GraphQL */ `
  subscription OnCreateFormula {
    onCreateFormula {
      id
      varID
      equation
      featureID
      feature {
        id
        name
        description
        order
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
          createdAt
          updatedAt
        }
        productFeatures {
          nextToken
        }
        formulas {
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
          equation
          productID
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
export const onUpdateFormula = /* GraphQL */ `
  subscription OnUpdateFormula {
    onUpdateFormula {
      id
      varID
      equation
      featureID
      feature {
        id
        name
        description
        order
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
          createdAt
          updatedAt
        }
        productFeatures {
          nextToken
        }
        formulas {
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
          equation
          productID
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
export const onDeleteFormula = /* GraphQL */ `
  subscription OnDeleteFormula {
    onDeleteFormula {
      id
      varID
      equation
      featureID
      feature {
        id
        name
        description
        order
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
          createdAt
          updatedAt
        }
        productFeatures {
          nextToken
        }
        formulas {
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
          equation
          productID
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
export const onCreateResult = /* GraphQL */ `
  subscription OnCreateResult {
    onCreateResult {
      id
      varID
      equation
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
        results {
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
        featureID
        feature {
          id
          name
          description
          order
          isTemplate
          defaultValue
          featureTypeID
          unitOfMeasureID
          createdAt
          updatedAt
        }
        unitOfMeasureID
        unitOfMeasure {
          id
          engineeringUnit
          description
          createdAt
          updatedAt
        }
        results {
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
export const onUpdateResult = /* GraphQL */ `
  subscription OnUpdateResult {
    onUpdateResult {
      id
      varID
      equation
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
        results {
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
        featureID
        feature {
          id
          name
          description
          order
          isTemplate
          defaultValue
          featureTypeID
          unitOfMeasureID
          createdAt
          updatedAt
        }
        unitOfMeasureID
        unitOfMeasure {
          id
          engineeringUnit
          description
          createdAt
          updatedAt
        }
        results {
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
export const onDeleteResult = /* GraphQL */ `
  subscription OnDeleteResult {
    onDeleteResult {
      id
      varID
      equation
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
        results {
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
        featureID
        feature {
          id
          name
          description
          order
          isTemplate
          defaultValue
          featureTypeID
          unitOfMeasureID
          createdAt
          updatedAt
        }
        unitOfMeasureID
        unitOfMeasure {
          id
          engineeringUnit
          description
          createdAt
          updatedAt
        }
        results {
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
        results {
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
          createdAt
          updatedAt
        }
        productFeatures {
          nextToken
        }
        formulas {
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
        results {
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
          createdAt
          updatedAt
        }
        productFeatures {
          nextToken
        }
        formulas {
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
        results {
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
          createdAt
          updatedAt
        }
        productFeatures {
          nextToken
        }
        formulas {
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
