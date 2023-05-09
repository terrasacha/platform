import React, { Component } from 'react';
// Bootstrap
import { Button, Image, Modal, Table, Form, Col, ListGroup } from 'react-bootstrap';
// GraphQL
import { API, graphqlOperation } from 'aws-amplify';
import { listProductFeatureResults } from '../../../graphql/queries';
import { deleteProductFeatureResult, deleteVerification, deleteVerificationComment, updateProduct, deleteProductFeature } from '../../../graphql/mutations';
import { ToastContainer, toast } from 'react-toastify';

export default class ListProducts extends Component {
    constructor(props) {
        super(props)
        this.state = {
            PFR: [],
            isRenderModalProductFeatures: false,
            isRenderModalProductDescription: false,
            isRenderModalDeleteProductFeatureConfirmation: false,
            selectedProductToShow: null,
            selectedProductFeatureToDelete: null,
            selectedProductFeatureToDeleteHasDocuments: null,
            selectedProductFeatureToDeleteHasVerifications: null,
            selectedProductFeatureToDeleteHasVerificationComments: null,
            selectedProductFeatureToDeleteHasResults: null,
            selectedProductFeatureToDeleteConfirmationCheck: false,
            isRenderModalProductImages: false,
        }
        this.handleShowAreYouSureDeleteProduct = this.props.handleShowAreYouSureDeleteProduct.bind(this)
        this.handleUpdateProductIsActive = this.props.handleUpdateProductIsActive.bind(this)
        this.handleLoadEditProduct = this.props.handleLoadEditProduct.bind(this)
        this.handleDeleteFeatureProduct = this.props.handleDeleteFeatureProduct.bind(this)
        this.handleDeleteImageProduct = this.props.handleDeleteImageProduct.bind(this)
        this.handleLoadSelectedProduct = this.handleLoadSelectedProduct.bind(this)
        this.handleLoadSelectedProduct = this.handleLoadSelectedProduct.bind(this)
        this.handleShowModalDeteleProductFeatureConfirmation = this.handleShowModalDeteleProductFeatureConfirmation.bind(this)
        this.handleHideModalDeleteProductFeatureConfirmation = this.handleHideModalDeleteProductFeatureConfirmation.bind(this)
        this.handleHideModalProductImages = this.handleHideModalProductImages.bind(this)
        this.handleDeleteProductFeature = this.handleDeleteProductFeature.bind(this)
    }
    componentDidMount = async () => {
        await this.loadProductFeatureResults()
    }

    async loadProductFeatureResults() {
        const listProductFeatureResultsResult = await API.graphql(graphqlOperation(listProductFeatureResults))
        listProductFeatureResultsResult.data.listProductFeatureResults.items.sort((a, b) => (a.id > b.id) ? 1 : -1)
        this.setState({PFR: listProductFeatureResultsResult.data.listProductFeatureResults.items})
    }
    async handleLoadSelectedProduct(event, pProduct, pModal) {
        if (pModal === 'show_modal_product_images') {
            this.setState({isRenderModalProductImages: true, selectedProductToShow: pProduct})
        }
        if (pModal === 'show_modal_product_features') {
            this.setState({isRenderModalProductFeatures: true, selectedProductToShow: pProduct})
        }
        if (pModal === 'show_modal_product_description') {
            this.setState({isRenderModalProductDescription: true, selectedProductToShow: pProduct})
        }
    }

    async handleShowModalDeteleProductFeatureConfirmation(event, pProductFeature) {
        this.setState({isRenderModalDeleteProductFeatureConfirmation: !this.state.isRenderModalDeleteProductFeatureConfirmation, selectedProductFeatureToDelete: pProductFeature})
    }
    async certifyProduct(product){
        let updateInfo ={
            id: product.id,
            status: 'certified'
        }
        await API.graphql(graphqlOperation(updateProduct , { input:  updateInfo }))
    }
    async handleHideModalProductImages(event) {
        this.setState({isRenderModalProductImages: !this.state.isRenderModalProductImages})
    }
    async handleHideModalProductFeatures(event) {
        this.setState({isRenderModalProductFeatures: !this.state.isRenderModalProductFeatures})
    }
    async handleHideModalProductDescription(event) {
        this.setState({isRenderModalProductDescription: !this.state.isRenderModalProductDescription})
    }
    async handleHideModalDeleteProductFeatureConfirmation() {
        this.setState
            ({
                isRenderModalDeleteProductFeatureConfirmation: !this.state.isRenderModalDeleteProductFeatureConfirmation,
                selectedProductFeatureToDelete: null,
                selectedProductFeatureToDeleteConfirmationCheck: false,
            })
    }

