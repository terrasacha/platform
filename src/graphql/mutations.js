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
      subrole
      status
      email
      wallets {
        items {
          id
          name
          status
          isSelected
          isAdmin
          userID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
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
          __typename
        }
        nextToken
        __typename
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
          __typename
        }
        nextToken
        __typename
      }
      userProducts {
        items {
          id
          isFavorite
          userID
          productID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      documents {
        items {
          id
          data
          timeStamp
          docHash
          url
          signed
          signedHash
          isApproved
          status
          isUploadedToBlockChain
          productFeatureID
          userID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      companies {
        items {
          id
          name
          description
          userID
          productID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
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
      subrole
      status
      email
      wallets {
        items {
          id
          name
          status
          isSelected
          isAdmin
          userID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
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
          __typename
        }
        nextToken
        __typename
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
          __typename
        }
        nextToken
        __typename
      }
      userProducts {
        items {
          id
          isFavorite
          userID
          productID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      documents {
        items {
          id
          data
          timeStamp
          docHash
          url
          signed
          signedHash
          isApproved
          status
          isUploadedToBlockChain
          productFeatureID
          userID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      companies {
        items {
          id
          name
          description
          userID
          productID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
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
      subrole
      status
      email
      wallets {
        items {
          id
          name
          status
          isSelected
          isAdmin
          userID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
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
          __typename
        }
        nextToken
        __typename
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
          __typename
        }
        nextToken
        __typename
      }
      userProducts {
        items {
          id
          isFavorite
          userID
          productID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      documents {
        items {
          id
          data
          timeStamp
          docHash
          url
          signed
          signedHash
          isApproved
          status
          isUploadedToBlockChain
          productFeatureID
          userID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      companies {
        items {
          id
          name
          description
          userID
          productID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
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
      isAdmin
      userID
      user {
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
          nextToken
          __typename
        }
        verifierVerifications {
          nextToken
          __typename
        }
        verifiedVerifications {
          nextToken
          __typename
        }
        userProducts {
          nextToken
          __typename
        }
        documents {
          nextToken
          __typename
        }
        companies {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
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
      isAdmin
      userID
      user {
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
          nextToken
          __typename
        }
        verifierVerifications {
          nextToken
          __typename
        }
        verifiedVerifications {
          nextToken
          __typename
        }
        userProducts {
          nextToken
          __typename
        }
        documents {
          nextToken
          __typename
        }
        companies {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
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
      isAdmin
      userID
      user {
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
          nextToken
          __typename
        }
        verifierVerifications {
          nextToken
          __typename
        }
        verifiedVerifications {
          nextToken
          __typename
        }
        userProducts {
          nextToken
          __typename
        }
        documents {
          nextToken
          __typename
        }
        companies {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
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
        subrole
        status
        email
        wallets {
          nextToken
          __typename
        }
        verifierVerifications {
          nextToken
          __typename
        }
        verifiedVerifications {
          nextToken
          __typename
        }
        userProducts {
          nextToken
          __typename
        }
        documents {
          nextToken
          __typename
        }
        companies {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
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
        subrole
        status
        email
        wallets {
          nextToken
          __typename
        }
        verifierVerifications {
          nextToken
          __typename
        }
        verifiedVerifications {
          nextToken
          __typename
        }
        userProducts {
          nextToken
          __typename
        }
        documents {
          nextToken
          __typename
        }
        companies {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      productFeatureID
      productFeature {
        id
        value
        isToBlockChain
        order
        isOnMainCard
        isResult
        productID
        product {
          id
          name
          description
          isActive
          order
          status
          timeOnVerification
          projectReadiness
          categoryID
          createdAt
          updatedAt
          __typename
        }
        featureID
        feature {
          id
          name
          description
          isTemplate
          isVerifable
          defaultValue
          formOrder
          formHint
          formRequired
          formAppearance
          formRelevant
          formConstraint
          formRequiredMessage
          parentID
          featureTypeID
          unitOfMeasureID
          xlsFormTypeID
          xlsFormGroupID
          createdAt
          updatedAt
          __typename
        }
        verifications {
          nextToken
          __typename
        }
        documents {
          nextToken
          __typename
        }
        productFeatureResults {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      verificationComments {
        items {
          id
          comment
          isCommentByVerifier
          verificationID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
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
        subrole
        status
        email
        wallets {
          nextToken
          __typename
        }
        verifierVerifications {
          nextToken
          __typename
        }
        verifiedVerifications {
          nextToken
          __typename
        }
        userProducts {
          nextToken
          __typename
        }
        documents {
          nextToken
          __typename
        }
        companies {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
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
        subrole
        status
        email
        wallets {
          nextToken
          __typename
        }
        verifierVerifications {
          nextToken
          __typename
        }
        verifiedVerifications {
          nextToken
          __typename
        }
        userProducts {
          nextToken
          __typename
        }
        documents {
          nextToken
          __typename
        }
        companies {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      productFeatureID
      productFeature {
        id
        value
        isToBlockChain
        order
        isOnMainCard
        isResult
        productID
        product {
          id
          name
          description
          isActive
          order
          status
          timeOnVerification
          projectReadiness
          categoryID
          createdAt
          updatedAt
          __typename
        }
        featureID
        feature {
          id
          name
          description
          isTemplate
          isVerifable
          defaultValue
          formOrder
          formHint
          formRequired
          formAppearance
          formRelevant
          formConstraint
          formRequiredMessage
          parentID
          featureTypeID
          unitOfMeasureID
          xlsFormTypeID
          xlsFormGroupID
          createdAt
          updatedAt
          __typename
        }
        verifications {
          nextToken
          __typename
        }
        documents {
          nextToken
          __typename
        }
        productFeatureResults {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      verificationComments {
        items {
          id
          comment
          isCommentByVerifier
          verificationID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
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
        subrole
        status
        email
        wallets {
          nextToken
          __typename
        }
        verifierVerifications {
          nextToken
          __typename
        }
        verifiedVerifications {
          nextToken
          __typename
        }
        userProducts {
          nextToken
          __typename
        }
        documents {
          nextToken
          __typename
        }
        companies {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
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
        subrole
        status
        email
        wallets {
          nextToken
          __typename
        }
        verifierVerifications {
          nextToken
          __typename
        }
        verifiedVerifications {
          nextToken
          __typename
        }
        userProducts {
          nextToken
          __typename
        }
        documents {
          nextToken
          __typename
        }
        companies {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      productFeatureID
      productFeature {
        id
        value
        isToBlockChain
        order
        isOnMainCard
        isResult
        productID
        product {
          id
          name
          description
          isActive
          order
          status
          timeOnVerification
          projectReadiness
          categoryID
          createdAt
          updatedAt
          __typename
        }
        featureID
        feature {
          id
          name
          description
          isTemplate
          isVerifable
          defaultValue
          formOrder
          formHint
          formRequired
          formAppearance
          formRelevant
          formConstraint
          formRequiredMessage
          parentID
          featureTypeID
          unitOfMeasureID
          xlsFormTypeID
          xlsFormGroupID
          createdAt
          updatedAt
          __typename
        }
        verifications {
          nextToken
          __typename
        }
        documents {
          nextToken
          __typename
        }
        productFeatureResults {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      verificationComments {
        items {
          id
          comment
          isCommentByVerifier
          verificationID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createVerificationComment = /* GraphQL */ `
  mutation CreateVerificationComment(
    $input: CreateVerificationCommentInput!
    $condition: ModelVerificationCommentConditionInput
  ) {
    createVerificationComment(input: $input, condition: $condition) {
      id
      comment
      isCommentByVerifier
      verificationID
      verification {
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
          subrole
          status
          email
          createdAt
          updatedAt
          __typename
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
          subrole
          status
          email
          createdAt
          updatedAt
          __typename
        }
        productFeatureID
        productFeature {
          id
          value
          isToBlockChain
          order
          isOnMainCard
          isResult
          productID
          featureID
          createdAt
          updatedAt
          __typename
        }
        verificationComments {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateVerificationComment = /* GraphQL */ `
  mutation UpdateVerificationComment(
    $input: UpdateVerificationCommentInput!
    $condition: ModelVerificationCommentConditionInput
  ) {
    updateVerificationComment(input: $input, condition: $condition) {
      id
      comment
      isCommentByVerifier
      verificationID
      verification {
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
          subrole
          status
          email
          createdAt
          updatedAt
          __typename
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
          subrole
          status
          email
          createdAt
          updatedAt
          __typename
        }
        productFeatureID
        productFeature {
          id
          value
          isToBlockChain
          order
          isOnMainCard
          isResult
          productID
          featureID
          createdAt
          updatedAt
          __typename
        }
        verificationComments {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteVerificationComment = /* GraphQL */ `
  mutation DeleteVerificationComment(
    $input: DeleteVerificationCommentInput!
    $condition: ModelVerificationCommentConditionInput
  ) {
    deleteVerificationComment(input: $input, condition: $condition) {
      id
      comment
      isCommentByVerifier
      verificationID
      verification {
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
          subrole
          status
          email
          createdAt
          updatedAt
          __typename
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
          subrole
          status
          email
          createdAt
          updatedAt
          __typename
        }
        productFeatureID
        productFeature {
          id
          value
          isToBlockChain
          order
          isOnMainCard
          isResult
          productID
          featureID
          createdAt
          updatedAt
          __typename
        }
        verificationComments {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
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
      docHash
      url
      signed
      signedHash
      isApproved
      status
      isUploadedToBlockChain
      productFeatureID
      productFeature {
        id
        value
        isToBlockChain
        order
        isOnMainCard
        isResult
        productID
        product {
          id
          name
          description
          isActive
          order
          status
          timeOnVerification
          projectReadiness
          categoryID
          createdAt
          updatedAt
          __typename
        }
        featureID
        feature {
          id
          name
          description
          isTemplate
          isVerifable
          defaultValue
          formOrder
          formHint
          formRequired
          formAppearance
          formRelevant
          formConstraint
          formRequiredMessage
          parentID
          featureTypeID
          unitOfMeasureID
          xlsFormTypeID
          xlsFormGroupID
          createdAt
          updatedAt
          __typename
        }
        verifications {
          nextToken
          __typename
        }
        documents {
          nextToken
          __typename
        }
        productFeatureResults {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
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
        subrole
        status
        email
        wallets {
          nextToken
          __typename
        }
        verifierVerifications {
          nextToken
          __typename
        }
        verifiedVerifications {
          nextToken
          __typename
        }
        userProducts {
          nextToken
          __typename
        }
        documents {
          nextToken
          __typename
        }
        companies {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
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
      docHash
      url
      signed
      signedHash
      isApproved
      status
      isUploadedToBlockChain
      productFeatureID
      productFeature {
        id
        value
        isToBlockChain
        order
        isOnMainCard
        isResult
        productID
        product {
          id
          name
          description
          isActive
          order
          status
          timeOnVerification
          projectReadiness
          categoryID
          createdAt
          updatedAt
          __typename
        }
        featureID
        feature {
          id
          name
          description
          isTemplate
          isVerifable
          defaultValue
          formOrder
          formHint
          formRequired
          formAppearance
          formRelevant
          formConstraint
          formRequiredMessage
          parentID
          featureTypeID
          unitOfMeasureID
          xlsFormTypeID
          xlsFormGroupID
          createdAt
          updatedAt
          __typename
        }
        verifications {
          nextToken
          __typename
        }
        documents {
          nextToken
          __typename
        }
        productFeatureResults {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
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
        subrole
        status
        email
        wallets {
          nextToken
          __typename
        }
        verifierVerifications {
          nextToken
          __typename
        }
        verifiedVerifications {
          nextToken
          __typename
        }
        userProducts {
          nextToken
          __typename
        }
        documents {
          nextToken
          __typename
        }
        companies {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
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
      docHash
      url
      signed
      signedHash
      isApproved
      status
      isUploadedToBlockChain
      productFeatureID
      productFeature {
        id
        value
        isToBlockChain
        order
        isOnMainCard
        isResult
        productID
        product {
          id
          name
          description
          isActive
          order
          status
          timeOnVerification
          projectReadiness
          categoryID
          createdAt
          updatedAt
          __typename
        }
        featureID
        feature {
          id
          name
          description
          isTemplate
          isVerifable
          defaultValue
          formOrder
          formHint
          formRequired
          formAppearance
          formRelevant
          formConstraint
          formRequiredMessage
          parentID
          featureTypeID
          unitOfMeasureID
          xlsFormTypeID
          xlsFormGroupID
          createdAt
          updatedAt
          __typename
        }
        verifications {
          nextToken
          __typename
        }
        documents {
          nextToken
          __typename
        }
        productFeatureResults {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
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
        subrole
        status
        email
        wallets {
          nextToken
          __typename
        }
        verifierVerifications {
          nextToken
          __typename
        }
        verifiedVerifications {
          nextToken
          __typename
        }
        userProducts {
          nextToken
          __typename
        }
        documents {
          nextToken
          __typename
        }
        companies {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
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
      isSelected
      products {
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
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
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
      isSelected
      products {
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
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
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
      isSelected
      products {
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
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createConcept = /* GraphQL */ `
  mutation CreateConcept(
    $input: CreateConceptInput!
    $condition: ModelConceptConditionInput
  ) {
    createConcept(input: $input, condition: $condition) {
      id
      name
      type
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateConcept = /* GraphQL */ `
  mutation UpdateConcept(
    $input: UpdateConceptInput!
    $condition: ModelConceptConditionInput
  ) {
    updateConcept(input: $input, condition: $condition) {
      id
      name
      type
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteConcept = /* GraphQL */ `
  mutation DeleteConcept(
    $input: DeleteConceptInput!
    $condition: ModelConceptConditionInput
  ) {
    deleteConcept(input: $input, condition: $condition) {
      id
      name
      type
      createdAt
      updatedAt
      __typename
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
      order
      status
      timeOnVerification
      projectReadiness
      categoryID
      category {
        id
        name
        isSelected
        products {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
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
          __typename
        }
        nextToken
        __typename
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
          featureID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      userProducts {
        items {
          id
          isFavorite
          userID
          productID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      transactions {
        items {
          id
          addressOrigin
          addressDestination
          txIn
          txCborhex
          txHash
          metadataUrl
          fees
          network
          txProcessed
          type
          tokenName
          amountOfTokens
          policyID
          stakeAddress
          productID
          orderID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      xlsFormProducts {
        items {
          id
          productID
          xlsFormID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      companies {
        items {
          id
          name
          description
          userID
          productID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
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
      order
      status
      timeOnVerification
      projectReadiness
      categoryID
      category {
        id
        name
        isSelected
        products {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
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
          __typename
        }
        nextToken
        __typename
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
          featureID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      userProducts {
        items {
          id
          isFavorite
          userID
          productID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      transactions {
        items {
          id
          addressOrigin
          addressDestination
          txIn
          txCborhex
          txHash
          metadataUrl
          fees
          network
          txProcessed
          type
          tokenName
          amountOfTokens
          policyID
          stakeAddress
          productID
          orderID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      xlsFormProducts {
        items {
          id
          productID
          xlsFormID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      companies {
        items {
          id
          name
          description
          userID
          productID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
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
      order
      status
      timeOnVerification
      projectReadiness
      categoryID
      category {
        id
        name
        isSelected
        products {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
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
          __typename
        }
        nextToken
        __typename
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
          featureID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      userProducts {
        items {
          id
          isFavorite
          userID
          productID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      transactions {
        items {
          id
          addressOrigin
          addressDestination
          txIn
          txCborhex
          txHash
          metadataUrl
          fees
          network
          txProcessed
          type
          tokenName
          amountOfTokens
          policyID
          stakeAddress
          productID
          orderID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      xlsFormProducts {
        items {
          id
          productID
          xlsFormID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      companies {
        items {
          id
          name
          description
          userID
          productID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
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
        order
        status
        timeOnVerification
        projectReadiness
        categoryID
        category {
          id
          name
          isSelected
          createdAt
          updatedAt
          __typename
        }
        images {
          nextToken
          __typename
        }
        productFeatures {
          nextToken
          __typename
        }
        userProducts {
          nextToken
          __typename
        }
        transactions {
          nextToken
          __typename
        }
        xlsFormProducts {
          nextToken
          __typename
        }
        companies {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
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
        order
        status
        timeOnVerification
        projectReadiness
        categoryID
        category {
          id
          name
          isSelected
          createdAt
          updatedAt
          __typename
        }
        images {
          nextToken
          __typename
        }
        productFeatures {
          nextToken
          __typename
        }
        userProducts {
          nextToken
          __typename
        }
        transactions {
          nextToken
          __typename
        }
        xlsFormProducts {
          nextToken
          __typename
        }
        companies {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
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
        order
        status
        timeOnVerification
        projectReadiness
        categoryID
        category {
          id
          name
          isSelected
          createdAt
          updatedAt
          __typename
        }
        images {
          nextToken
          __typename
        }
        productFeatures {
          nextToken
          __typename
        }
        userProducts {
          nextToken
          __typename
        }
        transactions {
          nextToken
          __typename
        }
        xlsFormProducts {
          nextToken
          __typename
        }
        companies {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
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
          isVerifable
          defaultValue
          formOrder
          formHint
          formRequired
          formAppearance
          formRelevant
          formConstraint
          formRequiredMessage
          parentID
          featureTypeID
          unitOfMeasureID
          xlsFormTypeID
          xlsFormGroupID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
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
          isVerifable
          defaultValue
          formOrder
          formHint
          formRequired
          formAppearance
          formRelevant
          formConstraint
          formRequiredMessage
          parentID
          featureTypeID
          unitOfMeasureID
          xlsFormTypeID
          xlsFormGroupID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
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
          isVerifable
          defaultValue
          formOrder
          formHint
          formRequired
          formAppearance
          formRelevant
          formConstraint
          formRequiredMessage
          parentID
          featureTypeID
          unitOfMeasureID
          xlsFormTypeID
          xlsFormGroupID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
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
      isVerifable
      defaultValue
      formOrder
      formHint
      formRequired
      formAppearance
      formRelevant
      formConstraint
      formRequiredMessage
      parentID
      children {
        items {
          id
          name
          description
          isTemplate
          isVerifable
          defaultValue
          formOrder
          formHint
          formRequired
          formAppearance
          formRelevant
          formConstraint
          formRequiredMessage
          parentID
          featureTypeID
          unitOfMeasureID
          xlsFormTypeID
          xlsFormGroupID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      featureTypeID
      featureType {
        id
        name
        description
        features {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      unitOfMeasureID
      unitOfMeasure {
        id
        engineeringUnit
        description
        isFloat
        features {
          nextToken
          __typename
        }
        formulas {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
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
          featureID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      featureFormulas {
        items {
          id
          featureID
          formulaID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      xlsFormTypeID
      xlsFormType {
        id
        name
        features {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      xlsFormGroupID
      xlsFormGroup {
        id
        name
        features {
          nextToken
          __typename
        }
        xlsFormID
        xlsForm {
          id
          name
          version
          createdAt
          updatedAt
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      xlsFormChoices {
        items {
          id
          listName
          name
          label
          featureID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
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
      isVerifable
      defaultValue
      formOrder
      formHint
      formRequired
      formAppearance
      formRelevant
      formConstraint
      formRequiredMessage
      parentID
      children {
        items {
          id
          name
          description
          isTemplate
          isVerifable
          defaultValue
          formOrder
          formHint
          formRequired
          formAppearance
          formRelevant
          formConstraint
          formRequiredMessage
          parentID
          featureTypeID
          unitOfMeasureID
          xlsFormTypeID
          xlsFormGroupID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      featureTypeID
      featureType {
        id
        name
        description
        features {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      unitOfMeasureID
      unitOfMeasure {
        id
        engineeringUnit
        description
        isFloat
        features {
          nextToken
          __typename
        }
        formulas {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
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
          featureID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      featureFormulas {
        items {
          id
          featureID
          formulaID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      xlsFormTypeID
      xlsFormType {
        id
        name
        features {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      xlsFormGroupID
      xlsFormGroup {
        id
        name
        features {
          nextToken
          __typename
        }
        xlsFormID
        xlsForm {
          id
          name
          version
          createdAt
          updatedAt
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      xlsFormChoices {
        items {
          id
          listName
          name
          label
          featureID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
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
      isVerifable
      defaultValue
      formOrder
      formHint
      formRequired
      formAppearance
      formRelevant
      formConstraint
      formRequiredMessage
      parentID
      children {
        items {
          id
          name
          description
          isTemplate
          isVerifable
          defaultValue
          formOrder
          formHint
          formRequired
          formAppearance
          formRelevant
          formConstraint
          formRequiredMessage
          parentID
          featureTypeID
          unitOfMeasureID
          xlsFormTypeID
          xlsFormGroupID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      featureTypeID
      featureType {
        id
        name
        description
        features {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      unitOfMeasureID
      unitOfMeasure {
        id
        engineeringUnit
        description
        isFloat
        features {
          nextToken
          __typename
        }
        formulas {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
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
          featureID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      featureFormulas {
        items {
          id
          featureID
          formulaID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      xlsFormTypeID
      xlsFormType {
        id
        name
        features {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      xlsFormGroupID
      xlsFormGroup {
        id
        name
        features {
          nextToken
          __typename
        }
        xlsFormID
        xlsForm {
          id
          name
          version
          createdAt
          updatedAt
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      xlsFormChoices {
        items {
          id
          listName
          name
          label
          featureID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
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
          isVerifable
          defaultValue
          formOrder
          formHint
          formRequired
          formAppearance
          formRelevant
          formConstraint
          formRequiredMessage
          parentID
          featureTypeID
          unitOfMeasureID
          xlsFormTypeID
          xlsFormGroupID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      formulas {
        items {
          id
          varID
          equation
          unitOfMeasureID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
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
          isVerifable
          defaultValue
          formOrder
          formHint
          formRequired
          formAppearance
          formRelevant
          formConstraint
          formRequiredMessage
          parentID
          featureTypeID
          unitOfMeasureID
          xlsFormTypeID
          xlsFormGroupID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      formulas {
        items {
          id
          varID
          equation
          unitOfMeasureID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
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
          isVerifable
          defaultValue
          formOrder
          formHint
          formRequired
          formAppearance
          formRelevant
          formConstraint
          formRequiredMessage
          parentID
          featureTypeID
          unitOfMeasureID
          xlsFormTypeID
          xlsFormGroupID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      formulas {
        items {
          id
          varID
          equation
          unitOfMeasureID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
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
          __typename
        }
        formulas {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      results {
        items {
          id
          varID
          value
          dateTimeStamp
          formulaID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      featureFormulas {
        items {
          id
          featureID
          formulaID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
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
          __typename
        }
        formulas {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      results {
        items {
          id
          varID
          value
          dateTimeStamp
          formulaID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      featureFormulas {
        items {
          id
          featureID
          formulaID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
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
          __typename
        }
        formulas {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      results {
        items {
          id
          varID
          value
          dateTimeStamp
          formulaID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      featureFormulas {
        items {
          id
          featureID
          formulaID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
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
        isVerifable
        defaultValue
        formOrder
        formHint
        formRequired
        formAppearance
        formRelevant
        formConstraint
        formRequiredMessage
        parentID
        children {
          nextToken
          __typename
        }
        featureTypeID
        featureType {
          id
          name
          description
          createdAt
          updatedAt
          __typename
        }
        unitOfMeasureID
        unitOfMeasure {
          id
          engineeringUnit
          description
          isFloat
          createdAt
          updatedAt
          __typename
        }
        productFeatures {
          nextToken
          __typename
        }
        featureFormulas {
          nextToken
          __typename
        }
        xlsFormTypeID
        xlsFormType {
          id
          name
          createdAt
          updatedAt
          __typename
        }
        xlsFormGroupID
        xlsFormGroup {
          id
          name
          xlsFormID
          createdAt
          updatedAt
          __typename
        }
        xlsFormChoices {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
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
          __typename
        }
        results {
          nextToken
          __typename
        }
        featureFormulas {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
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
        isVerifable
        defaultValue
        formOrder
        formHint
        formRequired
        formAppearance
        formRelevant
        formConstraint
        formRequiredMessage
        parentID
        children {
          nextToken
          __typename
        }
        featureTypeID
        featureType {
          id
          name
          description
          createdAt
          updatedAt
          __typename
        }
        unitOfMeasureID
        unitOfMeasure {
          id
          engineeringUnit
          description
          isFloat
          createdAt
          updatedAt
          __typename
        }
        productFeatures {
          nextToken
          __typename
        }
        featureFormulas {
          nextToken
          __typename
        }
        xlsFormTypeID
        xlsFormType {
          id
          name
          createdAt
          updatedAt
          __typename
        }
        xlsFormGroupID
        xlsFormGroup {
          id
          name
          xlsFormID
          createdAt
          updatedAt
          __typename
        }
        xlsFormChoices {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
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
          __typename
        }
        results {
          nextToken
          __typename
        }
        featureFormulas {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
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
        isVerifable
        defaultValue
        formOrder
        formHint
        formRequired
        formAppearance
        formRelevant
        formConstraint
        formRequiredMessage
        parentID
        children {
          nextToken
          __typename
        }
        featureTypeID
        featureType {
          id
          name
          description
          createdAt
          updatedAt
          __typename
        }
        unitOfMeasureID
        unitOfMeasure {
          id
          engineeringUnit
          description
          isFloat
          createdAt
          updatedAt
          __typename
        }
        productFeatures {
          nextToken
          __typename
        }
        featureFormulas {
          nextToken
          __typename
        }
        xlsFormTypeID
        xlsFormType {
          id
          name
          createdAt
          updatedAt
          __typename
        }
        xlsFormGroupID
        xlsFormGroup {
          id
          name
          xlsFormID
          createdAt
          updatedAt
          __typename
        }
        xlsFormChoices {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
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
          __typename
        }
        results {
          nextToken
          __typename
        }
        featureFormulas {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
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
      dateTimeStamp
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
          __typename
        }
        results {
          nextToken
          __typename
        }
        featureFormulas {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      productFeatureResults {
        items {
          id
          isActive
          productFeatureID
          resultID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
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
      dateTimeStamp
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
          __typename
        }
        results {
          nextToken
          __typename
        }
        featureFormulas {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      productFeatureResults {
        items {
          id
          isActive
          productFeatureID
          resultID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
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
      dateTimeStamp
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
          __typename
        }
        results {
          nextToken
          __typename
        }
        featureFormulas {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      productFeatureResults {
        items {
          id
          isActive
          productFeatureID
          resultID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
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
      order
      isOnMainCard
      isResult
      productID
      product {
        id
        name
        description
        isActive
        order
        status
        timeOnVerification
        projectReadiness
        categoryID
        category {
          id
          name
          isSelected
          createdAt
          updatedAt
          __typename
        }
        images {
          nextToken
          __typename
        }
        productFeatures {
          nextToken
          __typename
        }
        userProducts {
          nextToken
          __typename
        }
        transactions {
          nextToken
          __typename
        }
        xlsFormProducts {
          nextToken
          __typename
        }
        companies {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      featureID
      feature {
        id
        name
        description
        isTemplate
        isVerifable
        defaultValue
        formOrder
        formHint
        formRequired
        formAppearance
        formRelevant
        formConstraint
        formRequiredMessage
        parentID
        children {
          nextToken
          __typename
        }
        featureTypeID
        featureType {
          id
          name
          description
          createdAt
          updatedAt
          __typename
        }
        unitOfMeasureID
        unitOfMeasure {
          id
          engineeringUnit
          description
          isFloat
          createdAt
          updatedAt
          __typename
        }
        productFeatures {
          nextToken
          __typename
        }
        featureFormulas {
          nextToken
          __typename
        }
        xlsFormTypeID
        xlsFormType {
          id
          name
          createdAt
          updatedAt
          __typename
        }
        xlsFormGroupID
        xlsFormGroup {
          id
          name
          xlsFormID
          createdAt
          updatedAt
          __typename
        }
        xlsFormChoices {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
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
          __typename
        }
        nextToken
        __typename
      }
      documents {
        items {
          id
          data
          timeStamp
          docHash
          url
          signed
          signedHash
          isApproved
          status
          isUploadedToBlockChain
          productFeatureID
          userID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      productFeatureResults {
        items {
          id
          isActive
          productFeatureID
          resultID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
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
      order
      isOnMainCard
      isResult
      productID
      product {
        id
        name
        description
        isActive
        order
        status
        timeOnVerification
        projectReadiness
        categoryID
        category {
          id
          name
          isSelected
          createdAt
          updatedAt
          __typename
        }
        images {
          nextToken
          __typename
        }
        productFeatures {
          nextToken
          __typename
        }
        userProducts {
          nextToken
          __typename
        }
        transactions {
          nextToken
          __typename
        }
        xlsFormProducts {
          nextToken
          __typename
        }
        companies {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      featureID
      feature {
        id
        name
        description
        isTemplate
        isVerifable
        defaultValue
        formOrder
        formHint
        formRequired
        formAppearance
        formRelevant
        formConstraint
        formRequiredMessage
        parentID
        children {
          nextToken
          __typename
        }
        featureTypeID
        featureType {
          id
          name
          description
          createdAt
          updatedAt
          __typename
        }
        unitOfMeasureID
        unitOfMeasure {
          id
          engineeringUnit
          description
          isFloat
          createdAt
          updatedAt
          __typename
        }
        productFeatures {
          nextToken
          __typename
        }
        featureFormulas {
          nextToken
          __typename
        }
        xlsFormTypeID
        xlsFormType {
          id
          name
          createdAt
          updatedAt
          __typename
        }
        xlsFormGroupID
        xlsFormGroup {
          id
          name
          xlsFormID
          createdAt
          updatedAt
          __typename
        }
        xlsFormChoices {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
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
          __typename
        }
        nextToken
        __typename
      }
      documents {
        items {
          id
          data
          timeStamp
          docHash
          url
          signed
          signedHash
          isApproved
          status
          isUploadedToBlockChain
          productFeatureID
          userID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      productFeatureResults {
        items {
          id
          isActive
          productFeatureID
          resultID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
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
      order
      isOnMainCard
      isResult
      productID
      product {
        id
        name
        description
        isActive
        order
        status
        timeOnVerification
        projectReadiness
        categoryID
        category {
          id
          name
          isSelected
          createdAt
          updatedAt
          __typename
        }
        images {
          nextToken
          __typename
        }
        productFeatures {
          nextToken
          __typename
        }
        userProducts {
          nextToken
          __typename
        }
        transactions {
          nextToken
          __typename
        }
        xlsFormProducts {
          nextToken
          __typename
        }
        companies {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      featureID
      feature {
        id
        name
        description
        isTemplate
        isVerifable
        defaultValue
        formOrder
        formHint
        formRequired
        formAppearance
        formRelevant
        formConstraint
        formRequiredMessage
        parentID
        children {
          nextToken
          __typename
        }
        featureTypeID
        featureType {
          id
          name
          description
          createdAt
          updatedAt
          __typename
        }
        unitOfMeasureID
        unitOfMeasure {
          id
          engineeringUnit
          description
          isFloat
          createdAt
          updatedAt
          __typename
        }
        productFeatures {
          nextToken
          __typename
        }
        featureFormulas {
          nextToken
          __typename
        }
        xlsFormTypeID
        xlsFormType {
          id
          name
          createdAt
          updatedAt
          __typename
        }
        xlsFormGroupID
        xlsFormGroup {
          id
          name
          xlsFormID
          createdAt
          updatedAt
          __typename
        }
        xlsFormChoices {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
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
          __typename
        }
        nextToken
        __typename
      }
      documents {
        items {
          id
          data
          timeStamp
          docHash
          url
          signed
          signedHash
          isApproved
          status
          isUploadedToBlockChain
          productFeatureID
          userID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      productFeatureResults {
        items {
          id
          isActive
          productFeatureID
          resultID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
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
        order
        isOnMainCard
        isResult
        productID
        product {
          id
          name
          description
          isActive
          order
          status
          timeOnVerification
          projectReadiness
          categoryID
          createdAt
          updatedAt
          __typename
        }
        featureID
        feature {
          id
          name
          description
          isTemplate
          isVerifable
          defaultValue
          formOrder
          formHint
          formRequired
          formAppearance
          formRelevant
          formConstraint
          formRequiredMessage
          parentID
          featureTypeID
          unitOfMeasureID
          xlsFormTypeID
          xlsFormGroupID
          createdAt
          updatedAt
          __typename
        }
        verifications {
          nextToken
          __typename
        }
        documents {
          nextToken
          __typename
        }
        productFeatureResults {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      resultID
      result {
        id
        varID
        value
        dateTimeStamp
        formulaID
        formula {
          id
          varID
          equation
          unitOfMeasureID
          createdAt
          updatedAt
          __typename
        }
        productFeatureResults {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
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
        order
        isOnMainCard
        isResult
        productID
        product {
          id
          name
          description
          isActive
          order
          status
          timeOnVerification
          projectReadiness
          categoryID
          createdAt
          updatedAt
          __typename
        }
        featureID
        feature {
          id
          name
          description
          isTemplate
          isVerifable
          defaultValue
          formOrder
          formHint
          formRequired
          formAppearance
          formRelevant
          formConstraint
          formRequiredMessage
          parentID
          featureTypeID
          unitOfMeasureID
          xlsFormTypeID
          xlsFormGroupID
          createdAt
          updatedAt
          __typename
        }
        verifications {
          nextToken
          __typename
        }
        documents {
          nextToken
          __typename
        }
        productFeatureResults {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      resultID
      result {
        id
        varID
        value
        dateTimeStamp
        formulaID
        formula {
          id
          varID
          equation
          unitOfMeasureID
          createdAt
          updatedAt
          __typename
        }
        productFeatureResults {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
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
        order
        isOnMainCard
        isResult
        productID
        product {
          id
          name
          description
          isActive
          order
          status
          timeOnVerification
          projectReadiness
          categoryID
          createdAt
          updatedAt
          __typename
        }
        featureID
        feature {
          id
          name
          description
          isTemplate
          isVerifable
          defaultValue
          formOrder
          formHint
          formRequired
          formAppearance
          formRelevant
          formConstraint
          formRequiredMessage
          parentID
          featureTypeID
          unitOfMeasureID
          xlsFormTypeID
          xlsFormGroupID
          createdAt
          updatedAt
          __typename
        }
        verifications {
          nextToken
          __typename
        }
        documents {
          nextToken
          __typename
        }
        productFeatureResults {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      resultID
      result {
        id
        varID
        value
        dateTimeStamp
        formulaID
        formula {
          id
          varID
          equation
          unitOfMeasureID
          createdAt
          updatedAt
          __typename
        }
        productFeatureResults {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
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
        subrole
        status
        email
        wallets {
          nextToken
          __typename
        }
        verifierVerifications {
          nextToken
          __typename
        }
        verifiedVerifications {
          nextToken
          __typename
        }
        userProducts {
          nextToken
          __typename
        }
        documents {
          nextToken
          __typename
        }
        companies {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      productID
      product {
        id
        name
        description
        isActive
        order
        status
        timeOnVerification
        projectReadiness
        categoryID
        category {
          id
          name
          isSelected
          createdAt
          updatedAt
          __typename
        }
        images {
          nextToken
          __typename
        }
        productFeatures {
          nextToken
          __typename
        }
        userProducts {
          nextToken
          __typename
        }
        transactions {
          nextToken
          __typename
        }
        xlsFormProducts {
          nextToken
          __typename
        }
        companies {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      orders {
        items {
          id
          currencyCode
          fiatTotalAmount
          statusCode
          externalOrderId
          confirmation
          userProductID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
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
        subrole
        status
        email
        wallets {
          nextToken
          __typename
        }
        verifierVerifications {
          nextToken
          __typename
        }
        verifiedVerifications {
          nextToken
          __typename
        }
        userProducts {
          nextToken
          __typename
        }
        documents {
          nextToken
          __typename
        }
        companies {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      productID
      product {
        id
        name
        description
        isActive
        order
        status
        timeOnVerification
        projectReadiness
        categoryID
        category {
          id
          name
          isSelected
          createdAt
          updatedAt
          __typename
        }
        images {
          nextToken
          __typename
        }
        productFeatures {
          nextToken
          __typename
        }
        userProducts {
          nextToken
          __typename
        }
        transactions {
          nextToken
          __typename
        }
        xlsFormProducts {
          nextToken
          __typename
        }
        companies {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      orders {
        items {
          id
          currencyCode
          fiatTotalAmount
          statusCode
          externalOrderId
          confirmation
          userProductID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
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
        subrole
        status
        email
        wallets {
          nextToken
          __typename
        }
        verifierVerifications {
          nextToken
          __typename
        }
        verifiedVerifications {
          nextToken
          __typename
        }
        userProducts {
          nextToken
          __typename
        }
        documents {
          nextToken
          __typename
        }
        companies {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      productID
      product {
        id
        name
        description
        isActive
        order
        status
        timeOnVerification
        projectReadiness
        categoryID
        category {
          id
          name
          isSelected
          createdAt
          updatedAt
          __typename
        }
        images {
          nextToken
          __typename
        }
        productFeatures {
          nextToken
          __typename
        }
        userProducts {
          nextToken
          __typename
        }
        transactions {
          nextToken
          __typename
        }
        xlsFormProducts {
          nextToken
          __typename
        }
        companies {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      orders {
        items {
          id
          currencyCode
          fiatTotalAmount
          statusCode
          externalOrderId
          confirmation
          userProductID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
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
          subrole
          status
          email
          createdAt
          updatedAt
          __typename
        }
        productID
        product {
          id
          name
          description
          isActive
          order
          status
          timeOnVerification
          projectReadiness
          categoryID
          createdAt
          updatedAt
          __typename
        }
        orders {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      transactions {
        items {
          id
          addressOrigin
          addressDestination
          txIn
          txCborhex
          txHash
          metadataUrl
          fees
          network
          txProcessed
          type
          tokenName
          amountOfTokens
          policyID
          stakeAddress
          productID
          orderID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
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
          subrole
          status
          email
          createdAt
          updatedAt
          __typename
        }
        productID
        product {
          id
          name
          description
          isActive
          order
          status
          timeOnVerification
          projectReadiness
          categoryID
          createdAt
          updatedAt
          __typename
        }
        orders {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      transactions {
        items {
          id
          addressOrigin
          addressDestination
          txIn
          txCborhex
          txHash
          metadataUrl
          fees
          network
          txProcessed
          type
          tokenName
          amountOfTokens
          policyID
          stakeAddress
          productID
          orderID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
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
          subrole
          status
          email
          createdAt
          updatedAt
          __typename
        }
        productID
        product {
          id
          name
          description
          isActive
          order
          status
          timeOnVerification
          projectReadiness
          categoryID
          createdAt
          updatedAt
          __typename
        }
        orders {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      transactions {
        items {
          id
          addressOrigin
          addressDestination
          txIn
          txCborhex
          txHash
          metadataUrl
          fees
          network
          txProcessed
          type
          tokenName
          amountOfTokens
          policyID
          stakeAddress
          productID
          orderID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createTransactions = /* GraphQL */ `
  mutation CreateTransactions(
    $input: CreateTransactionsInput!
    $condition: ModelTransactionsConditionInput
  ) {
    createTransactions(input: $input, condition: $condition) {
      id
      addressOrigin
      addressDestination
      txIn
      txCborhex
      txHash
      metadataUrl
      fees
      network
      txProcessed
      type
      tokenName
      amountOfTokens
      policyID
      stakeAddress
      productID
      product {
        id
        name
        description
        isActive
        order
        status
        timeOnVerification
        projectReadiness
        categoryID
        category {
          id
          name
          isSelected
          createdAt
          updatedAt
          __typename
        }
        images {
          nextToken
          __typename
        }
        productFeatures {
          nextToken
          __typename
        }
        userProducts {
          nextToken
          __typename
        }
        transactions {
          nextToken
          __typename
        }
        xlsFormProducts {
          nextToken
          __typename
        }
        companies {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      orderID
      order {
        id
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
          productID
          createdAt
          updatedAt
          __typename
        }
        transactions {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateTransactions = /* GraphQL */ `
  mutation UpdateTransactions(
    $input: UpdateTransactionsInput!
    $condition: ModelTransactionsConditionInput
  ) {
    updateTransactions(input: $input, condition: $condition) {
      id
      addressOrigin
      addressDestination
      txIn
      txCborhex
      txHash
      metadataUrl
      fees
      network
      txProcessed
      type
      tokenName
      amountOfTokens
      policyID
      stakeAddress
      productID
      product {
        id
        name
        description
        isActive
        order
        status
        timeOnVerification
        projectReadiness
        categoryID
        category {
          id
          name
          isSelected
          createdAt
          updatedAt
          __typename
        }
        images {
          nextToken
          __typename
        }
        productFeatures {
          nextToken
          __typename
        }
        userProducts {
          nextToken
          __typename
        }
        transactions {
          nextToken
          __typename
        }
        xlsFormProducts {
          nextToken
          __typename
        }
        companies {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      orderID
      order {
        id
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
          productID
          createdAt
          updatedAt
          __typename
        }
        transactions {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteTransactions = /* GraphQL */ `
  mutation DeleteTransactions(
    $input: DeleteTransactionsInput!
    $condition: ModelTransactionsConditionInput
  ) {
    deleteTransactions(input: $input, condition: $condition) {
      id
      addressOrigin
      addressDestination
      txIn
      txCborhex
      txHash
      metadataUrl
      fees
      network
      txProcessed
      type
      tokenName
      amountOfTokens
      policyID
      stakeAddress
      productID
      product {
        id
        name
        description
        isActive
        order
        status
        timeOnVerification
        projectReadiness
        categoryID
        category {
          id
          name
          isSelected
          createdAt
          updatedAt
          __typename
        }
        images {
          nextToken
          __typename
        }
        productFeatures {
          nextToken
          __typename
        }
        userProducts {
          nextToken
          __typename
        }
        transactions {
          nextToken
          __typename
        }
        xlsFormProducts {
          nextToken
          __typename
        }
        companies {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      orderID
      order {
        id
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
          productID
          createdAt
          updatedAt
          __typename
        }
        transactions {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createCompany = /* GraphQL */ `
  mutation CreateCompany(
    $input: CreateCompanyInput!
    $condition: ModelCompanyConditionInput
  ) {
    createCompany(input: $input, condition: $condition) {
      id
      name
      description
      userID
      user {
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
          nextToken
          __typename
        }
        verifierVerifications {
          nextToken
          __typename
        }
        verifiedVerifications {
          nextToken
          __typename
        }
        userProducts {
          nextToken
          __typename
        }
        documents {
          nextToken
          __typename
        }
        companies {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      productID
      product {
        id
        name
        description
        isActive
        order
        status
        timeOnVerification
        projectReadiness
        categoryID
        category {
          id
          name
          isSelected
          createdAt
          updatedAt
          __typename
        }
        images {
          nextToken
          __typename
        }
        productFeatures {
          nextToken
          __typename
        }
        userProducts {
          nextToken
          __typename
        }
        transactions {
          nextToken
          __typename
        }
        xlsFormProducts {
          nextToken
          __typename
        }
        companies {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateCompany = /* GraphQL */ `
  mutation UpdateCompany(
    $input: UpdateCompanyInput!
    $condition: ModelCompanyConditionInput
  ) {
    updateCompany(input: $input, condition: $condition) {
      id
      name
      description
      userID
      user {
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
          nextToken
          __typename
        }
        verifierVerifications {
          nextToken
          __typename
        }
        verifiedVerifications {
          nextToken
          __typename
        }
        userProducts {
          nextToken
          __typename
        }
        documents {
          nextToken
          __typename
        }
        companies {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      productID
      product {
        id
        name
        description
        isActive
        order
        status
        timeOnVerification
        projectReadiness
        categoryID
        category {
          id
          name
          isSelected
          createdAt
          updatedAt
          __typename
        }
        images {
          nextToken
          __typename
        }
        productFeatures {
          nextToken
          __typename
        }
        userProducts {
          nextToken
          __typename
        }
        transactions {
          nextToken
          __typename
        }
        xlsFormProducts {
          nextToken
          __typename
        }
        companies {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteCompany = /* GraphQL */ `
  mutation DeleteCompany(
    $input: DeleteCompanyInput!
    $condition: ModelCompanyConditionInput
  ) {
    deleteCompany(input: $input, condition: $condition) {
      id
      name
      description
      userID
      user {
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
          nextToken
          __typename
        }
        verifierVerifications {
          nextToken
          __typename
        }
        verifiedVerifications {
          nextToken
          __typename
        }
        userProducts {
          nextToken
          __typename
        }
        documents {
          nextToken
          __typename
        }
        companies {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      productID
      product {
        id
        name
        description
        isActive
        order
        status
        timeOnVerification
        projectReadiness
        categoryID
        category {
          id
          name
          isSelected
          createdAt
          updatedAt
          __typename
        }
        images {
          nextToken
          __typename
        }
        productFeatures {
          nextToken
          __typename
        }
        userProducts {
          nextToken
          __typename
        }
        transactions {
          nextToken
          __typename
        }
        xlsFormProducts {
          nextToken
          __typename
        }
        companies {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createXLSForm = /* GraphQL */ `
  mutation CreateXLSForm(
    $input: CreateXLSFormInput!
    $condition: ModelXLSFormConditionInput
  ) {
    createXLSForm(input: $input, condition: $condition) {
      id
      name
      version
      xlsFormGroups {
        items {
          id
          name
          xlsFormID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateXLSForm = /* GraphQL */ `
  mutation UpdateXLSForm(
    $input: UpdateXLSFormInput!
    $condition: ModelXLSFormConditionInput
  ) {
    updateXLSForm(input: $input, condition: $condition) {
      id
      name
      version
      xlsFormGroups {
        items {
          id
          name
          xlsFormID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteXLSForm = /* GraphQL */ `
  mutation DeleteXLSForm(
    $input: DeleteXLSFormInput!
    $condition: ModelXLSFormConditionInput
  ) {
    deleteXLSForm(input: $input, condition: $condition) {
      id
      name
      version
      xlsFormGroups {
        items {
          id
          name
          xlsFormID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createXLSFormProduct = /* GraphQL */ `
  mutation CreateXLSFormProduct(
    $input: CreateXLSFormProductInput!
    $condition: ModelXLSFormProductConditionInput
  ) {
    createXLSFormProduct(input: $input, condition: $condition) {
      id
      productID
      product {
        id
        name
        description
        isActive
        order
        status
        timeOnVerification
        projectReadiness
        categoryID
        category {
          id
          name
          isSelected
          createdAt
          updatedAt
          __typename
        }
        images {
          nextToken
          __typename
        }
        productFeatures {
          nextToken
          __typename
        }
        userProducts {
          nextToken
          __typename
        }
        transactions {
          nextToken
          __typename
        }
        xlsFormProducts {
          nextToken
          __typename
        }
        companies {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      xlsFormID
      xlsForm {
        id
        name
        description
        isActive
        order
        status
        timeOnVerification
        projectReadiness
        categoryID
        category {
          id
          name
          isSelected
          createdAt
          updatedAt
          __typename
        }
        images {
          nextToken
          __typename
        }
        productFeatures {
          nextToken
          __typename
        }
        userProducts {
          nextToken
          __typename
        }
        transactions {
          nextToken
          __typename
        }
        xlsFormProducts {
          nextToken
          __typename
        }
        companies {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateXLSFormProduct = /* GraphQL */ `
  mutation UpdateXLSFormProduct(
    $input: UpdateXLSFormProductInput!
    $condition: ModelXLSFormProductConditionInput
  ) {
    updateXLSFormProduct(input: $input, condition: $condition) {
      id
      productID
      product {
        id
        name
        description
        isActive
        order
        status
        timeOnVerification
        projectReadiness
        categoryID
        category {
          id
          name
          isSelected
          createdAt
          updatedAt
          __typename
        }
        images {
          nextToken
          __typename
        }
        productFeatures {
          nextToken
          __typename
        }
        userProducts {
          nextToken
          __typename
        }
        transactions {
          nextToken
          __typename
        }
        xlsFormProducts {
          nextToken
          __typename
        }
        companies {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      xlsFormID
      xlsForm {
        id
        name
        description
        isActive
        order
        status
        timeOnVerification
        projectReadiness
        categoryID
        category {
          id
          name
          isSelected
          createdAt
          updatedAt
          __typename
        }
        images {
          nextToken
          __typename
        }
        productFeatures {
          nextToken
          __typename
        }
        userProducts {
          nextToken
          __typename
        }
        transactions {
          nextToken
          __typename
        }
        xlsFormProducts {
          nextToken
          __typename
        }
        companies {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteXLSFormProduct = /* GraphQL */ `
  mutation DeleteXLSFormProduct(
    $input: DeleteXLSFormProductInput!
    $condition: ModelXLSFormProductConditionInput
  ) {
    deleteXLSFormProduct(input: $input, condition: $condition) {
      id
      productID
      product {
        id
        name
        description
        isActive
        order
        status
        timeOnVerification
        projectReadiness
        categoryID
        category {
          id
          name
          isSelected
          createdAt
          updatedAt
          __typename
        }
        images {
          nextToken
          __typename
        }
        productFeatures {
          nextToken
          __typename
        }
        userProducts {
          nextToken
          __typename
        }
        transactions {
          nextToken
          __typename
        }
        xlsFormProducts {
          nextToken
          __typename
        }
        companies {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      xlsFormID
      xlsForm {
        id
        name
        description
        isActive
        order
        status
        timeOnVerification
        projectReadiness
        categoryID
        category {
          id
          name
          isSelected
          createdAt
          updatedAt
          __typename
        }
        images {
          nextToken
          __typename
        }
        productFeatures {
          nextToken
          __typename
        }
        userProducts {
          nextToken
          __typename
        }
        transactions {
          nextToken
          __typename
        }
        xlsFormProducts {
          nextToken
          __typename
        }
        companies {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createXLSFormType = /* GraphQL */ `
  mutation CreateXLSFormType(
    $input: CreateXLSFormTypeInput!
    $condition: ModelXLSFormTypeConditionInput
  ) {
    createXLSFormType(input: $input, condition: $condition) {
      id
      name
      features {
        items {
          id
          name
          description
          isTemplate
          isVerifable
          defaultValue
          formOrder
          formHint
          formRequired
          formAppearance
          formRelevant
          formConstraint
          formRequiredMessage
          parentID
          featureTypeID
          unitOfMeasureID
          xlsFormTypeID
          xlsFormGroupID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateXLSFormType = /* GraphQL */ `
  mutation UpdateXLSFormType(
    $input: UpdateXLSFormTypeInput!
    $condition: ModelXLSFormTypeConditionInput
  ) {
    updateXLSFormType(input: $input, condition: $condition) {
      id
      name
      features {
        items {
          id
          name
          description
          isTemplate
          isVerifable
          defaultValue
          formOrder
          formHint
          formRequired
          formAppearance
          formRelevant
          formConstraint
          formRequiredMessage
          parentID
          featureTypeID
          unitOfMeasureID
          xlsFormTypeID
          xlsFormGroupID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteXLSFormType = /* GraphQL */ `
  mutation DeleteXLSFormType(
    $input: DeleteXLSFormTypeInput!
    $condition: ModelXLSFormTypeConditionInput
  ) {
    deleteXLSFormType(input: $input, condition: $condition) {
      id
      name
      features {
        items {
          id
          name
          description
          isTemplate
          isVerifable
          defaultValue
          formOrder
          formHint
          formRequired
          formAppearance
          formRelevant
          formConstraint
          formRequiredMessage
          parentID
          featureTypeID
          unitOfMeasureID
          xlsFormTypeID
          xlsFormGroupID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createXLSFormGroup = /* GraphQL */ `
  mutation CreateXLSFormGroup(
    $input: CreateXLSFormGroupInput!
    $condition: ModelXLSFormGroupConditionInput
  ) {
    createXLSFormGroup(input: $input, condition: $condition) {
      id
      name
      features {
        items {
          id
          name
          description
          isTemplate
          isVerifable
          defaultValue
          formOrder
          formHint
          formRequired
          formAppearance
          formRelevant
          formConstraint
          formRequiredMessage
          parentID
          featureTypeID
          unitOfMeasureID
          xlsFormTypeID
          xlsFormGroupID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      xlsFormID
      xlsForm {
        id
        name
        version
        xlsFormGroups {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateXLSFormGroup = /* GraphQL */ `
  mutation UpdateXLSFormGroup(
    $input: UpdateXLSFormGroupInput!
    $condition: ModelXLSFormGroupConditionInput
  ) {
    updateXLSFormGroup(input: $input, condition: $condition) {
      id
      name
      features {
        items {
          id
          name
          description
          isTemplate
          isVerifable
          defaultValue
          formOrder
          formHint
          formRequired
          formAppearance
          formRelevant
          formConstraint
          formRequiredMessage
          parentID
          featureTypeID
          unitOfMeasureID
          xlsFormTypeID
          xlsFormGroupID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      xlsFormID
      xlsForm {
        id
        name
        version
        xlsFormGroups {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteXLSFormGroup = /* GraphQL */ `
  mutation DeleteXLSFormGroup(
    $input: DeleteXLSFormGroupInput!
    $condition: ModelXLSFormGroupConditionInput
  ) {
    deleteXLSFormGroup(input: $input, condition: $condition) {
      id
      name
      features {
        items {
          id
          name
          description
          isTemplate
          isVerifable
          defaultValue
          formOrder
          formHint
          formRequired
          formAppearance
          formRelevant
          formConstraint
          formRequiredMessage
          parentID
          featureTypeID
          unitOfMeasureID
          xlsFormTypeID
          xlsFormGroupID
          createdAt
          updatedAt
          __typename
        }
        nextToken
        __typename
      }
      xlsFormID
      xlsForm {
        id
        name
        version
        xlsFormGroups {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createXLSFormChoice = /* GraphQL */ `
  mutation CreateXLSFormChoice(
    $input: CreateXLSFormChoiceInput!
    $condition: ModelXLSFormChoiceConditionInput
  ) {
    createXLSFormChoice(input: $input, condition: $condition) {
      id
      listName
      name
      label
      featureID
      feature {
        id
        name
        description
        isTemplate
        isVerifable
        defaultValue
        formOrder
        formHint
        formRequired
        formAppearance
        formRelevant
        formConstraint
        formRequiredMessage
        parentID
        children {
          nextToken
          __typename
        }
        featureTypeID
        featureType {
          id
          name
          description
          createdAt
          updatedAt
          __typename
        }
        unitOfMeasureID
        unitOfMeasure {
          id
          engineeringUnit
          description
          isFloat
          createdAt
          updatedAt
          __typename
        }
        productFeatures {
          nextToken
          __typename
        }
        featureFormulas {
          nextToken
          __typename
        }
        xlsFormTypeID
        xlsFormType {
          id
          name
          createdAt
          updatedAt
          __typename
        }
        xlsFormGroupID
        xlsFormGroup {
          id
          name
          xlsFormID
          createdAt
          updatedAt
          __typename
        }
        xlsFormChoices {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateXLSFormChoice = /* GraphQL */ `
  mutation UpdateXLSFormChoice(
    $input: UpdateXLSFormChoiceInput!
    $condition: ModelXLSFormChoiceConditionInput
  ) {
    updateXLSFormChoice(input: $input, condition: $condition) {
      id
      listName
      name
      label
      featureID
      feature {
        id
        name
        description
        isTemplate
        isVerifable
        defaultValue
        formOrder
        formHint
        formRequired
        formAppearance
        formRelevant
        formConstraint
        formRequiredMessage
        parentID
        children {
          nextToken
          __typename
        }
        featureTypeID
        featureType {
          id
          name
          description
          createdAt
          updatedAt
          __typename
        }
        unitOfMeasureID
        unitOfMeasure {
          id
          engineeringUnit
          description
          isFloat
          createdAt
          updatedAt
          __typename
        }
        productFeatures {
          nextToken
          __typename
        }
        featureFormulas {
          nextToken
          __typename
        }
        xlsFormTypeID
        xlsFormType {
          id
          name
          createdAt
          updatedAt
          __typename
        }
        xlsFormGroupID
        xlsFormGroup {
          id
          name
          xlsFormID
          createdAt
          updatedAt
          __typename
        }
        xlsFormChoices {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteXLSFormChoice = /* GraphQL */ `
  mutation DeleteXLSFormChoice(
    $input: DeleteXLSFormChoiceInput!
    $condition: ModelXLSFormChoiceConditionInput
  ) {
    deleteXLSFormChoice(input: $input, condition: $condition) {
      id
      listName
      name
      label
      featureID
      feature {
        id
        name
        description
        isTemplate
        isVerifable
        defaultValue
        formOrder
        formHint
        formRequired
        formAppearance
        formRelevant
        formConstraint
        formRequiredMessage
        parentID
        children {
          nextToken
          __typename
        }
        featureTypeID
        featureType {
          id
          name
          description
          createdAt
          updatedAt
          __typename
        }
        unitOfMeasureID
        unitOfMeasure {
          id
          engineeringUnit
          description
          isFloat
          createdAt
          updatedAt
          __typename
        }
        productFeatures {
          nextToken
          __typename
        }
        featureFormulas {
          nextToken
          __typename
        }
        xlsFormTypeID
        xlsFormType {
          id
          name
          createdAt
          updatedAt
          __typename
        }
        xlsFormGroupID
        xlsFormGroup {
          id
          name
          xlsFormID
          createdAt
          updatedAt
          __typename
        }
        xlsFormChoices {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
