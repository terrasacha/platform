import { API, graphqlOperation } from "aws-amplify";
import {
  deleteProduct,
  deleteProductFeature,
  deleteImage,
  deleteUserProduct,
  deleteDocument,
  deleteVerification,
  deleteCampaign,
} from "../../../graphql/mutations";

import { Storage } from "aws-amplify";
import { getProduct } from "graphql/queries";

export async function deleteAllInfoProduct(product) {
  if (!product) {
    console.log("No product provided for deletion.");
    return;
  }

  const promises = [];

  try {
    // Obtener el campaignID del producto
    const { data } = await API.graphql(
      graphqlOperation(getProduct, { id: product.id })
    );
    const campaignID = data?.getProduct?.campaignID;

    // Si existe campaignID, eliminar la campaña
    if (campaignID) {
      console.log("Deleting campaign associated with product:", campaignID);
      promises.push(
        API.graphql(
          graphqlOperation(deleteCampaign, { input: { id: campaignID } })
        )
      );
    }
  } catch (error) {
    console.error("Error fetching campaignID for product:", product.id, error);
  }

  // Eliminar el producto
  console.log("Deleting product:", product.id, product.name);
  promises.push(
    API.graphql(graphqlOperation(deleteProduct, { input: { id: product.id } }))
  );

  // Eliminar imágenes asociadas
  const imagePromises = product.images.items?.map((image) => {
    console.log("Deleting image:", image.id, image.url);
    return API.graphql(graphqlOperation(deleteImage, { input: { id: image.id } }));
  });
  promises.push(...imagePromises);

  // Eliminar características del producto
  const productFeaturePromises = product.productFeatures.items?.map((pf) => {
    console.log("Deleting product feature:", pf.id, pf.name);

    // Eliminar documentos asociados a las características
    pf.documents?.items?.map((doc) => {
      console.log("Deleting document:", doc.id, doc.url);
      API.graphql(graphqlOperation(deleteDocument, { input: { id: doc.id } }));
      moveObjectS3(doc.url, product.id);
    });

    // Eliminar verificaciones asociadas
    pf.verifications?.items?.map((verification) => {
      console.log("Deleting verification:", verification.id);
      API.graphql(
        graphqlOperation(deleteVerification, { input: { id: verification.id } })
      );
    });

    return API.graphql(
      graphqlOperation(deleteProductFeature, { input: { id: pf.id } })
    );
  });
  promises.push(...productFeaturePromises);

  // Eliminar asociaciones de usuarios con el producto
  const userProductPromises = product.userProducts.items?.map((up) => {
    console.log("Deleting user product association:", up.id, up.userId);
    return API.graphql(graphqlOperation(deleteUserProduct, { input: { id: up.id } }));
  });
  promises.push(...userProductPromises);

  // Ejecutar todas las promesas
  try {
    await Promise.all(promises);
    console.log("Todas las operaciones de eliminación se han completado.");
  } catch (error) {
    console.error("Error al eliminar la información del producto:", error);
  }
}

// Función para mover objetos en S3 a una carpeta de respaldo
async function moveObjectS3(sourceKey, productID) {
  const item = sourceKey.split("/").pop();

  console.log("Moving object in S3:", sourceKey, "to backup folder for product:", productID);
  try {
    await Storage.copy(
      { key: `${productID}/${item}` },
      { key: `${productID}/backup/${item}` }
    );

    await Storage.remove(`${productID}/${item}`);

    console.log(`File moved from ${sourceKey} to ${productID}/backup/${item}`);
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
