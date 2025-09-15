import React, { Component } from "react";
// Bootstrap reemplazado con Tailwind CSS y sistema Terrasacha
import { deleteAllInfoProduct } from "./functions";
// Componentes Terrasacha
import TerrasachaTable, { TerrasachaTableCell, TerrasachaBadge } from "../../common/TerrasachaTable";
import TerrasachaModal, { TerrasachaModalButton } from "../../common/TerrasachaModal";
// GraphQL
import { API, graphqlOperation, Storage } from "aws-amplify";
import { listProductFeatureResults } from "../../../graphql/queries";
import {
  deleteProductFeatureResult,
  deleteVerification,
  deleteVerificationComment,
  updateProduct,
  deleteProductFeature,
  deleteCampaign,
} from "../../../graphql/mutations";
import { ToastContainer, toast } from "react-toastify";

export default class ListProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      PFR: [],
      isRenderModalProductFeatures: false,
      isRenderModalProductDescription: false,
      isRenderModalVerifications: false,
      isRenderModalDeleteProductFeatureConfirmation: false,
      selectedProductToShow: null,
      selectedProductFeatureToDelete: null,
      selectedProductFeatureToDeleteHasDocuments: null,
      selectedProductFeatureToDeleteHasVerifications: null,
      selectedProductFeatureToDeleteHasVerificationComments: null,
      selectedProductFeatureToDeleteHasResults: null,
      selectedProductFeatureToDeleteConfirmationCheck: false,
      isRenderModalProductImages: false,
      showModalDeleteProduct: false,
    };
    this.handleGetFinancialStatus = this.props.handleGetFinancialStatus.bind(this);
    this.handleGetTechnicalStatus = this.props.handleGetTechnicalStatus.bind(this);
    this.handleShowAreYouSureDeleteProduct =
      this.props.handleShowAreYouSureDeleteProduct.bind(this);
    this.handleUpdateProductIsActive =
      this.props.handleUpdateProductIsActive.bind(this);
    this.handleUpdateProductTechnical =
      this.props.handleUpdateProductTechnical.bind(this);
    this.handleUpdateProductFinancial =
      this.props.handleUpdateProductFinancial.bind(this);
    this.handleLoadEditProduct = this.props.handleLoadEditProduct.bind(this);
    this.handleDeleteFeatureProduct =
      this.props.handleDeleteFeatureProduct.bind(this);
    this.handleDeleteImageProduct =
      this.props.handleDeleteImageProduct.bind(this);
    this.handleLoadSelectedProduct = this.handleLoadSelectedProduct.bind(this);
    this.handleLoadSelectedProduct = this.handleLoadSelectedProduct.bind(this);
    this.handleShowModalDeteleProductFeatureConfirmation =
      this.handleShowModalDeteleProductFeatureConfirmation.bind(this);
    this.handleHideModalDeleteProductFeatureConfirmation =
      this.handleHideModalDeleteProductFeatureConfirmation.bind(this);
    this.handleHideModalProductImages =
      this.handleHideModalProductImages.bind(this);
    this.handleDeleteProductFeature =
      this.handleDeleteProductFeature.bind(this);
    this.checkRequirementsCompleted = this.checkRequirementsCompleted.bind(this);
    this.ProductAction = this.ProductAction.bind(this);
  }
  
  componentDidMount = async () => {
    await this.loadProductFeatureResults();
  };

  
  hasVerifiedProductFeatures(product) {
    let verifications = product.productFeatures.items.some(
      (feature) => feature.verifications.items.length > 0
    );
    let transactions = product.transactions.items.length > 0;
    return verifications || transactions;
  }
  async loadProductFeatureResults() {
    const listProductFeatureResultsResult = await API.graphql(
      graphqlOperation(listProductFeatureResults)
    );
    listProductFeatureResultsResult.data.listProductFeatureResults.items.sort(
      (a, b) => (a.id > b.id ? 1 : -1)
    );
    this.setState({
      PFR: listProductFeatureResultsResult.data.listProductFeatureResults.items,
    });
  }
  async handleLoadSelectedProduct(event, pProduct, pModal) {
    if (pModal === "show_modal_product_images") {
      this.setState({
        isRenderModalProductImages: true,
        selectedProductToShow: pProduct,
      });
    }
    if (pModal === "show_modal_product_features") {
      this.setState({
        isRenderModalProductFeatures: true,
        selectedProductToShow: pProduct,
      });
    }
    if (pModal === "show_modal_product_description") {
      this.setState({
        isRenderModalProductDescription: true,
        selectedProductToShow: pProduct,
      });
    }
    if (pModal === "show_modal_verifications") {
      this.setState({
        isRenderModalVerifications: true,
        selectedProductToShow: pProduct,
      });
    }
  }

  async handleShowModalDeteleProductFeatureConfirmation(
    event,
    pProductFeature
  ) {
    this.setState({
      isRenderModalDeleteProductFeatureConfirmation:
        !this.state.isRenderModalDeleteProductFeatureConfirmation,
      selectedProductFeatureToDelete: pProductFeature,
    });
  }
  async certifyProduct(product) {
    let updateInfo = {
      id: product.id,
      status: "certified",
    };
    await API.graphql(graphqlOperation(updateProduct, { input: updateInfo }));
  }
  async handleHideModalProductImages(event) {
    this.setState({
      isRenderModalProductImages: !this.state.isRenderModalProductImages,
    });
  }
  async handleHideModalProductFeatures(event) {
    this.setState({
      isRenderModalProductFeatures: !this.state.isRenderModalProductFeatures,
    });
  }
  async handleHideModalProductDescription(event) {
    this.setState({
      isRenderModalProductDescription:
        !this.state.isRenderModalProductDescription,
    });
  }
  async handleHideModalProductVerification(event) {
    this.setState({
      isRenderModalVerifications: !this.state.isRenderModalVerifications,
    });
  }
  async handleHideModalDeleteProductFeatureConfirmation() {
    this.setState({
      isRenderModalDeleteProductFeatureConfirmation:
        !this.state.isRenderModalDeleteProductFeatureConfirmation,
      selectedProductFeatureToDelete: null,
      selectedProductFeatureToDeleteConfirmationCheck: false,
    });
  }
  handleDownload = async (pf) => {
    try {
      let doc = pf.documents.items[0];
      const partes = doc.url.split("/");
      const product = partes[partes.length - 2];
      const id = partes.pop();
      const response = await Storage.get(`${product}/${id}`, {
        download: true,
      });
      const url = URL.createObjectURL(response.Body);
      const link = document.createElement("a");
      link.href = url;
      link.download = id;
      link.click();
    } catch (error) {
      console.log("Error al descargar el archivo:", error);
    }
  };

  handleDeleteProductFeature = async () => {
    let productFeature = this.state.selectedProductFeatureToDelete;
    let checked = this.state.selectedProductFeatureToDeleteConfirmationCheck;
  
    if (productFeature != null && checked) {
      let isPossibleToDelete = true;
  
      if (
        productFeature.product.status === "in_blockchain" ||
        productFeature.product.status === "rejected"
      )
        isPossibleToDelete = false;
  
      if (productFeature.documents.items.length > 0) isPossibleToDelete = false;
  
      if (isPossibleToDelete) {
        // Delete Verifications
        productFeature.verifications.items.forEach((verification) => {
          const inputVerificationToDelete = {
            id: verification.id,
          };
          API.graphql(
            graphqlOperation(deleteVerification, {
              input: inputVerificationToDelete,
            })
          );
        });
  
        // Delete Verification Comments
        productFeature.verifications.items
          .flatMap((verification) => verification.verificationComments.items)
          .forEach((verificationComment) => {
            const inputVerificationCommentToDelete = {
              id: verificationComment.id,
            };
            API.graphql(
              graphqlOperation(deleteVerificationComment, {
                input: inputVerificationCommentToDelete,
              })
            );
          });
  
        // Delete Results
        productFeature.productFeatureResults.items.forEach((result) => {
          const inputResultsToDelete = {
            id: result.id,
          };
          API.graphql(
            graphqlOperation(deleteProductFeatureResult, {
              input: inputResultsToDelete,
            })
          );
        });
  
        // Delete Product Feature Relation
        await API.graphql(
          graphqlOperation(deleteProductFeature, {
            input: { id: productFeature.id },
          })
        );
  
        // Check if the product is associated with a campaign
        const campaign = productFeature.product.campaign;
        if (campaign) {
  
          // Delete the campaign
          const inputCampaignToDelete = {
            id: campaign.id,
          };
          await API.graphql(
            graphqlOperation(deleteCampaign, {
              input: inputCampaignToDelete,
            })
          );
  
        }
  
        this.handleHideModalDeleteProductFeatureConfirmation();
  
        this.notify(
          "ProductFeature, associated campaign, and related components deleted successfully"
        );
      }
    }
  };
  

  notify = (e) => {
    toast.success(e, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  notifyError = (e) => {
    toast.error(e, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  checkRequirementsCompleted = (product) => {
    const features = product.productFeatures.items;
  
    // Validar información del postulante
    const hasApplicantInfo = ["A_postulante_name", "A_postulante_email", "A_postulante_id"].every((id) =>
      features.some((feature) => feature.featureID === id && feature.value)
    );
  
    // Validar aceptación de condiciones financieras
    const ownerAcceptsConditions = features.some(
      (feature) => feature.featureID === "GLOBAL_OWNER_ACCEPTS_CONDITIONS" && feature.value === "true"
    );
  
    // Validar verificación de documentos
    const hasValidatedDocuments = features.some(
      (feature) =>
        feature.featureID === "GLOBAL_PROJECT_VALIDATOR_FILES" &&
        feature.documents.items.some((doc) => doc.isApproved)
    );
  
    // Validar oficialización de información técnica
    const hasTechnicalApproval = features.some(
      (feature) =>
        feature.featureID === "GLOBAL_VALIDATOR_SET_TECHNICAL_CONDITIONS" &&
        feature.value === "true"
    );
  
    // Validar oficialización de información financiera
    const hasFinancialApproval = features.some(
      (feature) =>
        feature.featureID === "GLOBAL_VALIDATOR_SET_FINANCIAL_CONDITIONS" &&
        feature.value === "true"
    );
  
    // Validar distribución de tokens
    const hasTokenDistribution = features.some(
      (feature) => feature.featureID === "GLOBAL_TOKEN_AMOUNT_DISTRIBUTION" && feature.value
    );
  
    // Validar publicación en el Marketplace
    const isVisibleOnMarketplace = product.isActive ;
  
    // Evaluar todos los requisitos
    return (
      hasApplicantInfo &&
      ownerAcceptsConditions &&
      hasValidatedDocuments &&
      hasTechnicalApproval &&
      hasFinancialApproval &&
      hasTokenDistribution &&
      isVisibleOnMarketplace
    );
  };
  
  
  // Mostrar o no el botón
  ProductAction = ({ product }) => {
    const canBeDeleted = !this.checkRequirementsCompleted(product);
  
    return canBeDeleted ? (
      <button
        className="btn-terrasacha-danger text-sm"
        onClick={() =>
          this.setState({
            showModalDeleteProduct: true,
            selectedProductToShow: product,
          })
        }
      >
        Eliminar
      </button>
    ) : null;
  };
  
  
  
  // RENDER
  render() {
    let { products, urlS3Image, listPF } = this.props;
    let {
      selectedProductToShow,
      isRenderModalProductFeatures,
      isRenderModalProductImages,
      isRenderModalProductDescription,
      isRenderModalVerifications,
      isRenderModalDeleteProductFeatureConfirmation,
      selectedProductFeatureToDelete,
      selectedProductFeatureToDeleteHasDocuments,
      selectedProductFeatureToDeleteHasResults,
      selectedProductFeatureToDeleteHasVerifications,
      selectedProductFeatureToDeleteHasVerificationComments,
    } = this.state;
    // Render Products
    let productsData = products.map((product) => {
      product.toCertified = false;
      let pfFiltered = product.productFeatures.items.filter(
        (pf) => pf.featureID === "CERTIFICATION_3RD_PARTY"
      );
      pfFiltered.map((pff) => {
        if (
          pff.documents.items[0]?.status === "accepted" &&
          pff.documents.items[0]?.isApproved
        )
          product.toCertified = true;
      });
      return product;
    });
    const listCleanProducts = productsData.map((product) => {
      let unverified = !this.hasVerifiedProductFeatures(product);
      if (unverified) product.unverified = true;
      if (!unverified) product.unverified = false;
      return product;
    });
    const renderProducts = () => {
      if (listCleanProducts.length > 0) {
        return (
          <TerrasachaTable
            title="Lista de Proyectos"
            subtitle="Gestión completa de todos los proyectos en la plataforma"
            headers={[
              'Eliminar', 'Nombre', 'Categoría', 'Estado', 'Descripción', 
              'Imagen', 'Características', 'Verificaciones', 'Of. Técnica', 
              'Of. Financiera', '¿Activo?', 'Acción', 'Certificado'
            ]}
            data={products}
            renderRow={(product) => (
              <>
                <TerrasachaTableCell>
                  {this.ProductAction({ product })}
                </TerrasachaTableCell>
                
                <TerrasachaTableCell variant="primary">
                  <a
                    href={`/project/${product.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-terrasacha-primary hover:text-terrasacha-primary/80 font-medium underline font-typographica"
                  >
                    {product.name || "Sin nombre"}
                  </a>
                </TerrasachaTableCell>
                
                <TerrasachaTableCell variant="secondary">
                  {product.category ? product.category.name : "Sin categoría"}
                </TerrasachaTableCell>
                
                <TerrasachaTableCell>
                  <select
                    className="form-terrasacha-select text-sm"
                    value={product.status}
                    onChange={(e) =>
                      this.props.handleUpdateProductStatus(
                        product,
                        e.target.value
                      )
                    }
                  >
                    {[
                      "draft",
                      "verified", 
                      "in_blockchain",
                      "in_equilibrium",
                    ].map((op) => (
                      <option value={op} key={op}>
                        {op}
                      </option>
                    ))}
                  </select>
                </TerrasachaTableCell>
                
                <TerrasachaTableCell>
                  <button
                    className="btn-terrasacha-outline text-sm"
                    onClick={(e) =>
                      this.handleLoadSelectedProduct(
                        e,
                        product,
                        "show_modal_product_description"
                      )
                    }
                  >
                    Ver Descripción
                  </button>
                </TerrasachaTableCell>
                
                <TerrasachaTableCell>
                  <button
                    className="btn-terrasacha-outline text-sm"
                    onClick={(e) =>
                      this.handleLoadSelectedProduct(
                        e,
                        product,
                        "show_modal_product_images"
                      )
                    }
                  >
                    Ver Imágenes
                  </button>
                </TerrasachaTableCell>
                
                <TerrasachaTableCell>
                  <button
                    className="btn-terrasacha-outline text-sm"
                    onClick={(e) =>
                      this.handleLoadSelectedProduct(
                        e,
                        product,
                        "show_modal_product_features"
                      )
                    }
                  >
                    Características
                  </button>
                </TerrasachaTableCell>
                
                <TerrasachaTableCell>
                  <button
                    className="btn-terrasacha-outline text-sm"
                    onClick={(e) =>
                      this.handleLoadSelectedProduct(
                        e,
                        product,
                        "show_modal_verifications"
                      )
                    }
                  >
                    Verificaciones
                  </button>
                </TerrasachaTableCell>
                
                <TerrasachaTableCell>
                  <button
                    className={`text-sm font-typographica font-bold py-2 px-3 rounded-lg transition-colors duration-200 ${
                      this.handleGetTechnicalStatus(product) === "Habilitar cambios"
                        ? "btn-terrasacha-danger"
                        : "btn-terrasacha-success"
                    }`}
                    onClick={(e) =>
                      this.handleUpdateProductTechnical(product)
                    }
                  >
                    {this.handleGetTechnicalStatus(product)}
                  </button>
                </TerrasachaTableCell>
                
                <TerrasachaTableCell>
                  <button
                    className={`text-sm font-typographica font-bold py-2 px-3 rounded-lg transition-colors duration-200 ${
                      this.handleGetFinancialStatus(product) === "Habilitar cambios"
                        ? "btn-terrasacha-danger"
                        : "btn-terrasacha-success"
                    }`}
                    onClick={(e) =>
                      this.handleUpdateProductFinancial(product)
                    }
                  >
                    {this.handleGetFinancialStatus(product)}
                  </button>
                </TerrasachaTableCell>
                
                <TerrasachaTableCell>
                  <TerrasachaBadge variant={product.isActive ? 'success' : 'warning'}>
                    <button
                      className="bg-transparent border-none text-inherit font-inherit cursor-pointer"
                      onClick={(e) => this.handleUpdateProductIsActive(product)}
                    >
                      {product.isActive ? "Activo" : "Inactivo"}
                    </button>
                  </TerrasachaBadge>
                </TerrasachaTableCell>
                
                <TerrasachaTableCell>
                  <button
                    className={`text-sm font-typographica font-bold py-2 px-3 rounded-lg transition-colors duration-200 ${
                      product.status === "on_block_chain"
                        ? "bg-gray-400 cursor-not-allowed text-gray-600"
                        : "btn-terrasacha-primary"
                    }`}
                    disabled={product.status === "on_block_chain"}
                    onClick={(e) => this.handleLoadEditProduct(product, e)}
                  >
                    {product.status === "on_block_chain"
                      ? "No editable"
                      : "Editar"}
                  </button>
                </TerrasachaTableCell>
                
                <TerrasachaTableCell>
                  {product.toCertified ? (
                    product.status !== "certified" ? (
                      <button
                        className="btn-terrasacha-secondary text-sm"
                        onClick={() => this.certifyProduct(product)}
                      >
                        Certificar
                      </button>
                    ) : (
                      <TerrasachaBadge variant="success">
                        Certificado
                      </TerrasachaBadge>
                    )
                  ) : (
                    <TerrasachaBadge variant="warning">
                      Falta certificación
                    </TerrasachaBadge>
                  )}
                </TerrasachaTableCell>
              </>
            )}
          />
        );
      }
    };
    const modalProductImages = () => {
      if (isRenderModalProductImages && selectedProductToShow !== null) {
        return (
          <TerrasachaModal
            isOpen={isRenderModalProductImages}
            onClose={() => this.handleHideModalProductImages()}
            title="🖼️ Imágenes del Proyecto"
            size="xl"
            footer={
              <TerrasachaModalButton
                variant="outline"
                onClick={() => this.handleHideModalProductImages()}
              >
                Cerrar
              </TerrasachaModalButton>
            }
          >
            <TerrasachaTable
              title={`Imágenes de ${selectedProductToShow.name || 'Proyecto'}`}
              subtitle="Galería completa de imágenes asociadas al proyecto"
              headers={['Imagen', 'Título', 'Orden', 'En Carrusel', 'Etiqueta', 'Descripción']}
              data={selectedProductToShow.images.items}
              renderRow={(image) => (
                <>
                  <TerrasachaTableCell>
                    <div className="flex justify-center">
                      <img
                        src={this.props.urlS3Image + image.imageURL}
                        alt={image.title || 'Imagen del proyecto'}
                        className="h-32 w-auto object-cover rounded-lg shadow-terrasacha border border-terrasacha-light/20"
                      />
                    </div>
                  </TerrasachaTableCell>
                  
                  <TerrasachaTableCell variant="primary">
                    {image.title || "Sin título"}
                  </TerrasachaTableCell>
                  
                  <TerrasachaTableCell variant="secondary">
                    {image.order === null ? "N/A" : image.order}
                  </TerrasachaTableCell>
                  
                  <TerrasachaTableCell>
                    <TerrasachaBadge variant={image.isOnCarousel ? 'success' : 'neutral'}>
                      {image.isOnCarousel ? "Sí" : "No"}
                    </TerrasachaBadge>
                  </TerrasachaTableCell>
                  
                  <TerrasachaTableCell variant="secondary">
                    {image.carouselLabel || "N/A"}
                  </TerrasachaTableCell>
                  
                  <TerrasachaTableCell>
                    <div className="max-w-xs">
                      <p className="text-sm text-terrasacha-secondary1 truncate" title={image.carouselDescription}>
                        {image.carouselDescription || "Sin descripción"}
                      </p>
                    </div>
                  </TerrasachaTableCell>
                </>
              )}
            />
          </TerrasachaModal>
        );
      }
    };
    const modalProductFeatures = () => {
      if (isRenderModalProductFeatures && selectedProductToShow !== null) {
        let productFeatures = listPF.filter(
          (pf) => pf.productID === selectedProductToShow.id
        );
        let productFeaturesCopy = productFeatures;
        for (let i = 0; i < productFeaturesCopy.length; i++) {
          let productFeatureResult = this.state.PFR.filter(
            (pfr) => pfr.productFeatureID === productFeaturesCopy[i].id
          );
          productFeaturesCopy[i].productFeatureResults2 = productFeatureResult;
        }
        for (let i = 0; i < productFeaturesCopy.length; i++) {
          //renderiza pfr directamente desde pfr porque al hacer update de pf se rompe
          if (productFeaturesCopy[i].productFeatureResults2?.length > 0) {
            let filteredIsActivePFR = productFeaturesCopy[
              i
            ].productFeatureResults2.filter((pfr) => pfr.isActive === true);
            productFeaturesCopy[i].productFeatureResults2 = filteredIsActivePFR;
          }
        }
        if (productFeaturesCopy.length > 0) {
          return (
            <TerrasachaModal
              isOpen={isRenderModalProductFeatures}
              onClose={() => this.handleHideModalProductFeatures()}
              title="⚙️ Características del Proyecto"
              size="xl"
              footer={
                <TerrasachaModalButton
                  variant="outline"
                  onClick={() => this.handleHideModalProductFeatures()}
                >
                  Cerrar
                </TerrasachaModalButton>
              }
            >
              <ToastContainer />
              <TerrasachaTable
                title={`Características de ${selectedProductToShow.name || 'Proyecto'}`}
                subtitle="Configuración completa de características y atributos del proyecto"
                headers={['Característica', 'Valor', 'Resultado', 'En Tarjeta', 'BlockChain', 'Verificable', 'Acciones']}
                data={productFeaturesCopy}
                renderRow={(pfeature) => (
                  <>
                    <TerrasachaTableCell variant="primary">
                      {pfeature.feature.name}
                    </TerrasachaTableCell>
                    
                    <TerrasachaTableCell variant="secondary">
                      <div className="max-w-xs">
                        <p className="truncate font-typographica" title={pfeature.value}>
                          {pfeature.value || "Sin valor"}
                        </p>
                      </div>
                    </TerrasachaTableCell>
                    
                    <TerrasachaTableCell>
                      {pfeature.productFeatureResults2[0]
                        ? (
                          <TerrasachaBadge variant="info">
                            {pfeature.productFeatureResults2[0].result.value}
                          </TerrasachaBadge>
                        )
                        : (
                          <TerrasachaBadge variant="neutral">
                            Sin resultado
                          </TerrasachaBadge>
                        )}
                    </TerrasachaTableCell>
                    
                    <TerrasachaTableCell>
                      <TerrasachaBadge variant={pfeature.isOnMainCard ? 'success' : 'neutral'}>
                        {pfeature.isOnMainCard ? "Sí" : "No"}
                      </TerrasachaBadge>
                    </TerrasachaTableCell>
                    
                    <TerrasachaTableCell>
                      <TerrasachaBadge variant={pfeature.isToBlockChain ? 'info' : 'neutral'}>
                        {pfeature.isToBlockChain ? "Sí" : "No"}
                      </TerrasachaBadge>
                    </TerrasachaTableCell>
                    
                    <TerrasachaTableCell>
                      <TerrasachaBadge variant={pfeature.isVerifable ? 'warning' : 'neutral'}>
                        {pfeature.isVerifable ? "Sí" : "No"}
                      </TerrasachaBadge>
                    </TerrasachaTableCell>
                    
                    <TerrasachaTableCell>
                      <button
                        className="btn-terrasacha-danger text-sm"
                        onClick={(e) =>
                          this.handleShowModalDeteleProductFeatureConfirmation(
                            e,
                            pfeature
                          )
                        }
                      >
                        Eliminar
                      </button>
                    </TerrasachaTableCell>
                  </>
                )}
              />
            </TerrasachaModal>
          );
        }
      }
    };
    const modalProductDescription = () => {
      if (isRenderModalProductDescription && selectedProductToShow !== null) {
        return (
          <TerrasachaModal
            isOpen={isRenderModalProductDescription}
            onClose={() => this.handleHideModalProductDescription()}
            title="Descripción del Proyecto"
            size="lg"
            footer={
              <TerrasachaModalButton
                variant="outline"
                onClick={() => this.handleHideModalProductDescription()}
              >
                Cerrar
              </TerrasachaModalButton>
            }
          >
            <div className="bg-terrasacha-light/5 p-4 rounded-lg border border-terrasacha-light/20">
              <h3 className="text-lg font-bold text-terrasacha-primary font-champagne mb-3">
                {selectedProductToShow.name || "Sin nombre"}
              </h3>
              <p className="text-terrasacha-secondary1 font-typographica leading-relaxed">
                {selectedProductToShow.description || "No hay descripción disponible para este proyecto."}
              </p>
            </div>
          </TerrasachaModal>
        );
      }
    };
    const modalDeleteProduct = () => {
      if (this.state.showModalDeleteProduct) {
        return (
          <TerrasachaModal
            isOpen={this.state.showModalDeleteProduct}
            onClose={() => this.setState({ showModalDeleteProduct: false })}
            title="⚠️ Confirmar Eliminación"
            size="md"
            footer={
              <>
                <TerrasachaModalButton
                  variant="outline"
                  onClick={() => this.setState({ showModalDeleteProduct: false })}
                >
                  Cancelar
                </TerrasachaModalButton>
                <TerrasachaModalButton
                  variant="danger"
                  disabled={this.state.isLoading}
                  onClick={async () => {
                    this.setState({ isLoading: true });
                    try {
                      await deleteAllInfoProduct(this.state.selectedProductToShow);
                      this.setState({
                        showModalDeleteProduct: false,
                        isLoading: false,
                      });
                      this.notify("Producto eliminado exitosamente.");
                    } catch (error) {
                      console.error("Error al eliminar el producto:", error);
                      this.setState({ isLoading: false });
                      this.notifyError(
                        "Error al eliminar el producto. Intente nuevamente."
                      );
                    }
                  }}
                >
                  {this.state.isLoading ? "Eliminando..." : "Confirmar Eliminación"}
                </TerrasachaModalButton>
              </>
            }
          >
            <div className="text-center">
              <div className="bg-terrasacha-danger/10 border border-terrasacha-danger/20 rounded-lg p-6 mb-4">
                <div className="text-6xl mb-4">🗑️</div>
                <h3 className="text-lg font-bold text-terrasacha-danger font-champagne mb-2">
                  Acción Irreversible
                </h3>
                <p className="text-terrasacha-secondary1 font-typographica">
                  ¿Estás seguro que quieres eliminar permanentemente este proyecto?
                </p>
              </div>
              
              {this.state.selectedProductToShow && (
                <div className="bg-terrasacha-light/5 p-4 rounded-lg border border-terrasacha-light/20">
                  <p className="text-sm text-terrasacha-secondary1 font-typographica">
                    <span className="font-bold">Proyecto:</span> {this.state.selectedProductToShow.name || "Sin nombre"}
                  </p>
                  <p className="text-sm text-terrasacha-secondary1 font-typographica mt-1">
                    <span className="font-bold">ID:</span> {this.state.selectedProductToShow.id}
                  </p>
                </div>
              )}
            </div>
          </TerrasachaModal>
        );
      }
    };
    const modalProductVerification = () => {
      if (isRenderModalVerifications && selectedProductToShow !== null) {
        let productFeatures = listPF.filter(
          (pf) =>
            pf.productID === selectedProductToShow.id &&
            pf.feature.isVerifable &&
            pf.documents.items.length > 0
        );
        let productFeaturesCopy = productFeatures;
        for (let i = 0; i < productFeaturesCopy.length; i++) {
          let productFeatureResult = this.state.PFR.filter(
            (pfr) => pfr.productFeatureID === productFeaturesCopy[i].id
          );
          productFeaturesCopy[i].productFeatureResults2 = productFeatureResult;
        }
        for (let i = 0; i < productFeaturesCopy.length; i++) {
          //renderiza pfr directamente desde pfr porque al hacer update de pf se rompe
          if (productFeaturesCopy[i].productFeatureResults2?.length > 0) {
            let filteredIsActivePFR = productFeaturesCopy[
              i
            ].productFeatureResults2.filter((pfr) => pfr.isActive === true);
            productFeaturesCopy[i].productFeatureResults2 = filteredIsActivePFR;
          }
        }
        if (productFeaturesCopy.length > 0) {
          return (
            <TerrasachaModal
              isOpen={isRenderModalVerifications}
              onClose={() => this.handleHideModalProductVerification()}
              title="✅ Verificaciones del Proyecto"
              size="xl"
              footer={
                <TerrasachaModalButton
                  variant="outline"
                  onClick={() => this.handleHideModalProductVerification()}
                >
                  Cerrar
                </TerrasachaModalButton>
              }
            >
              <ToastContainer />
              <TerrasachaTable
                title={`Verificaciones de ${selectedProductToShow.name || 'Proyecto'}`}
                subtitle="Gestión de documentos verificables y su estado de validación"
                headers={['Característica', 'Verificable', 'Documento', 'Estado/Acción']}
                data={productFeaturesCopy}
                renderRow={(pfeature) => (
                  <>
                    <TerrasachaTableCell variant="primary">
                      {pfeature.feature.name}
                    </TerrasachaTableCell>
                    
                    <TerrasachaTableCell>
                      <TerrasachaBadge variant={pfeature.feature.isVerifable ? 'success' : 'neutral'}>
                        {pfeature.feature.isVerifable ? "Verificable" : "No verificable"}
                      </TerrasachaBadge>
                    </TerrasachaTableCell>
                    
                    <TerrasachaTableCell>
                      <button
                        className="btn-terrasacha-outline text-sm"
                        onClick={() => this.handleDownload(pfeature)}
                      >
                        📥 Descargar
                      </button>
                    </TerrasachaTableCell>
                    
                    <TerrasachaTableCell>
                      <div className="flex items-center space-x-2">
                        <select
                          className="form-terrasacha-select text-sm min-w-32"
                          value={pfeature.documents.items[0].status}
                          onChange={(e) =>
                            this.props.handleUpdateDocumentStatus(
                              pfeature.documents.items[0].id,
                              e.target.value
                            )
                          }
                        >
                          {["pending", "accepted", "rejected"].map((op) => (
                            <option value={op} key={op}>
                              {op === "pending" ? "Pendiente" : 
                               op === "accepted" ? "Aceptado" : "Rechazado"}
                            </option>
                          ))}
                        </select>
                        <TerrasachaBadge 
                          variant={
                            pfeature.documents.items[0].status === "accepted" ? "success" :
                            pfeature.documents.items[0].status === "rejected" ? "danger" : "warning"
                          }
                        >
                          {pfeature.documents.items[0].status === "pending" ? "⏳ Pendiente" : 
                           pfeature.documents.items[0].status === "accepted" ? "✅ Aceptado" : "❌ Rechazado"}
                        </TerrasachaBadge>
                      </div>
                    </TerrasachaTableCell>
                  </>
                )}
              />
            </TerrasachaModal>
          );
        }
      }
    };
    const modalDeleteProductFeatureConfirmation = () => {
      if (
        isRenderModalDeleteProductFeatureConfirmation &&
        selectedProductFeatureToDelete !== null
      ) {
        return (
          <TerrasachaModal
            isOpen={isRenderModalDeleteProductFeatureConfirmation}
            onClose={() =>
              this.handleHideModalDeleteProductFeatureConfirmation()
            }
            title="⚠️ Confirmar Eliminación de Característica"
            size="md"
            footer={
              <>
                <TerrasachaModalButton
                  variant="outline"
                  onClick={() =>
                    this.handleHideModalDeleteProductFeatureConfirmation()
                  }
                >
                  Cancelar
                </TerrasachaModalButton>
                <TerrasachaModalButton
                  variant="danger"
                  disabled={
                    !this.state.selectedProductFeatureToDeleteConfirmationCheck
                  }
                  onClick={(e) => this.handleDeleteProductFeature(e)}
                >
                  Confirmar Eliminación
                </TerrasachaModalButton>
              </>
            }
          >
            <div className="space-y-6">
              {/* Mensaje principal */}
              <div className="bg-terrasacha-danger/10 border border-terrasacha-danger/20 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">🗑️</div>
                  <div>
                    <h3 className="text-lg font-bold text-terrasacha-danger font-champagne">
                      Eliminar Característica
                    </h3>
                    <p className="text-sm text-terrasacha-secondary1 font-typographica">
                      ¿Estás seguro de eliminar la característica <span className="font-bold">
                        {selectedProductFeatureToDelete.feature.name}
                      </span>?
                    </p>
                  </div>
                </div>
              </div>

              {/* Elementos que serán eliminados */}
              <div className="bg-terrasacha-light/5 border border-terrasacha-light/20 rounded-lg p-4">
                <h4 className="text-md font-bold text-terrasacha-primary font-champagne mb-3">
                  Elementos que serán eliminados:
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-white rounded border border-terrasacha-light/10">
                    <span className="text-terrasacha-secondary1 font-typographica">📄 Documentos</span>
                    <TerrasachaBadge variant="info">
                      {selectedProductFeatureToDelete.documents.items.length}
                    </TerrasachaBadge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded border border-terrasacha-light/10">
                    <span className="text-terrasacha-secondary1 font-typographica">✅ Validadores</span>
                    <TerrasachaBadge variant="warning">
                      {selectedProductFeatureToDelete.verifications.items.length}
                    </TerrasachaBadge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded border border-terrasacha-light/10">
                    <span className="text-terrasacha-secondary1 font-typographica">📊 Resultados</span>
                    <TerrasachaBadge variant="secondary">
                      {selectedProductFeatureToDelete.productFeatureResults.items.length}
                    </TerrasachaBadge>
                  </div>
                </div>
              </div>

              {/* Checkbox de confirmación */}
              <div className="bg-terrasacha-warning/10 border border-terrasacha-warning/20 rounded-lg p-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-terrasacha-primary border-terrasacha-light/30 rounded focus:ring-terrasacha-primary focus:ring-2"
                    onChange={(e) =>
                      this.setState({
                        selectedProductFeatureToDeleteConfirmationCheck:
                          e.target.checked,
                      })
                    }
                  />
                  <span className="font-typographica text-terrasacha-secondary1 font-medium">
                    Entiendo que esta acción es <span className="font-bold text-terrasacha-danger">irreversible</span> y confirmo que quiero proceder
                  </span>
                </label>
              </div>
            </div>
          </TerrasachaModal>
        );
      }
    };
    return (
      <div className="space-y-6">
        {renderProducts()}
        {modalProductImages()}
        {modalProductFeatures()}
        {modalProductVerification()}
        {modalProductDescription()}
        {modalDeleteProductFeatureConfirmation()}
        {modalDeleteProduct()}
      </div>
    );
  }
}
