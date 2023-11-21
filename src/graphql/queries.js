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
product {
            name
            categoryID
            category {
              name
              id
            }
            description
            id
            images {
              items {
                id
                imageURL
                isActive
              }
            }
            productFeatures {
              items {
                featureID
                id
                feature {
                  name
                  isVerifable
                }
                documents {
                  items {
                    id
                    url
                  }
                }
                verifications {
                  items {
                    id
                    userVerifierID
                    userVerifiedID
                    verificationComments {
                      items {
                        id
                        comment
          createdAt
                        isCommentByVerifier
                      }
                    }
                  }
                }
              }
            }
          }
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
      nextToken
      __typename
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
          createdAt
          updatedAt
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
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
      nextToken
      __typename
    }
  }
`;
export const getVerificationComment = /* GraphQL */ `
  query GetVerificationComment($id: ID!) {
    getVerificationComment(id: $id) {
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
export const listVerificationComments = /* GraphQL */ `
  query ListVerificationComments(
    $filter: ModelVerificationCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listVerificationComments(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
          userVerifiedID
          productFeatureID
          createdAt
          updatedAt
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getDocument = /* GraphQL */ `
  query GetDocument($id: ID!) {
    getDocument(id: $id) {
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
            name
          }
          featureID
feature {
            name
            isVerifable
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
          createdAt
          updatedAt
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getCategory = /* GraphQL */ `
  query GetCategory($id: ID!) {
    getCategory(id: $id) {
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
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getConcept = /* GraphQL */ `
  query GetConcept($id: ID!) {
    getConcept(id: $id) {
      id
      name
      type
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listConcepts = /* GraphQL */ `
  query ListConcepts(
    $filter: ModelConceptFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listConcepts(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
export const getProduct = /* GraphQL */ `
  query GetProduct($id: ID!) {
    getProduct(id: $id) {
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
      nextToken
      __typename
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
          order
          status
          timeOnVerification
          projectReadiness
          categoryID
          createdAt
          updatedAt
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getFeatureType = /* GraphQL */ `
  query GetFeatureType($id: ID!) {
    getFeatureType(id: $id) {
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
export const listFeatureTypes = /* GraphQL */ `
  query ListFeatureTypes(
    $filter: ModelFeatureTypeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listFeatureTypes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getUnitOfMeasure = /* GraphQL */ `
  query GetUnitOfMeasure($id: ID!) {
    getUnitOfMeasure(id: $id) {
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
export const listUnitOfMeasures = /* GraphQL */ `
  query ListUnitOfMeasures(
    $filter: ModelUnitOfMeasureFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUnitOfMeasures(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getFormula = /* GraphQL */ `
  query GetFormula($id: ID!) {
    getFormula(id: $id) {
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
export const listFormulas = /* GraphQL */ `
  query ListFormulas(
    $filter: ModelFormulaFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listFormulas(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getFeatureFormula = /* GraphQL */ `
  query GetFeatureFormula($id: ID!) {
    getFeatureFormula(id: $id) {
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
export const listFeatureFormulas = /* GraphQL */ `
  query ListFeatureFormulas(
    $filter: ModelFeatureFormulaFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listFeatureFormulas(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
          featureTypeID
          unitOfMeasureID
          xlsFormTypeID
          xlsFormGroupID
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
          createdAt
          updatedAt
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getResult = /* GraphQL */ `
  query GetResult($id: ID!) {
    getResult(id: $id) {
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
export const listResults = /* GraphQL */ `
  query ListResults(
    $filter: ModelResultFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listResults(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getProductFeature = /* GraphQL */ `
  query GetProductFeature($id: ID!) {
    getProductFeature(id: $id) {
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
          items {
            id
            status
            url
            isApproved
          }
        }
        productFeatureResults {
          nextToken
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getProductFeatureResult = /* GraphQL */ `
  query GetProductFeatureResult($id: ID!) {
    getProductFeatureResult(id: $id) {
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
export const listProductFeatureResults = /* GraphQL */ `
  query ListProductFeatureResults(
    $filter: ModelProductFeatureResultFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProductFeatureResults(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
          featureID
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
          createdAt
          updatedAt
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getUserProduct = /* GraphQL */ `
  query GetUserProduct($id: ID!) {
    getUserProduct(id: $id) {
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
export const listUserProducts = /* GraphQL */ `
  query ListUserProducts(
    $filter: ModelUserProductFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserProducts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getOrder = /* GraphQL */ `
  query GetOrder($id: ID!) {
    getOrder(id: $id) {
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
export const listOrders = /* GraphQL */ `
  query ListOrders(
    $filter: ModelOrderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOrders(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getTransactions = /* GraphQL */ `
  query GetTransactions($id: ID!) {
    getTransactions(id: $id) {
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
export const listTransactions = /* GraphQL */ `
  query ListTransactions(
    $filter: ModelTransactionsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTransactions(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
        orderID
        order {
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
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getCompany = /* GraphQL */ `
  query GetCompany($id: ID!) {
    getCompany(id: $id) {
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
export const listCompanies = /* GraphQL */ `
  query ListCompanies(
    $filter: ModelCompanyFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCompanies(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getXLSForm = /* GraphQL */ `
  query GetXLSForm($id: ID!) {
    getXLSForm(id: $id) {
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
export const listXLSForms = /* GraphQL */ `
  query ListXLSForms(
    $filter: ModelXLSFormFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listXLSForms(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getXLSFormProduct = /* GraphQL */ `
  query GetXLSFormProduct($id: ID!) {
    getXLSFormProduct(id: $id) {
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
export const listXLSFormProducts = /* GraphQL */ `
  query ListXLSFormProducts(
    $filter: ModelXLSFormProductFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listXLSFormProducts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
          createdAt
          updatedAt
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getXLSFormType = /* GraphQL */ `
  query GetXLSFormType($id: ID!) {
    getXLSFormType(id: $id) {
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
export const listXLSFormTypes = /* GraphQL */ `
  query ListXLSFormTypes(
    $filter: ModelXLSFormTypeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listXLSFormTypes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getXLSFormGroup = /* GraphQL */ `
  query GetXLSFormGroup($id: ID!) {
    getXLSFormGroup(id: $id) {
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
export const listXLSFormGroups = /* GraphQL */ `
  query ListXLSFormGroups(
    $filter: ModelXLSFormGroupFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listXLSFormGroups(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getXLSFormChoice = /* GraphQL */ `
  query GetXLSFormChoice($id: ID!) {
    getXLSFormChoice(id: $id) {
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
export const listXLSFormChoices = /* GraphQL */ `
  query ListXLSFormChoices(
    $filter: ModelXLSFormChoiceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listXLSFormChoices(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
          featureTypeID
          unitOfMeasureID
          xlsFormTypeID
          xlsFormGroupID
          createdAt
          updatedAt
          __typename
        }
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const featureByParent = /* GraphQL */ `
  query FeatureByParent(
    $parentID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelFeatureFilterInput
    $limit: Int
    $nextToken: String
  ) {
    featureByParent(
      parentID: $parentID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
      nextToken
      __typename
    }
  }
`;
