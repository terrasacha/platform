import React, { Component } from 'react'
// Amplify
import { withAuthenticator } from '@aws-amplify/ui-react'
// Bootstrap
import { Container, Button, Form, Row, Col, Spinner, Table, Alert, Image, Card, Modal } from 'react-bootstrap'
// Auth css custom
import Bootstrap from "../../common/themes"
// GraphQL
import { API, graphqlOperation } from 'aws-amplify'
import { listProducts, listCategories, listFeatures, listProductFeatures } from '../../../graphql/queries'
import { createFeature, createImage, createProduct, updateFeature, updateImage, updateProduct, deleteProduct, deleteImage, deleteFeature, createProductFeature } from '../../../graphql/mutations'
import { onCreateProduct, onUpdateProduct } from '../../../graphql/subscriptions'
// Utils 
import Select from 'react-select'
// import 'moment-timezone'

// AWS S3 Storage
import { Storage } from 'aws-amplify'
import { v4 as uuidv4 } from 'uuid'

class Products extends Component {

    constructor(props) {
        super(props)
        this.state = {
            CRUD_Product: {
                id: uuidv4().replaceAll('-','_'),
                name: '',
                description: '',
                isActive: true,
                counterNumberOfTimesBuyed: 0,
                amountToBuy: 0.0,
                categoryID: '',
                images: [],
                features: [],
            },
            CRUDButtonName: 'CREATE',
            isCRUDButtonDisable: true,
            isImageUploadingFile: false,
            products: [],
            categorySelectList: [],
            featuresSelectList: [],
            selectedCategory: null,
            selectedFeature: null,
            valueProductFeature: 0,
            isShowModalAreYouSureDeleteProduct: false,
            productToDelete: null,
        }
        this.handleOnChangeInputForm = this.handleOnChangeInputForm.bind(this)
        this.handleChangeProductImageProperty = this.handleChangeProductImageProperty.bind(this)
        this.handleAddNewImageToActualProduct = this.handleAddNewImageToActualProduct.bind(this)
        this.handleCRUDProduct = this.handleCRUDProduct.bind(this)
        this.handleOnSelectCategory = this.handleOnSelectCategory.bind(this)
        this.handleOnSelectFeature = this.handleOnSelectFeature.bind(this)
        this.handleLoadEditProduct = this.handleLoadEditProduct.bind(this)
        this.handleShowAreYouSureDeleteProduct = this.handleShowAreYouSureDeleteProduct.bind(this)
        this.handleDeleteProduct = this.handleDeleteProduct.bind(this)
        this.handleHideModalAreYouSureDeleteProduct = this.handleHideModalAreYouSureDeleteProduct.bind(this)
        this.handleDeleteImageProduct = this.handleDeleteImageProduct.bind(this)
        this.handleDeleteFeatureProduct = this.handleDeleteFeatureProduct.bind(this)
    }

    componentDidMount = async () => {
        // if (this.props.user.id !== '') {
        //     if (this.props.user.role === 'admon') {
            await this.loadProducts()
            await this.loadCategorysSelectItems()
            await this.loadFeaturesSelectItems()
                // Subscriptions
                // OnCreate Product
                let tempProducts = this.state.products
                this.createProductListener = API.graphql(graphqlOperation(onCreateProduct))
                .subscribe({
                    next: createdProductData => {
                        let tempOnCreateProduct = createdProductData.value.data.onCreateProduct

                        // tempOnCreateProduct.prices.items = result.data.listPrices.items
                        tempProducts.push(tempOnCreateProduct)
                        // Ordering products by name
                        tempProducts.sort((a, b) => (a.name > b.name) ? 1 : -1)
                        this.setState((state) => ({products: tempProducts}))
                    }
                })

                // OnUpdate Product
                this.updateProductListener = API.graphql(graphqlOperation(onUpdateProduct))
                .subscribe({
                    next: updatedProductData => {
                        let tempProducts = this.state.products.map((mapProduct) => {
                            if (updatedProductData.value.data.onUpdateProduct.id === mapProduct.id) {
                                return updatedProductData.value.data.onUpdateProduct
                            } else {
                                return mapProduct
                            }
                        })
                        // Ordering products by name
                        tempProducts.sort((a, b) => (a.name > b.name) ? 1 : -1)
                        this.setState((state) => ({products: tempProducts}))
                    }
                })

        //     }
        // } else {
        //     this.props.changeHeaderNavBarRequest('admon_profile')
        // }
    }

