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
      userProducts {
        items {
          id
          isFavorite
          userID
          productID
          product {
            id
            description
            order
            name
            isActive
            counterNumberOfTimesBuyed
            status
            images {
              items {
                id
                imageURL
                title
              }
            }
            categoryID
            category {
              name
            }
            productFeatures {
              items {
                id
                featureID
                order
                value
                productID
                product {
                  id
                  name
                }
                feature {
                  description
                  id
                  name
                  unitOfMeasureID
                  featureTypeID
                  featureType {
                    id
                    name
                    description
                  }
                  unitOfMeasure {
                    engineeringUnit
                    id
                  }
                }
                productFeatureResults {
                  items {
                    id
                    isActive
                    result {
                      id
                      value
                      formula {
                        id
                        equation
                      }
                    }
                  }
                }
                documents {
                  items {
                    id
                    status
                    url
                    userID
                    documentType {
                      id
                      name
                    }
                  }
                }
              }
            }
          }
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
          doc_hash
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
        userProducts {
          items {
            id
            productID
            product {
              id
              name
              productFeatures {
                items {
                  id
                  documents {
                    items {
                      id
                      status
                    }
                  }
                  feature {
                    id
                    name
                    unitOfMeasureID
                    unitOfMeasure {
                      description
                      engineeringUnit
                    }
                  }
                  featureID
                  verifications {
                    items {
                      id
                      createdOn
                      updatedOn
                      userVerifiedID
                      userVerifierID
                    }
                  }
                }
              }
            }
          }
        }
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
          order
          isOnMainCard
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
          order
          isOnMainCard
          productID
          featureID
          createdAt
          updatedAt
          feature {
            name
            id
            description
            featureType {
              id
              name
            }
          }
          product {
            id
            name
          }
          verifications {
            items {
              id
              userVerifierID
              userVerifier {
                name
              }
              userVerifiedID
              userVerified {
                name
              }
              updatedOn
              sign
              createdOn
            }
          }
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
          items {
            id
            imageURL
            carouselDescription
            carouselLabel
            format
            isOnCarousel
            isActive
            imageURLToDisplay
            title
            productID
            order
          }
        }
        productFeatures {
          items {
            id
            isToBlockChain
            isVerifable
            value
            feature {
              id
              name
              isTemplate
              description
              featureType {
                name
                id
                description
              }
              unitOfMeasure {
                engineeringUnit
                id
              }
            }
            productFeatureResults {
              items {
                id
                isActive
                result {
                  id
                  value
                  formula {
                    id
                    equation
                  }
                }
              }
            }
          }
        }
        userProducts {
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
          status
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
      nextToken
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
        }
        formulas {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
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
      nextToken
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
          defaultValue
          featureTypeID
          unitOfMeasureID
          createdAt
          updatedAt
        }
        formulaID
        formula {
          id
          varID
          equation
          unitOfMeasureID
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
export const getResult = /* GraphQL */ `
  query GetResult($id: ID!) {
    getResult(id: $id) {
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
          items {
            id
            isActive
            resultID
            result {
              id
              varID
              value
            }
          }
        }
        createdAt
        updatedAt
      }
      nextToken
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
          isVerifable
          order
          isOnMainCard
          productID
          featureID
          createdAt
          updatedAt
          feature {
            id
            name
            featureType {
              id
              name
            }
            unitOfMeasure {
              id
              engineeringUnit
              description
            }
          }
          product {
            id
            name
            order
          }
        }
        resultID
        result {
          id
          formulaID
          value
          varID
          formula {
            equation
            id
            varID
          }
        }
        createdAt
        updatedAt
      }
      nextToken
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
          category {
            name
          }
          productFeatures {
            items {
              id
              featureID
              order
              value
              feature {
                description
                id
                name
                unitOfMeasureID
                featureTypeID
                featureType {
                  id
                  name
                  description
                }
              }
              documents {
                items {
                  id
                  status
                  url
                  documentType {
                    id
                    name
                  }
                }
              }
            }
          }
        }
        orders {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getOrder = /* GraphQL */ `
  query GetOrder($id: ID!) {
    getOrder(id: $id) {
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
export const listOrders = /* GraphQL */ `
  query ListOrders(
    $filter: ModelOrderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOrders(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
          productID
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
      processed
      type
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
        transactions {
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
        processed
        type
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
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
