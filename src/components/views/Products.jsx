import React, { Component } from 'react'
// Bootstrap
import { Button, Carousel, Container, Modal, Table } from 'react-bootstrap'
// Util
import WebAppConfig from '../common/_conf/WebAppConfig'
// Components
import Orders from './Orders/Orders'

import './Views.css'

export default class Products extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isRenderProductsOnCards: true,
            isRenderModalProductImages: false,
            isRenderModalProductFeatures: false,
            isRenderOrderTokens: false,
            selectedProductToShow: null,
            product: null
        }
        this.handleLoadSelectedProduct = this.handleLoadSelectedProduct.bind(this)
        this.handleHideModalProductImages = this.handleHideModalProductImages.bind(this)
        this.handleHideModalProductFeatures = this.handleHideModalProductFeatures.bind(this)
        this.handleOrderTokens = this.handleOrderTokens.bind(this)
        this.handleGoBackFromProduct = this.handleGoBackFromProduct.bind(this)
    }

    componentDidMount = async () => {
    }
    
    async handleLoadSelectedProduct(event, pProduct, pModal) {
        if (pModal === 'show_modal_product_images') {
            this.setState({isRenderModalProductImages: true, selectedProductToShow: pProduct})
        }
        if (pModal === 'show_modal_product_features') {
            this.setState({isRenderModalProductFeatures: true, selectedProductToShow: pProduct})
        }
    }

    async handleHideModalProductImages(event) {
        this.setState({isRenderModalProductImages: !this.state.isRenderModalProductImages})
    }

    async handleHideModalProductFeatures(event) {
        this.setState({isRenderModalProductFeatures: !this.state.isRenderModalProductFeatures})
    }
    
    handleOnChangeInputForm = async(event) => {
        if (event.target.name === 'desiredSubscriptionTopic') {
            await this.setState({desiredSubscriptionTopic: event.target.value})
        }
        if (event.target.name === 'desiredPublishTopic') {
            await this.setState({desiredPublishTopic: event.target.value})
        }
    }

    async handleOrderTokens(event, pProduct) {
        console.log('handleOrderTokens: ')
        await this.setState({
            product: pProduct,
            isRenderOrderTokens: true,
            isRenderProductsOnCards: false,
            isRenderModalProductImages: false,
            isRenderModalProductFeatures: false,
        })
    }
    handleGoBackFromProduct(){
        this.setState({
            isRenderOrderTokens: false,
            isRenderProductsOnCards: true,
            product: null
        })
    }
    
        // RENDER
    render() {
        // State Varibles
        let {isRenderModalProductImages, selectedProductToShow, isRenderModalProductFeatures, isRenderOrderTokens, isRenderProductsOnCards} = this.state
        let {products} = this.props
        let productsActive = products.filter(p => p.isActive && p.status !== 'disabled')
        productsActive.map(product =>{
           product.productFeatures.items.map(pf =>{
                pf.productFeatureResults.items.map(pfr => {
                    if(pfr.isActive) pf.productFeatureResultAssigned = pfr.result.value  
                    return pfr
                })
            return pf
           })
           product.totalPrice = product.productFeatures.items.filter(item => item.feature.id === 'total_price')[0]
           product.tokens = product.productFeatures.items.filter(item => item.feature.id === 'tokens')[0]
           product.tokenPrice = product.productFeatures.items.filter(item => item.feature.id === 'token_price')[0]
           product.expectedIncome = product.productFeatures.items.filter(item => item.feature.id === 'expected_income')[0]
           product.rentPerToken = product.productFeatures.items.filter(item => item.feature.id === 'rent_per_token')[0]
           product.rentStartDay = product.productFeatures.items.filter(item => item.feature.id === 'rent_start_day')[0]
           
           return product
        })
        const urlS3Image = WebAppConfig.url_s3_public_images
        // Render Products on Cards
        const renderProductsOnCards = () => {
            if (products.length > 0 && isRenderProductsOnCards) {
                return (
                    <div className=''>
                        {productsActive.map(product => (
                        <div className='card_container' key={product.id + '_col'}>
                            <div className='product_status'>NEW</div>
                            <div className='product_info'>
                                <div className='product_image_container'>
                                    <img 
                                        className='product_image'
                                        src={urlS3Image+product.images.items[0].imageURL} 
                                        alt={product.name}/>
                                </div>
                                <div className='product_details'>
                                    <div className='product_details_wrapper'>
                                        <div className='product_name'><h3>{product.name}</h3></div>
                                        <div className='product_description'><p>{product.description}</p></div>
                                        <div className='product_prices_container'>
                                            <div className='product_total_price'>
                                                <span className='product_price_tittle'>TOTAL PRICE</span>
                                                <span className='product_price_number'>
                                                    ${product.totalPrice !== undefined? 
                                                    product.totalPrice.productFeatureResultAssigned? product.totalPrice.productFeatureResultAssigned : product.totalPrice.value 
                                                    : '!value'}
                                                </span>
                                            </div>
                                            <div className='product_token_price'>
                                                <span className='product_price_tittle'>TOKEN PRICE</span>
                                                <span className='product_price_number_token'>
                                                    ${product.tokenPrice !== undefined? 
                                                    product.tokenPrice.productFeatureResultAssigned? product.tokenPrice.productFeatureResultAssigned : product.tokenPrice.value 
                                                    : '!value'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className='product_expected_income_container'>
                                            <div className='product_expected_income'>
                                                <span>Expected Income</span>
                                                <span>
                                                    {product.expectedIncome !== undefined? 
                                                        product.expectedIncome.productFeatureResultAssigned? product.expectedIncome.productFeatureResultAssigned : product.expectedIncome.value 
                                                        : '!value'}%
                                                </span>
                                            </div>
                                            <div className='product_expected_income_text'>Not including capital appreciation</div>
                                        </div>
                                        <div className='product_rent_per_token'>
                                            <span>Rent per Token</span>
                                            <span className='rent_number'>
                                                ${product.rentPerToken !== undefined? 
                                                    product.rentPerToken.productFeatureResultAssigned? product.rentPerToken.productFeatureResultAssigned : product.rentPerToken.value 
                                                    : '!value'} / year
                                            </span>
                                        </div>
                                        <div className='product_rent_start_day'>
                                            <span>Rent start day</span>
                                            <span className='rent_number'>
                                                {product.rentStartDay !== undefined? 
                                                        product.rentStartDay.productFeatureResultAssigned? product.rentStartDay.productFeatureResultAssigned : product.rentStartDay.value 
                                                        : 'not confirmed'}
                                            </span>
                                        </div>
                                        <div className='product_buttons_container'>
                                            <div className='product_what_is_include'>
                                                <button  onClick={ (e) => this.handleLoadSelectedProduct(e, product, 'show_modal_product_images')} >More pictures</button>
                                            </div>
                                            <div className='product_more_pictures'>
                                                <button  onClick={ (e) => this.handleLoadSelectedProduct(e, product, 'show_modal_product_features')}>Features</button>
                                            </div>
                                        </div>
                                            <button  className='container_button_buy' onClick={ (e) => this.handleOrderTokens(e, product)}>Buy</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>

                )
            }
        }
        // Render Modal Product Images
        const renderModalProductImages = () => {
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
                            <Carousel>
                                {selectedProductToShow.images.items.map(image => (
                                    <Carousel.Item key={image.id}>
                                        <img
                                        className="d-block w-100"
                                        src={urlS3Image+image.imageURL}
                                        alt="First slide"
                                        />
                                        <Carousel.Caption>
                                        <h3>{image.title}</h3>
                                        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                                        </Carousel.Caption>
                                        </Carousel.Item>
                                ))}
                            </Carousel>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={(e) => this.handleHideModalProductImages()}>Close</Button>
                        </Modal.Footer>
                    </Modal>
                )
            }
        }
        // Render Modal Product Images
        const renderModalProductFeatures = () => {
            if (isRenderModalProductFeatures && selectedProductToShow !== null) {
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
                                Features 
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <Table striped hover size="sm" borderless>
                                <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Unit</th>
                                    <th>Value</th>
                                </tr>
                                </thead>
                                <tbody>
                                {selectedProductToShow.productFeatures.items.map(productFeature => (
                                    <tr key={productFeature.id}>
                                        <td>
                                            {productFeature.feature.featureType.name}
                                        </td>
                                        <td>
                                            {productFeature.feature.name}
                                        </td>
                                        <td>
                                            {productFeature.feature.description}
                                        </td>
                                        <td>
                                            {productFeature.feature.unitOfMeasure.engineeringUnit}
                                        </td>
                                        <td>
                                            {productFeature.productFeatureResultAssigned? 
                                            productFeature.productFeatureResultAssigned : productFeature.value}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={(e) => this.handleOrderTokens(e)}>Close</Button>
                        </Modal.Footer>
                    </Modal>
                )
            }
        }
        // Render Order Tokens
        const renderOrderTokens = () => {
            if (isRenderOrderTokens) {
                return (
                    <Orders product={this.state.product} handleGoBackFromProduct={this.handleGoBackFromProduct}></Orders>
                )
            }
        }
        // RENDER
        return (
            <Container className='feature_block'>
                {renderProductsOnCards()}
                {renderModalProductImages()}
                {renderModalProductFeatures()}
                {renderOrderTokens()}
            </Container>
        )
    }
}