    async addNewImageToActualProductImages() {
        let tempCRUD_Product = this.state.CRUD_Product
        let newProductImage = {
            id: uuidv4().replaceAll('-','_'),
            imageURL: '',
            format: '',
            title: '',
            imageURLToDisplay: '',
            isOnCarousel: false,
            carouselLabel: '',
            carouselDescription: '',
            productID: '',
        }
        tempCRUD_Product.images.push(newProductImage)
        this.setState({CRUD_Product: tempCRUD_Product})
    }

    async addNewFeatureToActualProductFeatures() {
        let tempCRUD_Product = this.state.CRUD_Product
        let newProductFeature = {
            id: uuidv4().replaceAll('-','_'),
            name: '',
            description: '',
        }
        tempCRUD_Product.features.push(newProductFeature)
        this.setState({CRUD_Product: tempCRUD_Product})
    }

    handleOnSelectCategory(event) {
        this.setState({selectedCategory: event.value})
        console.log(this.state.selectedCategory)
        this.validateCRUDProduct()
    }
    handleOnSelectFeature(event) {
        this.setState({selectedFeature: event.value})
        console.log(this.state.valueProductFeature)
        this.validateCRUDProduct()
    }

    async loadCategorysSelectItems() {
        let categorysSelectItems = []
        const listCategoriesResult = await API.graphql(graphqlOperation(listCategories))
        if (listCategoriesResult.data.listCategories.items.length > 0) {
            let tempCategorys = listCategoriesResult.data.listCategories.items
            // Ordering categorys by name
            tempCategorys.sort((a, b) => (a.name > b.name) ? 1 : -1)
            tempCategorys.map( (category) => {
                categorysSelectItems.push( {value: category, label: category.name})
                return category
            })
        }
        this.setState({categorySelectList: categorysSelectItems})
    }
    async loadFeaturesSelectItems() {
        let featuresSelectItems = []
        const listFeaturesResult = await API.graphql(graphqlOperation(listFeatures))
        if (listFeaturesResult.data.listFeatures.items.length > 0) {
            let tempFeatures = listFeaturesResult.data.listFeatures.items
            // Ordering features by name
            tempFeatures.sort((a, b) => (a.name > b.name) ? 1 : -1)
            tempFeatures.map( (features) => {
                featuresSelectItems.push( {value: features, label: features.name})
                return features
            })
        }
        this.setState({featureSelectList: featuresSelectItems})
    }

    async loadProducts() {
        const listProductsResult = await API.graphql(graphqlOperation(listProducts))
        listProductsResult.data.listProducts.items.sort((a, b) => (a.order > b.order) ? 1 : -1)
        this.setState({products: listProductsResult.data.listProducts.items})
    }

    async validateCRUDProduct() {
        if ( this.state.selectedCategory !== null && 
             this.state.CRUD_Product.name !== '' && 
             this.state.CRUD_Product.description !== '' && 
             this.state.CRUD_Product.images.length > 0 &&
             this.state.CRUD_Product.features.length > 0 ) {
            this.setState({isCRUDButtonDisable: false})
        }
    }
    
