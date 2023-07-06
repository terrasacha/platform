# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


# Entity Relation Model

El modelo entidad-relación que has compartido es una representación de un esquema de base de datos utilizando la notación GraphQL con la adición de anotaciones específicas de Amplify, un servicio de desarrollo de aplicaciones de AWS. Aquí hay una descripción de las entidades y sus relaciones:

## Auth Models:

> User: Representa a un usuario. Tiene campos como "id", "name", "dateOfBirth", "isProfileUpdated", "address", "cellphone", "role", "status", "email". También tiene relaciones con otras entidades, como "wallets", "verifierVerifications", "verifiedVerifications", "userProducts" y "documents".

## Wallet: 

> Representa una billetera asociada a un usuario. Tiene campos como "id", "name", "status", "isSelected" y "userID". También tiene una relación con la entidad "User".

## Verification
> Representa una verificación realizada por un verificador sobre un usuario. Tiene campos como "id", "createdOn", "updatedOn", "sign", "userVerifierID", "userVerifiedID", "productFeatureID". También tiene relaciones con las entidades "User" y "ProductFeature". Además, tiene una relación de uno a muchos con "VerificationComment".

## VerificationComment
> Representa un comentario asociado a una verificación. Tiene campos como "id", "comment", "isCommentByVerifier" y "verificationID". También tiene una relación con la entidad "Verification".

## DocumentType
> Representa un tipo de documento. Tiene campos como "id", "name" y "description". También tiene una relación de uno a muchos con "Document".

## Document
> Representa un documento asociado a un usuario y un tipo de documento. Tiene campos como "id", "data", "timeStamp", "docHash", "url", "signed", "signedHash", "isApproved", "status", "isUploadedToBlockChain", "documentTypeID", "productFeatureID" y "userID". También tiene relaciones con las entidades "DocumentType", "ProductFeature" y "User".

## Product Models:

### Category
> Representa una categoría de productos. Tiene campos como "id", "name" y "isSelected". También tiene una relación de uno a muchos con "Product".

### Product
> Representa un producto. Tiene campos como "id", "name", "description", "isActive", "counterNumberOfTimesBuyed", "amountToBuy", "order", "status", "timeOnVerification" y "categoryID". También tiene relaciones con otras entidades, como "Category", "Image", "ProductFeature", "UserProduct" y "Transactions".

### Image
> Representa una imagen asociada a un producto. Tiene campos como "id", "imageURL", "format", "title", "imageURLToDisplay", "isOnCarousel", "carouselLabel", "carouselDescription", "isActive", "order" y "productID". También tiene una relación con la entidad "Product".

### FeatureType
> Representa un tipo de característica de un producto. Tiene campos como "id", "name" y "description". También tiene una relación de uno a muchos con "Feature".

### Feature 
> Representa una característica de un producto. Tiene campos como "id", "name", "description", "isTemplate", "isVerifiable", "defaultValue", "formOrder", "formHint", "formRequired", "formAppearance", "formRelevant", "formConstraint", "formRequiredMessage", "parentID", "featureTypeID", "unitOfmedidaID", "xlsFormTypeID" y "xlsFormGroupID". También tiene relaciones con otras entidades, como "FeatureType", "UnitOfMeasure", "ProductFeature", "FeatureFormula" y "XLSFormChoice".

### UnitOfMeasure
> Representa una unidad de medida utilizada en las características de los productos. Tiene campos como "id", "engineeringUnit", "description" y "isFloat". También tiene una relación de uno a muchos con "Feature" y "Formula".

### Formula: 
> Representa una fórmula utilizada en las características de los productos. Tiene campos como "id", "varID", "equation" y "unitOfMeasureID". También tiene relaciones con las entidades "UnitOfMeasure" y "Result".

### FeatureFormula
> Representa la relación entre una característica y una fórmula utilizada en los productos. Tiene campos como "id", "featureID" y "formulaID". También tiene relaciones con las entidades "Feature" y "Formula".

### Result
> Representa el resultado de una fórmula utilizada en los productos. Tiene campos como "id", "varID", "value", "dateTimeStamp" y "formulaID". También tiene relaciones con las entidades "Formula" y "ProductFeatureResult".

### ProductFeature
> Representa una característica específica de un producto. Tiene campos como "id", "value", "isToBlockChain", "order", "isOnMainCard", "isResult", "productID" y "featureID". También tiene relaciones con otras entidades, como "Product", "Feature", "Verification" y "Document".

### ProductFeatureResult
> Representa el resultado de una característica específica de un producto. Tiene campos como "id", "isActive", "productFeatureID" y "resultID". También tiene relaciones con las entidades "ProductFeature" y "Result".

### UserProduct
> Representa la relación entre un usuario y un producto. Tiene campos como "id", "isFavorite", "userID" y "productID". También tiene relaciones con las entidades "User" y "Product".

### Transactions
> Representa las transacciones asociadas a un producto. No se proporciona la definición completa en el modelo compartido.

### XLSFormProduct
> Representa los productos definidos en un formulario XLSForm. No se proporciona la definición completa en el modelo compartido.

En general, este modelo entidad-relación describe entidades como usuarios, billeteras, verificaciones, documentos, categorías de productos, productos, imágenes, tipos de características, características, unidades de medida, fórmulas y relaciones entre estas entidades. Cada entidad tiene campos y relaciones específicas para representar la estructura y las conexiones en la base de datos.

# XLSForm

# Standar name (Feature: graphql = id PK)