    handleDeleteProductFeature = async() => {

        let productFeature = this.state.selectedProductFeatureToDelete
        let checked = this.state.selectedProductFeatureToDeleteConfirmationCheck
        if (productFeature != null && checked) {
            let isPossibleToDelete = true

            if (productFeature.product.status === 'in_blockchain' || productFeature.product.status === 'rejected') isPossibleToDelete = false
            if (productFeature.documents.items.length > 0) isPossibleToDelete = false

            if (isPossibleToDelete) {

                // Delete Verifications
                productFeature.verifications.items.map( (verification) => {
                    const inputVerificationToDelete = {
                        id: verification.id
                    }
                    API.graphql(graphqlOperation(deleteVerification, { input: inputVerificationToDelete }))
                })

                // Delete Verification Comments
                productFeature.verifications.items
                .map((verification) => verification.verificationComments.items)
                .map((verificationComment) => {
                    const inputVerificationCommentToDelete = {
                        id: verificationComment.id
                    }
                    API.graphql(graphqlOperation(deleteVerificationComment, { input: inputVerificationCommentToDelete }))
                })

                // Delete Results
                productFeature.productFeatureResults.items.map( (result) => {
                    const inputResultsToDelete = {
                        id: result.id
                    }
                    API.graphql(graphqlOperation(deleteProductFeatureResult, { input: inputResultsToDelete }))
                })
                
                // Delete Product Feature Relation
                API.graphql(graphqlOperation(deleteProductFeature, { input: {id : productFeature.id} }))
                
                this.handleHideModalDeleteProductFeatureConfirmation()
                
                this.notify('ProductFeature y componentes asociados eliminados existosamente')
            }

        }
        
    }

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
    }

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
    }

    // RENDER
    render() {
        let {products, urlS3Image, listPF} = this.props
        let {   
                selectedProductToShow,
                isRenderModalProductFeatures,
                isRenderModalProductImages,
                isRenderModalProductDescription,
                isRenderModalDeleteProductFeatureConfirmation,
                selectedProductFeatureToDelete,
                selectedProductFeatureToDeleteHasDocuments,
                selectedProductFeatureToDeleteHasResults,
                selectedProductFeatureToDeleteHasVerifications,
                selectedProductFeatureToDeleteHasVerificationComments,
            } = this.state
        // Render Products
        let productsData = products.map(product=>{
            product.toCertified = false
            let pfFiltered = product.productFeatures.items.filter(pf => pf.featureID === "CERTIFICACION_3TH_PARTY") 
            pfFiltered.map(pff =>{
              if( pff.documents.items[0]?.status === 'accepted' && pff.documents.items[0]?.isApproved) product.toCertified = true 
            })
            return product
          })
        const renderProducts = () => {
            if (productsData.length > 0) {
                return (
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th>Order</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Status</th>
                                <th>Description</th>
                                <th>Images</th>
                                <th>Product Features</th>
                                <th>Is Active</th>
                                <th>Action</th>
                                <th>Certify</th>
                            </tr>
                            </thead>
                            <tbody>
                            {products.map(product => (
                                <tr key={product.id}>
                                    <td>
                                        {product.order}
                                    </td>
                                    <td>
                                        {product.name?product.name : ""}
                                    </td>
                                    <td>
                                        {product.category? product.category.name: ""}
                                    </td>
                                    <td>
                                        {/* <Button 
                                            variant={product.status !== 'disabled'? 'danger': 'success'}
                                            size='md' 
                                            onClick={(e) => this.handleUpdateProductIsActive(product)}
                                        >{product.status !== 'disabled'? 'Disable': 'Activate'}</Button> */}
                                        <Form.Group >
                                            <Form.Select
                                                type='text'
                                                size='sm'
                                                value={product.status}
                                                onChange={(e) => this.props.handleUpdateProductStatus(product, e.target.value)}>
                                                {['draft', 'verified', 'in_blockchain', 'in_equilibrium'].map(
                                                    op => (<option value={op} key={op}>{op}</option>)
                                                )}
                                            </Form.Select>
                                        </Form.Group>
                                    </td>
                                    <td>
                                        <Button 
                                                variant='outline-primary'
                                                size='sm' 
                                                onClick={(e) => this.handleLoadSelectedProduct(e, product, 'show_modal_product_description')}
                                            >Description</Button>
                                        {/* {product.description} */}
                                    </td>
                                    <td>
                                        <Button 
                                                variant='outline-primary'
                                                size='sm' 
                                                onClick={(e) => this.handleLoadSelectedProduct(e, product, 'show_modal_product_images')}
                                            >Images</Button>
                                    </td>
                                    <td>
                                        <Button 
                                                variant='outline-primary'
                                                size='sm' 
                                                onClick={(e) => this.handleLoadSelectedProduct(e, product, 'show_modal_product_features')}
                                            >Product Features</Button>
                                    </td>
                                    <td>
                                        <Button 
                                            variant={product.isActive? 'danger': 'success'}
                                            size='sm' 
                                            onClick={(e) => this.handleUpdateProductIsActive(product)}
                                        >{product.isActive? 'Disable': 'Activate'}</Button>
                                    </td>
                                    <td>
                                        <Button 
                                            variant='primary'
                                            size='sm' 
                                            disabled={product.status === 'on_block_chain'} 
                                            onClick={(e) => this.handleLoadEditProduct(product, e)}
                                        >{product.status === 'on_block_chain'? 'Can not Edit' : 'Edit'}</Button>
                                    </td>
                                    <td>
                                        {product.toCertified?
                                            product.status !== 'certified'?
                                                <Button 
                                                variant='outline-success'
                                                size='sm' 
                                                onClick={() => this.certifyProduct(product)}
                                                >Certificar</Button>: "Certificado"
                                                : "Falta certificación"}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                )
            }
        }
        const modalProductImages = () => {
            if (isRenderModalProductImages && selectedProductToShow !== null) {

                return (
                    <Modal
                        show={isRenderModalProductImages}
                        onHide={(e) => this.handleHideModalProductImages(e)}
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                        >
                        <Modal.Header closeButton>
                            <Modal.Title id="contained-modal-title-vcenter">
                                Images
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <Table striped hover size="sm" borderless>
                        <thead>
                        <tr>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Order</th>
                            <th>Is On Carousel</th>
                            <th>Carousel Label</th>
                            <th>Carousel Description</th>
                        </tr>
                        </thead>
                        <tbody>
                        {selectedProductToShow.images.items.map(image => (
                            <tr key={image.id}>
                                <td>
                                    <Image
                                        src={urlS3Image+image.imageURL}
                                        rounded
                                        style={{height: 200, width: 'auto'}}
                                        />
                                </td>
                                <td>
                                    {image.title}
                                </td>
                                <td>
                                    {image.order === null ? 'N/A' : image.order}
                                </td>
                                <td>
                                    {image.isOnCarousel ? 'YES' : 'NO'}
                                </td>
                                <td>
                                    {image.carouselLabel}
                                </td>
                                <td>
                                    {image.carouselDescription}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={(e) => this.handleHideModalProductImages()}>Close</Button>
                        </Modal.Footer>
                    </Modal>
                )
        }
    }
    const modalProductFeatures = () => {
        if (isRenderModalProductFeatures && selectedProductToShow !== null) {
        let productFeatures = listPF.filter(pf => pf.productID === selectedProductToShow.id);
            let productFeaturesCopy = productFeatures
            for(let i = 0; i < productFeaturesCopy.length; i++){
                let productFeatureResult = this.state.PFR.filter(pfr => pfr.productFeatureID === productFeaturesCopy[i].id)
                productFeaturesCopy[i].productFeatureResults2 = productFeatureResult
            }
            for(let i = 0; i < productFeaturesCopy.length; i++){ //renderiza pfr directamente desde pfr porque al hacer update de pf se rompe 
                if(productFeaturesCopy[i].productFeatureResults2?.length > 0){
                    let filteredIsActivePFR = productFeaturesCopy[i].productFeatureResults2.filter(pfr => pfr.isActive === true)
                    productFeaturesCopy[i].productFeatureResults2 = filteredIsActivePFR
                }
            }
            if(productFeaturesCopy.length > 0){
            return (
                <Modal
                    show={isRenderModalProductFeatures}
                    onHide={(e) => this.handleHideModalProductFeatures(e)}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Product Features
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <ToastContainer/>
                    <Table striped hover size="sm" borderless>
                        <thead>
                        <tr>
                            <th>Feature ID</th>
                            <th>Value</th>
                            <th>Result Assigned</th>
                            <th>Main Card</th>
                            <th>Is to BlockChain?</th>
                            <th>Is Verifable?</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {productFeaturesCopy?.map((pfeature, idx) => (
                            <tr key={pfeature.id}>
                                <td>
                                    {pfeature.feature.name} / {pfeature.feature.description}
                                </td>
                                <td>
                                    {pfeature.value}
                                </td>
                                <td>
                                    {pfeature.productFeatureResults2[0]?   
                                        pfeature.productFeatureResults2[0].result.value : 'no result assigned'}
                                </td>
                                <td>
                                    {pfeature.isOnMainCard? 'YES' : 'NO'}
                                </td>
                                <td>
                                    {pfeature.isToBlockChain? 'YES' : 'NO'}
                                </td>
                                <td>
                                    {pfeature.isVerifable? 'YES' : 'NO'}
                                </td>
                                <td>
                                <Button 
                                    variant='danger'
                                    size='sm'
                                    onClick={(e) => this.handleShowModalDeteleProductFeatureConfirmation(e, pfeature)}
                                    >Delete</Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={(e) => this.handleHideModalProductFeatures(e)}>Close</Button>
                    </Modal.Footer>
                </Modal>
            )}
        }
    }
    const modalProductDescription = () => {
        if (isRenderModalProductDescription && selectedProductToShow !== null) {
            return (
                <Modal
                    show={isRenderModalProductDescription}
                    onHide={(e) => this.handleHideModalProductDescription(e)}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Description
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>{selectedProductToShow.description}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={(e) => this.handleHideModalProductDescription(e)}>Close</Button>
                    </Modal.Footer>
                </Modal>
            )
        }
    }
    const modalDeleteProductFeatureConfirmation = () => {
        if (isRenderModalDeleteProductFeatureConfirmation && selectedProductFeatureToDelete !== null) {
            return (
                <Modal
                    show={isRenderModalDeleteProductFeatureConfirmation}
                    onHide={() => this.handleHideModalDeleteProductFeatureConfirmation()}
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Confirmacion
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Estas de acuerdo con borrar el ProductFeature: {selectedProductFeatureToDelete.feature.name} ?</p>
                        <p>Seran eliminados los siguientes elementos:</p>
                        <ListGroup>
                            <ListGroup.Item>{ "Documentos (" + selectedProductFeatureToDelete.documents.items.length + ")"}</ListGroup.Item>
                            <ListGroup.Item>{ "Validadores (" + selectedProductFeatureToDelete.verifications.items.length + ")"} </ListGroup.Item>
                            <ListGroup.Item>{ "Resultados (" + selectedProductFeatureToDelete.productFeatureResults.items.length + ")"}</ListGroup.Item>
                        </ListGroup>
                        <Form.Group className="my-3" controlId="formBasicCheckbox">
                            <Form.Check 
                                type="checkbox" 
                                label="Estoy de acuerdo"
                                onChange={(e) => this.setState({ selectedProductFeatureToDeleteConfirmationCheck: e.target.checked })}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            size='sm'
                            onClick={() => this.handleHideModalDeleteProductFeatureConfirmation()}
                            >Cancelar</Button>
                        <Button 
                            variant='danger'
                            size='sm'
                            disabled={!this.state.selectedProductFeatureToDeleteConfirmationCheck}
                            onClick={(e) => this.handleDeleteProductFeature(e)}
                        >Eliminar</Button>
                    </Modal.Footer>
                </Modal>
            )
        }
    }
        return (
            <> 
                <h1>Product List</h1>
                {renderProducts()}
                {modalProductImages()}
                {modalProductFeatures()}
                {modalProductDescription()}
                {modalDeleteProductFeatureConfirmation()}
            </>
        )
    }
}
