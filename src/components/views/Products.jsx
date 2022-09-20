import React, { Component } from 'react'
// Bootstrap
import { Container, Button, Row, Col, Card, Modal, Carousel } from 'react-bootstrap'
// GraphQL
// import { API, graphqlOperation } from 'aws-amplify'
// import { listProducts } from '../../graphql/queries'

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
        console.log(this.props.products)
    }
    
    async handleLoadSelectedProduct(event, pProduct, pModal) {
        if (pModal === 'show_modal_product_images') {
            this.setState({isRenderModalProductImages: true, selectedProductToShow: pProduct})
        }
        if (pModal === 'show_modal_product_features') {
            console.log("modal productFeature", pProduct)
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
        const urlS3Image = 'https://kiosuanbcrjsappcad3eb2dd1b14457b491c910d5aa45dd145518-dev.s3.amazonaws.com/public/'
        // Render Products on Cards
        const renderProductsOnCards = () => {
            if (products.length > 0) {
                return (
                    <Row xs={1} md={3} lg={4}>
                        {products.map(product => (
                            <Col key={product.id + '_col'}>
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
                            </Col>
                        ))}
                    </Row>
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
                                    <li>
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
            <Container style={{paddingTop: 50}}>
                {renderProductsOnCards()}
                {renderModalProductImages()}
                {renderModalProductFeatures()}
            </Container>
        )
    }
}
