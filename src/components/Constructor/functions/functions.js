import { deleteProduct, deleteProductFeature, deleteImage, deleteDocument, deleteVerification, deleteUserProduct  } from "../../../graphql/mutations"
import { API, graphqlOperation } from "aws-amplify"

const getProductQuery = /* GraphQL */ `
  query GetProduct($id: ID!) {
    getProduct(id: $id) {
      id
      images {
        items {
          id
        }
      }
      productFeatures {
        items {
          id
          documents {
            items {
              id
            }
          }
          verifications {
            items {
              id
            }
          }
        }
      }
      userProducts {
        items {
          id
        }
      }
    }
  }
`;
export function validarString(str, regex) {
    if (!regex.test(str)) {
        return 'Caracteres no permitidos'
    }
    return ''
  }

export async function deleteAllProduct(productID){
    const result = await API.graphql(graphqlOperation(getProductQuery, { id: productID }))
    const product = result.data.getProduct
    const imagesToDelete = product.images.items.map(image => image.id)
    const productFeaturesToDelete = product.productFeatures.items.map(pf => pf.id)
    const userProductsToDelete = product.userProducts.items.map(up => up.id)
    const documentsToDelete = []
    const verificationsToDelete = []
    product.productFeatures.items.map(pf =>{
        pf.documents.items.length > 0 && pf.documents.items.map(doc => documentsToDelete.push(doc.id))
        pf.verifications.items.length > 0 && pf.verifications.items.map(ver => verificationsToDelete.push(ver.id))
        return 0
    })
    try {
        const productToDeletePromise = API.graphql(graphqlOperation(deleteProduct,{input:{id: productID}})) 
        const userProductsToDeletePromises = userProductsToDelete.map(up => API.graphql(graphqlOperation(deleteUserProduct,{input:{id: up}})))
        const imagesToDeletePromises = imagesToDelete.map(img => API.graphql(graphqlOperation(deleteImage,{input:{id: img}})))
        const productFeaturesToDeletePromises = productFeaturesToDelete.map(pf => API.graphql(graphqlOperation(deleteProductFeature,{input:{id: pf}})))
        const documentsToDeletePromises = documentsToDelete.map(doc => API.graphql(graphqlOperation(deleteDocument, {input:{id: doc}})))
        const verificationsToDeletePromises = verificationsToDelete.map(ver => API.graphql(graphqlOperation(deleteVerification, {input:{id: ver}})))

        const allPromises = [productToDeletePromise, ...userProductsToDeletePromises, ...imagesToDeletePromises,
                                ...productFeaturesToDeletePromises, ...documentsToDeletePromises, ...verificationsToDeletePromises];
            
        await Promise.all(allPromises);
        console.log('done')
    } catch (error) {
        console.log(error)
    } 
}
export async function fillForm(product, userID){
    let tempState = {
      CRUD_Product: {
          id: product.id,
          name: product.name,
          description: product.description,
          status: product.status,
          order: 0,
          counterNumberOfTimesBuyed: 0,
          amountToBuy: 0.0,
          categoryID: '',
          images: [],
      },
      newVerification: {
          id: '',
          createdOn: '',
          updatedOn: '',
          sign: '',
          userVerifierID: '',
          userVerifiedID: '',
          productFeatureID: '',
          documentStatus: '',
      },
      company: {
          name: '',
          id: '',
          direction: '',
          city: '',
          department: '',
          country: '',
          cp: '',
          phone: '',
          email: '',
          website: '',
      },
      companyerrors: {
          name: '',
          id: '',
          cp: '',
          phone: '',
          email: '',
          website: '',
      },
      productFeature: {
          ha_tot: '',
          fecha_inscripcion: '',
          ubicacion: '',
          coord: '',
          periodo_permanencia: '',
          token_name: '',
          redd:{
              redd_map: '',
              redd_gob: '',
              redd_ame_def: '',
              redd_doc_des_gen_pro_act:'',
              redd_act_pro: '',
              redd_tur: '',
              redd_esc_sin_pro: '',
              redd_cre_car: '',
              redd_par_ben: '',
              redd_con_loc: '',
          },
          PP:{
              PP_rep: '',
              PP_for_ten_tie: '',
              PP_pre_sue_tie: '',
              PP_vin: '',
              PP_reg_pla: '',
              PP_pla_man_for: '',
              PP_pol_del: '',
              PP_pla_sie: '',
              PP_mon: '',
              PP_pert: '',
          }
      },
      errors: {
          title: '',
          ha_tot: '',
          ubicacion: '',
          coord: '',
          periodo_permanencia: '',
          token_name: ''
      },
      renderModalInformation: false,
      renderModalProductOnDraft: false,
      renderGuardarParcialmente: false,
      activeButton: '',
      renderModalTyC: false,
      mostrarFormInfodeEmpresa: false,
      productOnDraft: '',
      empresas: [],
      files: [],
      imageToUpload: '',
      isImageUploadingFile: false,
      loading: false,
      selectedCategory: null,
      selectedCompany: '',
  }
    
    let reddOrPP = []
    let pfs = []
    let selectedCompany 
    product.productFeatures.items.map(pf =>{
      if (pf.featureID.includes('redd' || 'PP')) return reddOrPP.push(pf)
      if (pf.featureID.includes(`${userID}`)) return selectedCompany = pf.featureID
      return pfs.push(pf)
    })
    if(reddOrPP[0].featureID.includes('redd')){
      tempState.activeButton = 'REDD+'
      reddOrPP.map(redd => tempState.productFeature.redd[redd.featureID] = redd.documents.items.length > 0? redd.documents.items[0].id : redd.value)
    }
    if(reddOrPP[0].featureID.includes('PP')){
      tempState.activeButton = 'PROYECTO_PLANTACIONES'
      reddOrPP.map(PP => tempState.productFeature.PP[PP.featureID] = PP.documents.items.length > 0? PP.documents.items[0].id : PP.value)
    }
    pfs.map(pf => tempState.productFeature[pf.featureID] = pf.value)
    //aqui me fijo a que empresa/persona esta asociado el producto
    let partesAEliminar = [`${userID}_`, "_name"];
    let resultado = selectedCompany;

    partesAEliminar.forEach(parte => {
      let expresionRegular = new RegExp(parte, "g");
      resultado = resultado.replace(expresionRegular, "");
    });
    tempState.selectedCompany = resultado
    //hasta aqui
    return tempState
}