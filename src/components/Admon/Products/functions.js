import { API, graphqlOperation } from "aws-amplify";
import {
  deleteProduct,
  deleteProductFeature,
  deleteImage,
  deleteUserProduct,
  deleteDocument,
  deleteVerification,
} from "../../../graphql/mutations";
import { Storage } from "aws-amplify";
export async function deleteAllInfoProduct(product) {
  if (!product) {
    return;
  }

  const promises = [
    API.graphql(graphqlOperation(deleteProduct, { input: { id: product.id } })),
  ];

  const imagePromises = product.images.items?.map((image) =>
    API.graphql(graphqlOperation(deleteImage, { input: { id: image.id } }))
  );
  promises.push(...imagePromises);

  const productFeaturePromises = product.productFeatures.items?.map((pf) => {
    API.graphql(
      graphqlOperation(deleteProductFeature, { input: { id: pf.id } })
    );
    pf.documents?.items?.map((doc) => {
      API.graphql(graphqlOperation(deleteDocument, { input: { id: doc.id } }));
      moveObjectS3(doc.url, product.id);
    });
    pf.verifications?.items?.map((verification) =>
      API.graphql(
        graphqlOperation(deleteVerification, { input: { id: verification.id } })
      )
    );
  });
  promises.push(...productFeaturePromises);

  const userProductPromises = product.userProducts.items?.map((up) =>
    API.graphql(graphqlOperation(deleteUserProduct, { input: { id: up.id } }))
  );
  promises.push(...userProductPromises);

  try {
    await Promise.all(promises);
    console.log("Todas las operaciones de eliminación se han completado.");
  } catch (error) {
    console.error("Error al eliminar la información del producto:", error);
  }
}
async function moveObjectS3(sourceKey, productID) {
  const item = sourceKey.split("/").pop();

  console.log(item);
  try {
    await Storage.copy(
      { key: `${productID}/${item}` },
      { key: `${productID}/backup/${item}` }
    );

    await Storage.remove(`${productID}/${item}`);

    console.log(`File moved from ${sourceKey} to ${productID}/${item}`);
  } catch (error) {
    if (error.code === "NoSuchKey") {
      console.log(
        `El objeto ${item} no existe. Continuando con el siguiente objeto.`
      );
    } else {
      console.error("Error moving the file:", error);
    }
  }
}

