import React, { Component } from 'react';
// Bootstrap
import { Button, Container, Image, Table } from 'react-bootstrap';
// GraphQL
import { API, graphqlOperation } from 'aws-amplify';
import { listProductFeatureResults } from '../../../graphql/queries';


export default class ListProducts extends Component {
    constructor(props) {
        super(props)
        this.state = {
            PFR: [],
        }
        this.handleShowAreYouSureDeleteProduct = this.props.handleShowAreYouSureDeleteProduct.bind(this)
        this.handleLoadEditProduct = this.props.handleLoadEditProduct.bind(this)
        this.handleDeleteFeatureProduct = this.props.handleDeleteFeatureProduct.bind(this)
        this.handleDeleteImageProduct = this.props.handleDeleteImageProduct.bind(this)
    }
    componentDidMount = async () => {
        await this.loadProductFeatureResults()
    }

    async loadProductFeatureResults() {
        const listProductFeatureResultsResult = await API.graphql(graphqlOperation(listProductFeatureResults))
        listProductFeatureResultsResult.data.listProductFeatureResults.items.sort((a, b) => (a.id > b.id) ? 1 : -1)
        this.setState({PFR: listProductFeatureResultsResult.data.listProductFeatureResults.items})
    }
    // RENDER
    render() {
        let {products, urlS3Image, listPF} = this.props

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
                                <th>Status</th>
                                <th>Description</th>
                                <th>Images</th>
                                <th>Product Features</th>
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
                                        {product.status}
                                    </td>
                                    <td>
                                        {product.description}
                                    </td>
                                    <td>
                                        {renderProductImages(product, product.images.items)}
                                    </td>
                                    <td>
                                        {/* {renderProductFeatures(product,product.productFeatures.items)} */}
                                        {renderProductFeatures(product)}
                                    </td>
                                    <td>
                                        {product.isActive ? 'YES' : 'NO'}
                                    </td>
                                    <td>
                                        <Button 
                                            variant='primary'
                                            size='md' 
                                            disabled={product.status === 'on_block_chain'} 
                                            onClick={(e) => this.handleLoadEditProduct(product, e)}
                                        >{product.status === 'on_block_chain'? 'Can not Edit' : 'Edit'}</Button>
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
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                )
            }
        }
        // Render product features
        const renderProductFeatures = (pProduct) => {
            let productFeatures = listPF.filter(pf => pf.productID === pProduct.id);
            let productFeaturesCopy = productFeatures
            for(let i = 0; i < productFeaturesCopy.length; i++){
                let productFeatureResult = this.state.PFR.filter(pfr => pfr.productFeatureID === productFeaturesCopy[i].id)
                productFeaturesCopy[i].productFeatureResults2 = productFeatureResult
            }
            //No borrar por favor
/*             for(let i = 0; i < productFeaturesCopy.length; i++){
                if(productFeaturesCopy[i].productFeatureResults?.items.length > 0){
                    let filteredIsActivePFR = productFeaturesCopy[i].productFeatureResults.items.filter(pfr => pfr.isActive === true)
                    productFeaturesCopy[i].productFeatureResults.items = filteredIsActivePFR
                }
            } */
            for(let i = 0; i < productFeaturesCopy.length; i++){ //renderiza pfr directamente desde pfr porque al hacer update de pf se rompe 
                if(productFeaturesCopy[i].productFeatureResults2?.length > 0){
                    let filteredIsActivePFR = productFeaturesCopy[i].productFeatureResults2.filter(pfr => pfr.isActive === true)
                    productFeaturesCopy[i].productFeatureResults2 = filteredIsActivePFR
                }
            }
            if(productFeaturesCopy.length > 0){
                return (
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>Feature ID</th>
                            <th>Value</th>
                            <th>Result Assigned</th>
                            <th>Main Card</th>
                            <th>Is to BlockChain?</th>
                            <th>Is Verifable?</th>
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