    async handleCRUDProduct() {
        const tempCRUD_Product = this.state.CRUD_Product

        if (this.state.CRUDButtonName === 'CREATE') {
            // Creating new product
            const payLoadNewProduct = {
                id: tempCRUD_Product.id,
                name: tempCRUD_Product.name,
                description: tempCRUD_Product.description,
                isActive: true,
                counterNumberOfTimesBuyed: 0,
                categoryID: this.state.selectedCategory.id,
                order: tempCRUD_Product.order,
            }
            await API.graphql(graphqlOperation(createProduct, { input: payLoadNewProduct }))
            // Creating Product=>images
            tempCRUD_Product.images.map( async(image) => {
                const newImagePayLoad = {
                    productID: tempCRUD_Product.id,
                    id: image.id,
                    imageURL: image.imageURL,
                    format: image.format,
                    title: image.title,
                    isOnCarousel: image.isOnCarousel,
                    carouselLabel: image.carouselLabel,
                    carouselDescription: image.carouselDescription,
                    isActive: true,
                    order: image.order,
                }
                await API.graphql(graphqlOperation(createImage, { input: newImagePayLoad }))
                return image
            })
            // Creating Product => Features
            tempCRUD_Product.features.map( async(feature) => {
                const newProductFeature = {
                    productID: tempCRUD_Product.id,
                    id: this.state.selectedFeature.id,
                    value: this.state.valueProductFeature,
                    isToBlockChain: feature.isToBlockChain,
                    isVerifable: feature.isVerifable,
                }
                await API.graphql(graphqlOperation(createProductFeature, { input: newProductFeature }))
                return feature
            })

            // Clean CRUD_Product
            await this.cleanProductOnCreate()
        }

        if (this.state.CRUDButtonName === 'UPDATE') {
            // Updating new product
            const payLoadNewProduct = {
                id: tempCRUD_Product.id,
                name: tempCRUD_Product.name,
                description: tempCRUD_Product.description,
                isActive: true,
                counterNumberOfTimesBuyed: 0,
                categoryID: this.state.selectedCategory.id,
                order: tempCRUD_Product.order,
            }
            await API.graphql(graphqlOperation(updateProduct, { input: payLoadNewProduct }))
            // Updating Product=>images
            let indexProduct = this.state.products.findIndex(product => product.id === tempCRUD_Product.id)
            tempCRUD_Product.images.map( async(image) => {
                const imagePayLoad = {
                    productID: tempCRUD_Product.id,
                    id: image.id,
                    imageURL: image.imageURL,
                    format: image.format,
                    title: image.title,
                    isOnCarousel: image.isOnCarousel,
                    carouselLabel: image.carouselLabel,
                    carouselDescription: image.carouselDescription,
                    isActive: true,
                    order: image.order,
                }
                if (indexProduct !== -1) {
                    let indexImage = this.state.products[indexProduct].images.items.findIndex(fImage => fImage.id === image.id)
                    if (indexImage !== -1) {
                        await API.graphql(graphqlOperation(updateImage, { input: imagePayLoad }))
                    } else {
                        await API.graphql(graphqlOperation(createImage, { input: imagePayLoad }))
                    }
                }
            })
            // Updating Product => Features
            tempCRUD_Product.features.map( async(feature) => {
                const featurePayload = {
                    productID: tempCRUD_Product.id,
                    id: feature.id,
                    name: feature.name,
                    description: feature.description,
                    isToBlockChain: feature.isToBlockChain,
                    isVerifable: feature.isVerifable,
                }
                if (indexProduct !== -1) {
                    let indexFeature = this.state.products[indexProduct].features.items.findIndex(fFeature => fFeature.id === feature.id)
                    if (indexFeature !== -1) {
                        await API.graphql(graphqlOperation(updateFeature, { input: featurePayload }))
                    } else {
                        await API.graphql(graphqlOperation(createFeature, { input: featurePayload }))
                    }
                }
            })
            // Clean CRUD_Product
            await this.cleanProductOnCreate()
        }
    }
    
    setProductImageAndDownloadURL = async (product) => {
        Storage.get(product.image, { expires: 600 })
            .then(result => {
                this.setState({productImageURLToDisplay: result})
            })
            .catch(err => console.log(err))
        
    }

    handleLoadEditProduct= async(product, event) => {
        const tempCRUD_Product = {
            id: product.id,
            name: product.name,
            description: product.description,
            isActive: product.isActive,
            counterNumberOfTimesBuyed: 0,
            amountToBuy: 0.0,
            categoryID: product.categoryID,
            images: product.images.items,
            features: product.features.items,
            order: product.order,
        }
        
        const tempCategory = {
            id: product.category.id,
            isSelected: true,
            name: product.category.name,
        }  
        await this.setState({CRUD_Product: tempCRUD_Product, selectedCategory: tempCategory, CRUDButtonName: 'UPDATE'})
        this.validateCRUDProduct()
    }

