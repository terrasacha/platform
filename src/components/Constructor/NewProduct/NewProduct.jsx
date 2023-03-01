import React, { Component } from 'react'
// Bootstrap
import { Alert, Button, Card, Col, Container, Form, Modal, Row } from 'react-bootstrap'
// Auth css custom
import Bootstrap from "../../common/themes"
// GraphQL
import { API, Auth, graphqlOperation } from 'aws-amplify'
import { createImage, createProduct, createProductFeature, createUserProduct, deleteFeature, deleteImage, deleteProduct, updateImage, updateProduct } from '../../../graphql/mutations'
import { listCategories, listFeatures, listProductFeatures, listProducts } from '../../../graphql/queries'
import { onCreateProduct, onCreateProductFeature, onUpdateProduct, onUpdateProductFeature } from '../../../graphql/subscriptions'
// Utils 
import Select from 'react-select'
import WebAppConfig from '../../common/_conf/WebAppConfig'
import CRUDProductImages from './CRUDProductImages'
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
                status: 'draft',
                order: 0,
                counterNumberOfTimesBuyed: 0,
                amountToBuy: 0.0,
                categoryID: '',
                images: [],
            },
            CRUDButtonName: 'CREATE',
            isCRUDButtonDisable: true,
            isImageUploadingFile: false,
            selectedCategory: null,
        }
        this.handleOnChangeInputForm = this.handleOnChangeInputForm.bind(this)
        this.handleChangeProductImageProperty = this.handleChangeProductImageProperty.bind(this)
        this.handleAddNewImageToActualProduct = this.handleAddNewImageToActualProduct.bind(this)
        this.handleCRUDProduct = this.handleCRUDProduct.bind(this)
        this.handleOnSelectCategory = this.handleOnSelectCategory.bind(this)
        this.goToTop = this.goToTop = this.goToTop.bind(this)
    }

    componentDidMount = async () => {
            Promise.all([
                this.loadCategorysSelectItems(),
            ])
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


    handleOnSelectCategory(event) {
        this.setState({selectedCategory: event.value})
        this.validateCRUDProduct()
    }

    goToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

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
    async validateCRUDProduct() {
        if ( this.state.selectedCategory !== null && 
             this.state.CRUD_Product.name !== '' && 
             this.state.CRUD_Product.description !== '' && 
             this.state.CRUD_Product.images.length > 0) {
            this.setState({isCRUDButtonDisable: false})
        }
    }
    
    async handleCRUDProduct() {
        const tempCRUD_Product = this.state.CRUD_Product
        if (this.state.CRUDButtonName === 'CREATE') {
            const payLoadNewProduct = {
                id: tempCRUD_Product.id,
                name: tempCRUD_Product.name,
                description: tempCRUD_Product.description,
                isActive: true, //Por que se manda true??
                status: tempCRUD_Product.status,
                counterNumberOfTimesBuyed: 0,
                categoryID: this.state.selectedCategory.id,
                order: tempCRUD_Product.order,
            }
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

            await API.graphql(graphqlOperation(createProduct, { input: payLoadNewProduct }))
            // Creating UserProduct
            let actualUser = await  Auth.currentAuthenticatedUser()
            let actualUserID = actualUser.attributes.sub
  
            const payLoadNewUserProduct = {
                userID: actualUserID,
                productID: tempCRUD_Product.id,
                isFavorite: true
            }
            await API.graphql(graphqlOperation(createUserProduct, { input: payLoadNewUserProduct }))
            await this.cleanProductOnCreate()
            /* await this.cleanProductOnCreate() */
        }
    }
    
    setProductImageAndDownloadURL = async (product) => {
        Storage.get(product.image, { expires: 600 })
            .then(result => {
                this.setState({productImageURLToDisplay: result})
            })
            .catch(err => console.log(err))
        
    }

    async handleAddNewImageToActualProduct(event) {
        this.addNewImageToActualProductImages()
        this.validateCRUDProduct()
    }

    async cleanProductOnCreate() {
         this.setState({
            CRUD_Product: {
                id: uuidv4().replaceAll('-','_'),
                name: '',
                description: '',
                isActive: true,
                order: '',
                status: 'draft',
                counterNumberOfTimesBuyed: 0,
                amountToBuy: 0.0,
                categoryID: '',
                images: [],
            },
            CRUDButtonName: 'CREATE',
            isCRUDButtonDisable: true,
            isImageUploadingFile: false, //se borraban los features y categorys
            selectedCategory: null,
            selectedFeature: null,
            valueProductFeature: 0,
            isShowModalAreYouSureDeleteProduct: false,
            productToDelete: null,
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
            tempCRUD_Product.order = parseInt(event.target.value)
        }
        if (pProperty === 'productIsActive') {
            tempCRUD_Product.isActive = !tempCRUD_Product.isActive
        }
        if (event.target.name === 'CRUD_ProductStatus') {
            tempCRUD_Product.status = event.target.value
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

    render() {
        // State Varibles
        let {CRUD_Product, CRUDButtonName, selectedCategory } = this.state
        const urlS3Image = WebAppConfig.url_s3_public_images
        return (
                <Container>
                    <Form>
                        <Card>
                            <Card.Body>
                                <Card.Title>PROJECT PROPERTIES on {CRUDButtonName}</Card.Title>
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


                                </Row>
                                </Card.Body>
                        </Card>
                        <Card style={{paddingTop: 20}}>
                            <Card.Body>
                                <Card.Title>PROJECT Images</Card.Title>
                                <Row className='mb-1'>
                                    <Button 
                                        variant='primary'
                                        size='sm' 
                                         
                                        onClick={(e) => this.handleAddNewImageToActualProduct(e)}
                                    >
                                    ADD IMAGE TO ACTUAL PROJECT
                                    </Button>
                                    <CRUDProductImages 
                                        CRUD_Product={CRUD_Product}
                                        isImageUploadingFile={this.state.isImageUploadingFile}
                                        urlS3Image={urlS3Image}
                                        handleChangeProductImageProperty={this.handleChangeProductImageProperty}
                                        />

                                </Row>
                            </Card.Body>
                        </Card>
                        

                        <Row className='mb-1'>
                            <Button
                            variant='primary'
                             
                            onClick={this.handleCRUDProduct}
                            disabled={this.state.isCRUDButtonDisable}
                            >{CRUDButtonName}</Button>
                        </Row>
                        
                    </Form>
                </Container>
        )
    }
}

export default Products

