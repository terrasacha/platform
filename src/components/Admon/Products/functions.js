import { API, graphqlOperation } from "aws-amplify";
import { deleteProduct, deleteProductFeature, deleteImage, deleteUserProduct, deleteDocument } from "../../../graphql/mutations";

export async function deleteAllInfoProduct(product) {
    console.log(product)
    if (!product) {
        returns
    }

    const promises = [
        API.graphql(graphqlOperation(deleteProduct, { input: { id: product.id } }))
    ]

    const imagePromises = product.images.items?.map(image =>
        API.graphql(graphqlOperation(deleteImage, { input: { id: image.id } }))
    )
    promises.push(...imagePromises)

    const productFeaturePromises = product.productFeatures.items?.map(pf =>{
        API.graphql(graphqlOperation(deleteProductFeature, { input: { id: pf.id } }))
        pf.documents?.items?.map(doc =>
            API.graphql(graphqlOperation(deleteDocument, { input: { id: doc.id } }))
        )
        pf.verifications?.items?.map(verification =>
            API.graphql(graphqlOperation(deleteDocument, { input: { id: verification.id } }))
        )
    }
    )
    promises.push(...productFeaturePromises)

    const userProductPromises = product.userProducts.items?.map(up =>
        API.graphql(graphqlOperation(deleteUserProduct, { input: { id: up.id } }))
    );
    promises.push(...userProductPromises)

    try {
        await Promise.all(promises)
        console.log("Todas las operaciones de eliminación se han completado.")
    } catch (error) {
        console.error("Error al eliminar la información del producto:", error)
    }
}