    handleDeleteImageProduct= async(pProduct, pImage, event) => {
        let tempProducts = []
        let tempImages = []
        
        this.state.products.map( (product) => {
            if (product.id === pProduct.id) {
                // Deleting image from UI
                product.images.items.map( (image) => {
                    if (image.id !== pImage.id) {
                        tempImages.push(image)
                    }
                    return image
                })
                product.images.items = tempImages
                tempProducts.push(product)
            } else {
                tempProducts.push(product)
            }
            return product
        })
        await this.setState({products: tempProducts})
        // Deleting the Image
        const inputImageToDelete = {
            id: pImage.id
        }
        API.graphql(graphqlOperation(deleteImage, { input: inputImageToDelete }))
    }

    handleDeleteFeatureProduct= async(pProduct, pFeature, event) => {
        let tempProducts = []
        let tempFeatures = []
        
        this.state.products.map( (product) => {
            if (product.id === pProduct.id) {
                // Deleting feature from UI
                product.features.items.map( (feature) => {
                    if (feature.id !== pFeature.id) {
                        tempFeatures.push(feature)
                    }
                    return feature
                })
                product.features.items = tempFeatures
                tempProducts.push(product)
            } else {
                tempProducts.push(product)
            }
            return product
        })
        await this.setState({products: tempProducts})
        // Deleting the Feature
        const inputFeatureToDelete = {
            id: pFeature.id
        }
        API.graphql(graphqlOperation(deleteFeature, { input: inputFeatureToDelete }))
    }

    handleDeleteProduct= async() => {
        const tempProductToDelete = this.state.productToDelete
        if (tempProductToDelete !== null) {
            // Deleting Product Images
            tempProductToDelete.images.items.map( (image) => {
                const inputImageToDelete = {
                    id: image.id
                }
                API.graphql(graphqlOperation(deleteImage, { input: inputImageToDelete }))
                return image
            })
            // Deleting Product Features
            tempProductToDelete.features.items.map( (feature) => {
                const inputFeatureToDelete = {
                    id: feature.id
                }
                API.graphql(graphqlOperation(deleteFeature, { input: inputFeatureToDelete }))
                return feature
            })
            const inputProductToDelete = {
                id: tempProductToDelete.id
            }
            // Deleting the Product
            API.graphql(graphqlOperation(deleteProduct, { input: inputProductToDelete }))
            // Set null productToDelete
            this.setState({productToDelete: null})
        }
    }

    handleShowAreYouSureDeleteProduct= async(product, event) => { 
        await this.setState(
            {
                isShowModalAreYouSureDeleteProduct: !this.isShowModalAreYouSureDeleteProduct,
                productToDelete: product
            })
    }
    
    async handleAddNewImageToActualProduct(event) {
        this.addNewImageToActualProductImages()
        this.validateCRUDProduct()
    }

    async handleAddNewFeatureToActualProduct(event) {
        console.log(this.state.CRUD_Product.features)
        this.addNewFeatureToActualProductFeatures()
        this.validateCRUDProduct()
    }

    async cleanProductOnCreate() {
         this.setState({
            CRUD_Product: {
                id: uuidv4().replaceAll('-','_'),
                name: '',
                description: '',
                isActive: true,
                counterNumberOfTimesBuyed: 0,
                amountToBuy: 0.0,
                categoryID: '',
                images: [],
                features: [],
            },
            CRUDButtonName: 'CREATE',
            isCRUDButtonDisable: true,
            isImageUploadingFile: false,
            products: [],
            categorySelectList: [],
            selectedCategory: null,
        })
    }

