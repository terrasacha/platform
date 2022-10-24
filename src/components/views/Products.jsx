import React, { Component } from 'react'
// Bootstrap
import { Button, Carousel, Container, Modal } from 'react-bootstrap'
// Util
import WebAppConfig from '../common/_conf/WebAppConfig'
// GraphQL
// import { API, graphqlOperation } from 'aws-amplify'
// import { listProducts } from '../../graphql/queries'

import './Views.css'

export default class Products extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isRenderModalProductImages: false,
            isRenderModalProductFeatures: false,
            selectedProductToShow: null,
        }
        this.handleLoadSelectedProduct = this.handleLoadSelectedProduct.bind(this)
        this.handleHideModalProductImages = this.handleHideModalProductImages.bind(this)
        this.handleHideModalProductFeatures = this.handleHideModalProductFeatures.bind(this)
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

    // RENDER
    render() {
        // State Varibles
        let {isRenderModalProductImages, selectedProductToShow, isRenderModalProductFeatures} = this.state
        let {products} = this.props
        let productsActive = products.filter(p => p.isActive)
        const urlS3Image = WebAppConfig.url_s3_public_images
        // Render Products on Cards
        const renderProductsOnCards = () => {
            if (products.length > 0) {
                return (
                    <div className=''>
                        {productsActive.map(product => (
/*                             <Col key={product.id + '_col'}>
                                <Card>
                                    <Card.Img variant="top" src={urlS3Image+product.images.items[0].imageURL} />
                                    <Card.Body>
                                        <Card.Title>{product.name}</Card.Title>
                                        <Card.Text>
                                            {product.description}
                                        </Card.Text>
                                        <Button variant="primary" onClick={ (e) => this.handleLoadSelectedProduct(e, product, 'show_modal_product_images')} >More pictures...</Button>
                                        <Button variant="primary" onClick={ (e) => this.handleLoadSelectedProduct(e, product, 'show_modal_product_features')}>What is included?</Button>
                                    </Card.Body>
                                </Card>
                            </Col> */
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
                                        <span className='product_price_number'>$1,223,584</span>
                                    </div>
                                    <div className='product_token_price'>
                                        <span className='product_price_tittle'>TOKEN PRICE</span>
                                        <span className='product_price_number_token'>$49,44</span>
                                    </div>
                                </div>
                                <div className='product_expected_income_container'>
                                    <div className='product_expected_income'>
                                        <span>Expected Income</span>
                                        <span>8.56%</span>
                                    </div>
                                    <div className='product_expected_income_text'>Not including capital appreciation</div>
                                </div>
                                <div className='product_rent_per_token'>
                                    <span>Rent per Token</span>
                                    <span className='rent_number'>$ 4.31 / year</span>
                                </div>
                                <div className='product_rent_start_day'>
                                    <span>Rent start day</span>
                                    <span className='rent_number'>2022-10-01</span>
                                </div>
                                <div className='product_buttons_container'>
                                    <div className='product_what_is_include'>
                                        <button  onClick={ (e) => this.handleLoadSelectedProduct(e, product, 'show_modal_product_images')} >More pictures...</button>
                                    </div>
                                    <div className='product_more_pictures'>
                                        <button  onClick={ (e) => this.handleLoadSelectedProduct(e, product, 'show_modal_product_features')}>What is included?</button>
                                    </div>
                                </div>
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
                            Modal heading
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Carousel>
                                {selectedProductToShow.images.items.map(image => (
                                    <Carousel.Item>
                                        <img
                                        className="d-block w-100"
                                        src={urlS3Image+image.imageURL}
                                        alt="First slide"
                                        />
                                        <Carousel.Caption>
                                        <h3>First slide label</h3>
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
                            Modal heading
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <ul>
                                {selectedProductToShow.productFeatures.items.map(productFeature => (
                                    <li key={productFeature.id}>
                                        {productFeature.feature.name}: {productFeature.feature.description}
                                    </li>
                                ))}
                            </ul>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={(e) => this.handleHideModalProductFeatures(e)}>Close</Button>
                        </Modal.Footer>
                    </Modal>
                )
            }
        }
        // RENDER
        return (
            <Container className='feature_block'>
                {renderProductsOnCards()}
                {renderModalProductImages()}
                {renderModalProductFeatures()}
            </Container>
        )
    }
}


