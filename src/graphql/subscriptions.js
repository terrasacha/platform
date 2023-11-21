/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
    onCreateUser(filter: $filter) {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
    onUpdateUser(filter: $filter) {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
    onDeleteUser(filter: $filter) {
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
export const onCreateWallet = /* GraphQL */ `
  subscription OnCreateWallet($filter: ModelSubscriptionWalletFilterInput) {
    onCreateWallet(filter: $filter) {
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
export const onUpdateWallet = /* GraphQL */ `
  subscription OnUpdateWallet($filter: ModelSubscriptionWalletFilterInput) {
    onUpdateWallet(filter: $filter) {
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
export const onDeleteWallet = /* GraphQL */ `
  subscription OnDeleteWallet($filter: ModelSubscriptionWalletFilterInput) {
    onDeleteWallet(filter: $filter) {
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
export const onCreateVerification = /* GraphQL */ `
  subscription OnCreateVerification(
    $filter: ModelSubscriptionVerificationFilterInput
  ) {
    onCreateVerification(filter: $filter) {
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
export const onUpdateVerification = /* GraphQL */ `
  subscription OnUpdateVerification(
    $filter: ModelSubscriptionVerificationFilterInput
  ) {
    onUpdateVerification(filter: $filter) {
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
export const onDeleteVerification = /* GraphQL */ `
  subscription OnDeleteVerification(
    $filter: ModelSubscriptionVerificationFilterInput
  ) {
    onDeleteVerification(filter: $filter) {
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
export const onCreateVerificationComment = /* GraphQL */ `
  subscription OnCreateVerificationComment(
    $filter: ModelSubscriptionVerificationCommentFilterInput
  ) {
    onCreateVerificationComment(filter: $filter) {
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
export const onUpdateVerificationComment = /* GraphQL */ `
  subscription OnUpdateVerificationComment(
    $filter: ModelSubscriptionVerificationCommentFilterInput
  ) {
    onUpdateVerificationComment(filter: $filter) {
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
export const onDeleteVerificationComment = /* GraphQL */ `
  subscription OnDeleteVerificationComment(
    $filter: ModelSubscriptionVerificationCommentFilterInput
  ) {
    onDeleteVerificationComment(filter: $filter) {
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
export const onCreateDocument = /* GraphQL */ `
  subscription OnCreateDocument($filter: ModelSubscriptionDocumentFilterInput) {
    onCreateDocument(filter: $filter) {
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
export const onUpdateDocument = /* GraphQL */ `
  subscription OnUpdateDocument($filter: ModelSubscriptionDocumentFilterInput) {
    onUpdateDocument(filter: $filter) {
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
export const onDeleteDocument = /* GraphQL */ `
  subscription OnDeleteDocument($filter: ModelSubscriptionDocumentFilterInput) {
    onDeleteDocument(filter: $filter) {
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
export const onCreateCategory = /* GraphQL */ `
  subscription OnCreateCategory($filter: ModelSubscriptionCategoryFilterInput) {
    onCreateCategory(filter: $filter) {
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
export const onUpdateCategory = /* GraphQL */ `
  subscription OnUpdateCategory($filter: ModelSubscriptionCategoryFilterInput) {
    onUpdateCategory(filter: $filter) {
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
export const onDeleteCategory = /* GraphQL */ `
  subscription OnDeleteCategory($filter: ModelSubscriptionCategoryFilterInput) {
    onDeleteCategory(filter: $filter) {
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
export const onCreateConcept = /* GraphQL */ `
  subscription OnCreateConcept($filter: ModelSubscriptionConceptFilterInput) {
    onCreateConcept(filter: $filter) {
      id
      name
      type
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateConcept = /* GraphQL */ `
  subscription OnUpdateConcept($filter: ModelSubscriptionConceptFilterInput) {
    onUpdateConcept(filter: $filter) {
      id
      name
      type
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteConcept = /* GraphQL */ `
  subscription OnDeleteConcept($filter: ModelSubscriptionConceptFilterInput) {
    onDeleteConcept(filter: $filter) {
      id
      name
      type
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateProduct = /* GraphQL */ `
  subscription OnCreateProduct($filter: ModelSubscriptionProductFilterInput) {
    onCreateProduct(filter: $filter) {
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
export const onUpdateProduct = /* GraphQL */ `
  subscription OnUpdateProduct($filter: ModelSubscriptionProductFilterInput) {
    onUpdateProduct(filter: $filter) {
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
export const onDeleteProduct = /* GraphQL */ `
  subscription OnDeleteProduct($filter: ModelSubscriptionProductFilterInput) {
    onDeleteProduct(filter: $filter) {
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
export const onCreateImage = /* GraphQL */ `
  subscription OnCreateImage($filter: ModelSubscriptionImageFilterInput) {
    onCreateImage(filter: $filter) {
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
export const onUpdateImage = /* GraphQL */ `
  subscription OnUpdateImage($filter: ModelSubscriptionImageFilterInput) {
    onUpdateImage(filter: $filter) {
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
export const onDeleteImage = /* GraphQL */ `
  subscription OnDeleteImage($filter: ModelSubscriptionImageFilterInput) {
    onDeleteImage(filter: $filter) {
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
export const onCreateFeatureType = /* GraphQL */ `
  subscription OnCreateFeatureType(
    $filter: ModelSubscriptionFeatureTypeFilterInput
  ) {
    onCreateFeatureType(filter: $filter) {
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
export const onUpdateFeatureType = /* GraphQL */ `
  subscription OnUpdateFeatureType(
    $filter: ModelSubscriptionFeatureTypeFilterInput
  ) {
    onUpdateFeatureType(filter: $filter) {
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
export const onDeleteFeatureType = /* GraphQL */ `
  subscription OnDeleteFeatureType(
    $filter: ModelSubscriptionFeatureTypeFilterInput
  ) {
    onDeleteFeatureType(filter: $filter) {
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
export const onCreateFeature = /* GraphQL */ `
  subscription OnCreateFeature($filter: ModelSubscriptionFeatureFilterInput) {
    onCreateFeature(filter: $filter) {
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
export const onUpdateFeature = /* GraphQL */ `
  subscription OnUpdateFeature($filter: ModelSubscriptionFeatureFilterInput) {
    onUpdateFeature(filter: $filter) {
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
export const onDeleteFeature = /* GraphQL */ `
  subscription OnDeleteFeature($filter: ModelSubscriptionFeatureFilterInput) {
    onDeleteFeature(filter: $filter) {
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
export const onCreateUnitOfMeasure = /* GraphQL */ `
  subscription OnCreateUnitOfMeasure(
    $filter: ModelSubscriptionUnitOfMeasureFilterInput
  ) {
    onCreateUnitOfMeasure(filter: $filter) {
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
export const onUpdateUnitOfMeasure = /* GraphQL */ `
  subscription OnUpdateUnitOfMeasure(
    $filter: ModelSubscriptionUnitOfMeasureFilterInput
  ) {
    onUpdateUnitOfMeasure(filter: $filter) {
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
export const onDeleteUnitOfMeasure = /* GraphQL */ `
  subscription OnDeleteUnitOfMeasure(
    $filter: ModelSubscriptionUnitOfMeasureFilterInput
  ) {
    onDeleteUnitOfMeasure(filter: $filter) {
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
export const onCreateFormula = /* GraphQL */ `
  subscription OnCreateFormula($filter: ModelSubscriptionFormulaFilterInput) {
    onCreateFormula(filter: $filter) {
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
export const onUpdateFormula = /* GraphQL */ `
  subscription OnUpdateFormula($filter: ModelSubscriptionFormulaFilterInput) {
    onUpdateFormula(filter: $filter) {
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
export const onDeleteFormula = /* GraphQL */ `
  subscription OnDeleteFormula($filter: ModelSubscriptionFormulaFilterInput) {
    onDeleteFormula(filter: $filter) {
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
export const onCreateFeatureFormula = /* GraphQL */ `
  subscription OnCreateFeatureFormula(
    $filter: ModelSubscriptionFeatureFormulaFilterInput
  ) {
    onCreateFeatureFormula(filter: $filter) {
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
export const onUpdateFeatureFormula = /* GraphQL */ `
  subscription OnUpdateFeatureFormula(
    $filter: ModelSubscriptionFeatureFormulaFilterInput
  ) {
    onUpdateFeatureFormula(filter: $filter) {
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
export const onDeleteFeatureFormula = /* GraphQL */ `
  subscription OnDeleteFeatureFormula(
    $filter: ModelSubscriptionFeatureFormulaFilterInput
  ) {
    onDeleteFeatureFormula(filter: $filter) {
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
export const onCreateResult = /* GraphQL */ `
  subscription OnCreateResult($filter: ModelSubscriptionResultFilterInput) {
    onCreateResult(filter: $filter) {
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
export const onUpdateResult = /* GraphQL */ `
  subscription OnUpdateResult($filter: ModelSubscriptionResultFilterInput) {
    onUpdateResult(filter: $filter) {
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
export const onDeleteResult = /* GraphQL */ `
  subscription OnDeleteResult($filter: ModelSubscriptionResultFilterInput) {
    onDeleteResult(filter: $filter) {
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
export const onCreateProductFeature = /* GraphQL */ `
  subscription OnCreateProductFeature(
    $filter: ModelSubscriptionProductFeatureFilterInput
  ) {
    onCreateProductFeature(filter: $filter) {
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
export const onUpdateProductFeature = /* GraphQL */ `
  subscription OnUpdateProductFeature(
    $filter: ModelSubscriptionProductFeatureFilterInput
  ) {
    onUpdateProductFeature(filter: $filter) {
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
export const onDeleteProductFeature = /* GraphQL */ `
  subscription OnDeleteProductFeature(
    $filter: ModelSubscriptionProductFeatureFilterInput
  ) {
    onDeleteProductFeature(filter: $filter) {
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
export const onCreateProductFeatureResult = /* GraphQL */ `
  subscription OnCreateProductFeatureResult(
    $filter: ModelSubscriptionProductFeatureResultFilterInput
  ) {
    onCreateProductFeatureResult(filter: $filter) {
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
export const onUpdateProductFeatureResult = /* GraphQL */ `
  subscription OnUpdateProductFeatureResult(
    $filter: ModelSubscriptionProductFeatureResultFilterInput
  ) {
    onUpdateProductFeatureResult(filter: $filter) {
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
export const onDeleteProductFeatureResult = /* GraphQL */ `
  subscription OnDeleteProductFeatureResult(
    $filter: ModelSubscriptionProductFeatureResultFilterInput
  ) {
    onDeleteProductFeatureResult(filter: $filter) {
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
export const onCreateUserProduct = /* GraphQL */ `
  subscription OnCreateUserProduct(
    $filter: ModelSubscriptionUserProductFilterInput
  ) {
    onCreateUserProduct(filter: $filter) {
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
export const onUpdateUserProduct = /* GraphQL */ `
  subscription OnUpdateUserProduct(
    $filter: ModelSubscriptionUserProductFilterInput
  ) {
    onUpdateUserProduct(filter: $filter) {
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
export const onDeleteUserProduct = /* GraphQL */ `
  subscription OnDeleteUserProduct(
    $filter: ModelSubscriptionUserProductFilterInput
  ) {
    onDeleteUserProduct(filter: $filter) {
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
export const onCreateOrder = /* GraphQL */ `
  subscription OnCreateOrder($filter: ModelSubscriptionOrderFilterInput) {
    onCreateOrder(filter: $filter) {
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
export const onUpdateOrder = /* GraphQL */ `
  subscription OnUpdateOrder($filter: ModelSubscriptionOrderFilterInput) {
    onUpdateOrder(filter: $filter) {
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
export const onDeleteOrder = /* GraphQL */ `
  subscription OnDeleteOrder($filter: ModelSubscriptionOrderFilterInput) {
    onDeleteOrder(filter: $filter) {
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
export const onCreateTransactions = /* GraphQL */ `
  subscription OnCreateTransactions(
    $filter: ModelSubscriptionTransactionsFilterInput
  ) {
    onCreateTransactions(filter: $filter) {
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
export const onUpdateTransactions = /* GraphQL */ `
  subscription OnUpdateTransactions(
    $filter: ModelSubscriptionTransactionsFilterInput
  ) {
    onUpdateTransactions(filter: $filter) {
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
export const onDeleteTransactions = /* GraphQL */ `
  subscription OnDeleteTransactions(
    $filter: ModelSubscriptionTransactionsFilterInput
  ) {
    onDeleteTransactions(filter: $filter) {
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
export const onCreateCompany = /* GraphQL */ `
  subscription OnCreateCompany($filter: ModelSubscriptionCompanyFilterInput) {
    onCreateCompany(filter: $filter) {
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
export const onUpdateCompany = /* GraphQL */ `
  subscription OnUpdateCompany($filter: ModelSubscriptionCompanyFilterInput) {
    onUpdateCompany(filter: $filter) {
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
export const onDeleteCompany = /* GraphQL */ `
  subscription OnDeleteCompany($filter: ModelSubscriptionCompanyFilterInput) {
    onDeleteCompany(filter: $filter) {
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
export const onCreateXLSForm = /* GraphQL */ `
  subscription OnCreateXLSForm($filter: ModelSubscriptionXLSFormFilterInput) {
    onCreateXLSForm(filter: $filter) {
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
export const onUpdateXLSForm = /* GraphQL */ `
  subscription OnUpdateXLSForm($filter: ModelSubscriptionXLSFormFilterInput) {
    onUpdateXLSForm(filter: $filter) {
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
export const onDeleteXLSForm = /* GraphQL */ `
  subscription OnDeleteXLSForm($filter: ModelSubscriptionXLSFormFilterInput) {
    onDeleteXLSForm(filter: $filter) {
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
export const onCreateXLSFormProduct = /* GraphQL */ `
  subscription OnCreateXLSFormProduct(
    $filter: ModelSubscriptionXLSFormProductFilterInput
  ) {
    onCreateXLSFormProduct(filter: $filter) {
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
export const onUpdateXLSFormProduct = /* GraphQL */ `
  subscription OnUpdateXLSFormProduct(
    $filter: ModelSubscriptionXLSFormProductFilterInput
  ) {
    onUpdateXLSFormProduct(filter: $filter) {
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
export const onDeleteXLSFormProduct = /* GraphQL */ `
  subscription OnDeleteXLSFormProduct(
    $filter: ModelSubscriptionXLSFormProductFilterInput
  ) {
    onDeleteXLSFormProduct(filter: $filter) {
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
export const onCreateXLSFormType = /* GraphQL */ `
  subscription OnCreateXLSFormType(
    $filter: ModelSubscriptionXLSFormTypeFilterInput
  ) {
    onCreateXLSFormType(filter: $filter) {
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
export const onUpdateXLSFormType = /* GraphQL */ `
  subscription OnUpdateXLSFormType(
    $filter: ModelSubscriptionXLSFormTypeFilterInput
  ) {
    onUpdateXLSFormType(filter: $filter) {
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
export const onDeleteXLSFormType = /* GraphQL */ `
  subscription OnDeleteXLSFormType(
    $filter: ModelSubscriptionXLSFormTypeFilterInput
  ) {
    onDeleteXLSFormType(filter: $filter) {
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
export const onCreateXLSFormGroup = /* GraphQL */ `
  subscription OnCreateXLSFormGroup(
    $filter: ModelSubscriptionXLSFormGroupFilterInput
  ) {
    onCreateXLSFormGroup(filter: $filter) {
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
export const onUpdateXLSFormGroup = /* GraphQL */ `
  subscription OnUpdateXLSFormGroup(
    $filter: ModelSubscriptionXLSFormGroupFilterInput
  ) {
    onUpdateXLSFormGroup(filter: $filter) {
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
export const onDeleteXLSFormGroup = /* GraphQL */ `
  subscription OnDeleteXLSFormGroup(
    $filter: ModelSubscriptionXLSFormGroupFilterInput
  ) {
    onDeleteXLSFormGroup(filter: $filter) {
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
export const onCreateXLSFormChoice = /* GraphQL */ `
  subscription OnCreateXLSFormChoice(
    $filter: ModelSubscriptionXLSFormChoiceFilterInput
  ) {
    onCreateXLSFormChoice(filter: $filter) {
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
export const onUpdateXLSFormChoice = /* GraphQL */ `
  subscription OnUpdateXLSFormChoice(
    $filter: ModelSubscriptionXLSFormChoiceFilterInput
  ) {
    onUpdateXLSFormChoice(filter: $filter) {
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
export const onDeleteXLSFormChoice = /* GraphQL */ `
  subscription OnDeleteXLSFormChoice(
    $filter: ModelSubscriptionXLSFormChoiceFilterInput
  ) {
    onDeleteXLSFormChoice(filter: $filter) {
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