    handleOnChangeInputForm = async(event, pProperty) => {
        let tempCRUD_Product = this.state.CRUD_Product
        if (event.target.name === 'CRUD_ProductName') {
            tempCRUD_Product.name = event.target.value
        }
        if (event.target.name === 'CRUD_ProductDescription') {
            tempCRUD_Product.description = event.target.value
        }
        if (event.target.name === 'CRUD_ProductOrder') {
            tempCRUD_Product.order = event.target.value
        }
        if (pProperty === 'productIsActive') {
            tempCRUD_Product.isActive = !tempCRUD_Product.isActive
        }

        await this.setState({CRUD_Product: tempCRUD_Product})
        this.validateCRUDProduct()
    }

    async handleChangeProductImageProperty(event, pImage, pProperty) {
        let uploadImageResult = null
        let imageId = ''
        if (pProperty === 'carouselImage') {
            const { target: { files } } = event;
            const [file,] = files || [];
            if (!file) {
                return
            }
            // Creating image ID
            let fileNameSplitByDotfileArray = file.name.split('.')
            imageId = fileNameSplitByDotfileArray[0].replaceAll(' ', '_').replaceAll('-','_')
            // Getting extension
            let imageExtension = fileNameSplitByDotfileArray[fileNameSplitByDotfileArray.length-1]
            let imageName = imageId + '.' + imageExtension
            // Uploading image
            this.setState({isImageUploadingFile: true})
            uploadImageResult = await Storage.put(imageName, file, {
                level: "public",
                contentType: "image/jpeg",
              });
            this.setState({isImageUploadingFile: false})
        }

        let tempCRUD_Product = this.state.CRUD_Product;
        let tempImages = tempCRUD_Product.images.map( (image) => {
            if (image.id === pImage.id) {
                if (pProperty === 'newProductImageTitle') {
                    image.title = event.target.value
                }
                if (pProperty === 'newProductImageOrder') {
                    image.order = event.target.value
                }
                if (pProperty === 'isOnCarousel') {
                    image.isOnCarousel = !image.isOnCarousel
                }
                if (pProperty === 'carouselLabel') {
                    image.carouselLabel = event.target.value.toUpperCase()
                }
                if (pProperty === 'carouselDescription') {
                    image.carouselDescription = event.target.value.toUpperCase()
                }
                if (pProperty === 'carouselImage') {
                    if (uploadImageResult !== null) {
                        image.imageURL = uploadImageResult.key
                        image.format = uploadImageResult.key.split('.')[1]
                    } 
                }
            }
            return image
        })
        tempCRUD_Product.images = tempImages     
        await this.setState({CRUD_Product: tempCRUD_Product})
        this.validateCRUDProduct()
    }

    async getSignedImageURL(image) {
        const signedURL = await Storage.get(image.imageURL)
        return signedURL
    }

    handleOnChangeInputFormProductFeatures = async(event, pFeature, pProperty) => {
        let tempCRUD_Product = this.state.CRUD_Product;
        let tempFeatures = tempCRUD_Product.features.map( (feature) => {
            if (feature.id === pFeature.id) {
                if (event.target.name === 'CRUD_ProductFeatureName') {
                    feature.name = event.target.value
                }
                if (event.target.name === 'CRUD_ProductFeatureDescription') {
                    feature.description = event.target.value
                }
                if (pProperty === 'CRUD_ProductFeatureIsToBlockChain') {
                    feature.isToBlockChain = !feature.isToBlockChain
                }
                if (pProperty === 'CRUD_ProductFeatureIsVerifable') {
                    feature.isVerifable = !feature.isVerifable
                }
            }
            return feature
        })
        tempCRUD_Product.features = tempFeatures     
        await this.setState({CRUD_Product: tempCRUD_Product})
        this.validateCRUDProduct()
    }

    async handleHideModalAreYouSureDeleteProduct(event) {
        this.setState({isShowModalAreYouSureDeleteProduct: !this.state.isShowModalAreYouSureDeleteProduct})
    }
    
