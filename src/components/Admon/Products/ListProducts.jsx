import React, { Component } from 'react'
// Bootstrap
import { Table, Image, Button } from 'react-bootstrap'


export default class ListProducts extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    // RENDER
    render() {
        let {products, urlS3Image} = this.props

        // Render Products
        const renderProducts = () => {
            if (products.length > 0) {
                return (
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>Order</th>
                            <th>Category</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Images</th>
                            <th>Features</th>
                            <th>Is Active</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>
                                    {product.order}
                                </td>
                                <td>
                                    {product.category.name}
                                </td>
                                <td>
                                    {product.name}
                                </td>
                                <td>
                                    {product.description}
                                </td>
                                <td>
                                    {/* {renderProductImages(product, product.images.items)} */}
                                </td>
                                <td>
                                    {/* {renderProductFeatures(product,product.features.items)} */}
                                </td>
                                <td>
                                    {product.isActive ? 'YES' : 'NO'}
                                </td>
                                <td>
                                    <Button 
                                        variant='primary'
                                        size='md' 
                                        block
                                        onClick={(e) => this.handleLoadEditProduct(product, e)}
                                    >Edit</Button>
                                    <Button 
                                        variant='danger'
                                        size='md' 
                                        block
                                        onClick={(e) => this.handleShowAreYouSureDeleteProduct(product, e)}
                                    >Delete</Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                )
            }
        }
        // Render product images
        const renderProductImages = (pProduct, pProductImages) => {
            if (pProductImages.length > 0) {
                return (
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Order</th>
                            <th>Is On Carousel</th>
                            <th>Carousel Label</th>
                            <th>Carousel Description</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {pProductImages.map(image => (
                            <tr key={image.id}>
                                <td>
                                    <Image
                                        src={urlS3Image+image.imageURL}
                                        rounded
                                        style={{height: 100, width: 'auto'}}
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
                                <td>
                                    <Button 
                                        variant='danger'
                                        size='sm' 
                                        block
                                        onClick={(e) => this.handleDeleteImageProduct(pProduct, image, e)}
                                    >
                                    DELETE
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                )
            }
        }
        // Render product features
        const renderProductFeatures = (pProduct, pProductFeatures) => {
            if (pProductFeatures.length > 0) {
                return (
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Is to BlockChain?</th>
                            <th>Is Verifable?</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {pProductFeatures.map(feature => (
                            <tr key={feature.id}>
                                <td>
                                    {feature.name}
                                </td>
                                <td>
                                    {feature.description}
                                </td>
                                <td>
                                    {feature.isToBlockChain? 'YES' : 'NO'}
                                </td>
                                <td>
                                    {feature.isVerifable? 'YES' : 'NO'}
                                </td>
                                <td>
                                    <Button 
                                        variant='danger'
                                        size='sm' 
                                        block
                                        onClick={(e) => this.handleDeleteFeatureProduct(pProduct, feature, e)}
                                    >
                                    DELETE
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                )
            }
        }

        return (
            <> 
                <h1>Product List</h1>
                {renderProducts()}
            </>
        )
    }
}