    // RENDER
    render() {
        // State Varibles
        let {CRUD_Product, CRUDButtonName, products, selectedCategory,selectedFeature, isImageUploadingFile, isShowModalAreYouSureDeleteProduct, productToDelete, valueProductFeature} = this.state
        const urlS3Image = 'https://kioproyectobrjsapp627f51dfee5f4a219ed7016e45916213406-dev.s3.amazonaws.com/public/'

        // Renders uploading image
        const renderIsisImageUploadingFile = () => {
            if (this.state.isImageUploadingFile) {
                return (
                    <Spinner animation='border' variant='primary' />
                )
            }
        
        }
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
                                    {renderProductImages(product, product.images.items)}
                                </td>
                                <td>
                                    {renderProductFeatures(product,product.features.items)}
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

        // Render CRUD product images
        const renderCRUDProductImages = () => {
            return (
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Upload</th>
                        <th>Image</th>
                        <th>URL</th>
                        <th>Title</th>
                        <th>Order</th>
                        <th>Is On Carousel</th>
                        <th>Carousel Label</th>
                        <th>Carousel Description</th>
                    </tr>
                    </thead>
                    <tbody>
                    {CRUD_Product.images.map(image => (
                        <tr key={image.id}>
                            <td>
                                <Form.Group controlId='formFile' className='mb-3'>
                                    <Form.Control type='file' onChange={(e) => this.handleChangeProductImageProperty(e, image, 'carouselImage')} />
                                </Form.Group>
                                {renderIsisImageUploadingFile()}
                            </td>
                            <td>
                                {renderProductImage(image)}
                            </td>
                            <td>
                                {image.imageURL}
                            </td>
                            <td>
                                <Form.Group as={Col} controlId='formGridNewProductImageTitle'>
                                    <Form.Control
                                        type='text'
                                        placeholder='Ex. Cats'
                                        name='newProductImageTitle'
                                        value={image.title}
                                        onChange={(e) => this.handleChangeProductImageProperty(e, image, 'newProductImageTitle')} />
                                </Form.Group>
                            </td>
                            <td>
                                <Form.Group as={Col} controlId='formGridNewProductImageOrder'>
                                    <Form.Control
                                        type='number'
                                        placeholder='Ex. 1'
                                        name='newProductImageOrder'
                                        value={image.order}
                                        onChange={(e) => this.handleChangeProductImageProperty(e, image, 'newProductImageOrder')} />
                                </Form.Group>
                            </td>
                            <td>
                                <Form.Group as={Col} controlId='formGridCRUD_ProductIsOnCarousel'>
                                    <Button 
                                        variant='primary'
                                        size='lg' 
                                        block
                                        onClick={(e) => this.handleChangeProductImageProperty(e, image, 'isOnCarousel')}
                                    >{image.isOnCarousel? 'YES' : 'NO'}</Button>
                                </Form.Group>
                            </td>
                            <td>
                                {renderCarouselLabelForm(image)}
                            </td>
                            <td>
                                {renderCarouselDescriptionForm(image)}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            )
            
        }
        // Render Product Image
        const renderProductImage = (pImage) => {
            if (pImage.imageURL !== '' && !isImageUploadingFile) {
                return (
                    <img
                        src={urlS3Image+pImage.imageURL}
                        alt={pImage.id}
                        height={100}
                        width={100}
                    />
                )
            } else {
                <p>N/A</p>
            }
        }
        // Render Carousel Label form
        const renderCarouselLabelForm = (pImage) => {
            if (pImage.isOnCarousel) {
                return (
                    <Form.Group as={Col} controlId='formGridCarouselLabel'>
                        <Form.Control
                            type='text'
                            placeholder='Ex. lorem ipsum label'
                            name='carouselLabel'
                            value={pImage.carouselLabel}
                            onChange={(e) => this.handleChangeProductImageProperty(e, pImage,'carouselLabel')} />
                    </Form.Group>
                )
            }
        }
        // Render Carousel Description form
        const renderCarouselDescriptionForm = (pImage) => {
            if (pImage.isOnCarousel) {
                return (
                    <Form.Group as={Col} controlId='formGridCarouselDescription'>
                        <Form.Control
                            type='text'
                            placeholder='Ex. lorem ipsum description'
                            name='carouselDescription'
                            value={pImage.carouselDescription}
                            onChange={(e) => this.handleChangeProductImageProperty(e,pImage,'carouselDescription')} />
                    </Form.Group>
                )
            }
        }
        // Render CRUD product features
        const renderCRUDProductFeatures = () => {
            return (
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Features</th>
                        <th>Description</th>
                        <th>Value</th>
                    </tr>
                    </thead>
                    <tbody>
                    {CRUD_Product.features.map(feature => (
                        <tr key={feature.id}>
                            <td>
                                <Form.Group as={Col} controlId='formGridCRUD_ProductFeature'>
                                    <Form.Label>Select one</Form.Label>
                                        <Select options={this.state.featureSelectList} onChange={this.handleOnSelectFeature} />
                                </Form.Group>
                            </td>
                            <td>
                                <Form.Group as={Col} controlId='formGridCRUD_ProductFeature_Description'>
                                    <Form.Label>{selectedFeature?this.state.selectedFeature.description : '-'}</Form.Label>
                                        
                                </Form.Group>
                            </td>
                            <td>
                                <Form.Group as={Col} controlId='formGridCRUD_ProductOrder'>
                                    <Form.Control
                                        type='number'
                                        placeholder=''
                                        name='valueProductFeature'
                                        value={this.state.valueProductFeature}
                                        onChange={(e) => this.setState({valueProductFeature: e.target.value})} />
                                </Form.Group>
                            </td>
                            <td>
                                <Form.Group as={Col} controlId='formGridCRUD_ProductFeatureIsToBlockChain'>
                                        <Form.Label>Is to Blockchain?</Form.Label>
                                        <Button 
                                            variant='primary'
                                            size='sm' 
                                            onClick={(e) => this.handleOnChangeInputFormProductFeatures(e, feature, 'CRUD_ProductFeatureIsToBlockChain')}
                                        >{feature.isToBlockChain? 'YES' : 'NO'}</Button>
                                    </Form.Group>
                            </td>
                            <td>
                                <Form.Group as={Col} controlId='formGridCRUD_ProductFeatureIsVerifable'>
                                        <Form.Label>Is to Verifable?</Form.Label>
                                        <Button 
                                            variant='primary'
                                            size='sm' 
                                            onClick={(e) => this.handleOnChangeInputFormProductFeatures(e, feature, 'CRUD_ProductFeatureIsVerifable')}
                                        >{feature.isVerifable? 'YES' : 'NO'}</Button>
                                    </Form.Group>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            )
        }
        // Render are you sure delete the product?
        const renderAreYouSureDeleteProduct = () => {
            if (isShowModalAreYouSureDeleteProduct && productToDelete !== null) {
                return (
                    <Modal
                        show={isShowModalAreYouSureDeleteProduct}
                        onHide={(e) => this.handleHideModalAreYouSureDeleteProduct(e)}
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                        >
                        <Modal.Header closeButton>
                            <Modal.Title id="contained-modal-title-vcenter">
                             Confirmation to DELETE the product ({productToDelete.name})
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Alert key="idx_key_2" variant='warning'>
                                    Are you sure to delete the Product ({productToDelete.name}) with {productToDelete.images.items.length} images, and {productToDelete.features.items.length} features?
                            </Alert>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button 
                                variant='danger'
                                size='md' 
                                block
                                onClick={(e) => this.handleDeleteProduct(e)}
                            >YES</Button>
                            <Button 
                                variant='secondary'
                                size='md' 
                                block
                                onClick={(e) => this.setState({isShowModalAreYouSureDeleteProduct: false})}
                            >NO</Button>
                        </Modal.Footer>
                    </Modal>
                    
                )
            }
        }
        // Render colored break line
        const renderColoredBreakLine = (pColor) => (
            <hr
                style={{
                    color: pColor,
                    backgroundColor: pColor,
                    height: 5
                }}
            />
        )

        // RENDER 
        return (
                <Container>
                    {renderAreYouSureDeleteProduct()}
                    <Form>
                        <Card>
                            <Card.Body>
                                <Card.Title>PROJECT-B PROPERTIES on {CRUDButtonName}</Card.Title>
                                <Row className='mb-2'>
                                    <Form.Group as={Col} controlId='formGridCategorySelectList'>
                                        <Form.Label>Category</Form.Label>
                                        <Select options={this.state.categorySelectList} onChange={this.handleOnSelectCategory} />
                                        <Alert key="idx_key_1" variant='success'>
                                            {selectedCategory === null ? 'Not selected' : selectedCategory.name}
                                        </Alert>
                                    </Form.Group>

                                    <Form.Group as={Col} controlId='formGridCRUD_ProductName'>
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control
                                            type='text'
                                            placeholder='Ex. Proyecto B'
                                            name='CRUD_ProductName'
                                            value={CRUD_Product.name}
                                            onChange={(e) => this.handleOnChangeInputForm(e)} />
                                    </Form.Group>

                                </Row>

                                <Row className='mb-3'>

                                    <Form.Group as={Col} controlId='formGridCRUD_ProductDescription'>
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control
                                            type='text'
                                            placeholder='Ex. Amazing Project B'
                                            name='CRUD_ProductDescription'
                                            value={CRUD_Product.description}
                                            onChange={(e) => this.handleOnChangeInputForm(e)} />
                                    </Form.Group>

                                    <Form.Group as={Col} controlId='formGridCRUD_ProductName'>
                                        <Form.Label>Is Active</Form.Label>
                                        <br></br>
                                        <Button 
                                            variant='primary'
                                            size='sm' 
                                            onClick={(e) => this.handleOnChangeInputForm(e, 'productIsActive')}
                                        >{CRUD_Product.isActive? 'YES' : 'NO'}</Button>
                                    </Form.Group>

                                    <Form.Group as={Col} controlId='formGridCRUD_ProductOrder'>
                                        <Form.Label>Order</Form.Label>
                                        <Form.Control
                                            type='number'
                                            placeholder='Ex. 1'
                                            name='CRUD_ProductOrder'
                                            value={CRUD_Product.order}
                                            onChange={(e) => this.handleOnChangeInputForm(e)} />
                                    </Form.Group>

                                </Row>
                                </Card.Body>
                        </Card>
                        
                        <Card style={{paddingTop: 20}}>
                            <Card.Body>
                                <Card.Title>PROJECT-B Images</Card.Title>
                                <Row className='mb-1'>
                                    <Button 
                                        variant='primary'
                                        size='sm' 
                                        block
                                        onClick={(e) => this.handleAddNewImageToActualProduct(e)}
                                    >
                                    ADD IMAGE TO ACTUAL PROJECT-B
                                    </Button>
                                    {renderCRUDProductImages()}
                                </Row>
                            </Card.Body>
                        </Card>
                        
                        <Card style={{paddingTop: 20}}>
                            <Card.Body>
                                <Card.Title>PROJECT-B Features</Card.Title>
                                <Row className='mb-1'>
                                    <Button 
                                        variant='primary'
                                        size='sm' 
                                        block
                                        onClick={(e) => this.handleAddNewFeatureToActualProduct(e)}
                                    >
                                    ADD FEATURE TO ACTUAL PROJECT-B
                                    </Button>
                                    {renderCRUDProductFeatures()}
                                    {/* <Image src={productImageURLToDisplay} rounded style={{width: 200, height: 'auto'}} /> */}
                                </Row>
                            </Card.Body>
                        </Card>

                        <Row className='mb-1'>
                            <Button
                            variant='primary'
                            block
                            onClick={this.handleCRUDProduct}
                            disabled={this.state.isCRUDButtonDisable}
                            >{CRUDButtonName}</Button>
                        </Row>
                        
                    </Form>
                    {renderColoredBreakLine('red')}
                    <br></br>
                    {/* {renderProducts()} */}
                </Container>
        )
    }
}

export default withAuthenticator(Products, {
    theme: Bootstrap,
    includeGreetings: true,
    signUpConfig: {
        hiddenDefaults: ['phone_number'],
        signUpFields: [
        { label: 'Name', key: 'name', required: true, type: 'string' }
    ]
}})
