import React, { Component } from 'react'
import s from './NewProduct.module.css'
// GraphQL
import { API, Auth, graphqlOperation } from 'aws-amplify'
import { createImage, createProduct, createUserProduct } from '../../../graphql/mutations'
import { listCategories } from '../../../graphql/queries'
import DragArea from './dragArea/DragArea'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WebAppConfig from '../../common/_conf/WebAppConfig'
// Utils 
// AWS S3 Storage
import { Storage } from 'aws-amplify'
import { v4 as uuidv4 } from 'uuid'

class NewProduct extends Component {

    constructor(props) {
        super(props)
        this.state = {
            CRUD_Product: {
                id: uuidv4().replaceAll('-','_'),
                name: '',
                description: '',
                isActive: true,
                status: 'new',
                order: 0,
                counterNumberOfTimesBuyed: 0,
                amountToBuy: 0.0,
                categoryID: '',
                images: [],
            },
            errors:{
                title:'no error',
                category:'no error',
                description:'no error'
            },
            files: [],
            imageToUpload: '',
            CRUDButtonName: 'CREATE',
            isCRUDButtonDisable: true,
            isImageUploadingFile: false,
            selectedCategory: null,
        }
        this.handleOnChangeInputForm = this.handleOnChangeInputForm.bind(this)
        this.handleCRUDProduct = this.handleCRUDProduct.bind(this)
        this.handleOnSelectCategory = this.handleOnSelectCategory.bind(this)
        this.selectImage = this.selectImage.bind(this)
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


    selectImage(e){
        this.setState({imageToUpload: e})
    }
    async handleFiles(e, productID){
        let uploadImageResult = null
        let imageId = ''
        const { target: { files } } = e;
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
            this.setState({isImageUploadingFile: true})
            uploadImageResult = await Storage.put(imageName, file, {
                level: "public",
                contentType: "image/jpeg",
            });
            const newImagePayLoad = {
                productID: productID,
                id: imageName,
                imageURL: uploadImageResult.key,
                format: uploadImageResult.key.split('.')[1],
                title: imageName,
                isOnCarousel: false,
                carouselLabel: '',
                carouselDescription: '',
                isActive: false,
                order: 0,
            }
            console.log(newImagePayLoad, 'newImagePayLoad')
            await API.graphql(graphqlOperation(createImage, { input: newImagePayLoad }))
            this.setState({isImageUploadingFile: false})
            
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
    async validateCRUDProduct() {
        if ( this.state.selectedCategory !== null && 
            this.state.CRUD_Product.name !== '' && 
            this.state.CRUD_Product.description !== '') {
                this.setState({isCRUDButtonDisable: false})
            }
        }
        
        async handleCRUDProduct() {
            const tempCRUD_Product = this.state.CRUD_Product
            if (this.state.errors.title !== '' && this.state.errors.description !== '') {
                const payLoadNewProduct = {
                    id: tempCRUD_Product.id,
                    name: tempCRUD_Product.name,
                    description: tempCRUD_Product.description,
                    isActive: false, //Por que se manda true??
                    status: tempCRUD_Product.status,
                    counterNumberOfTimesBuyed: 0,
                    categoryID: this.state.selectedCategory,
                    order: 0,
                }
                this.handleFiles(this.state.imageToUpload, payLoadNewProduct.id)
                await API.graphql(graphqlOperation(createProduct, { input: payLoadNewProduct }))
                // Creating UserProduct
                let actualUser = await  Auth.currentAuthenticatedUser()
                let actualUserID = actualUser.attributes.sub
                
                const payLoadNewUserProduct = {
                userID: actualUserID,
                productID: tempCRUD_Product.id,
                isFavorite: true
                }
                const payLoadAdmonProduct = {
                userID: WebAppConfig.admon,
                productID: tempCRUD_Product.id,
                isFavorite: true
                }
                await API.graphql(graphqlOperation(createUserProduct, { input: payLoadNewUserProduct }))
                await API.graphql(graphqlOperation(createUserProduct, { input: payLoadAdmonProduct }))
                await this.cleanProductOnCreate()
                this.notify()
        }else{
            console.log('errors')
        }
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
            errors:{
                title:'no error',
                category:'no error',
                description:'no error'
            },
            imageToUpload: '',
            CRUDButtonName: 'CREATE',
            isCRUDButtonDisable: true,
            isImageUploadingFile: false, //se borraban los features y categorys
            selectedCategory: null,
        })
    }
    
    handleOnSelectCategory(event) {
        this.setState({selectedCategory: event.target.value})
        this.validateCRUDProduct()
    }
    handleOnChangeInputForm = async(event, pProperty) => {
        let tempCRUD_Product = this.state.CRUD_Product
        if (event.target.name === 'CRUD_ProductName') {
            tempCRUD_Product.name = event.target.value
            this.setState(prevState => ({
                errors: {...prevState.errors, title: event.target.value}}))
        }
        if (event.target.name === 'CRUD_ProductDescription') {
            tempCRUD_Product.description = event.target.value
            this.setState(prevState => ({
                errors: {...prevState.errors, description: event.target.value }}))
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
        this.setState({CRUD_Product: tempCRUD_Product})
        this.validateCRUDProduct()
    }
    notify = () =>{
        toast.success('Formulario enviado', {
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
    render() {
        let {CRUD_Product, CRUDButtonName, selectedCategory } = this.state
        const urlS3Image = WebAppConfig.url_s3_public_images
        return (
            <div className={s.container}>
                <ToastContainer />
                <div className={s.titleContainer}>
                    <h2>Creación de un nuevo proyecto</h2>
                    <p>Para crear un proyecto en nuestra plataforma, es necesario que completes el siguiente formulario. 
                        Es importante que ingreses toda la información requerida de manera precisa y detallada para que podamos evaluar tu solicitud.
                    </p>
                    <p>
                        Una vez que hayas completado el formulario, nuestro equipo revisará la información proporcionada y te informaremos si tu proyecto ha sido aprobado o no. 
                        Si es aprobado, el equipo de Suan te enviará un contrato en el que se te especificará como continuar el proceso.
                    </p>
                </div>
                <div className={s.formContainer}>
                    <h2>Información de proyecto</h2>
                    <form className={s.formInputs1}>
                        <fieldset className={s.inputContainer}>
                            <legend>Título del proyecto</legend>
                            <input type="text"
                                    name='CRUD_ProductName'
                                    value={CRUD_Product.name}
                                    onChange={(e) => this.handleOnChangeInputForm(e)} placeholder='Título' />
                            {this.state.errors.title.length < 1?<span style={{color:'red'}}>Completar Titulo</span> : <span> </span>}
                        </fieldset>
                        <fieldset className={s.inputContainer}>
                            <legend>Categoría</legend>
                            <select placeholder='Categoría'  onChange={this.handleOnSelectCategory}>
                                {this.state.categorySelectList?.map(category=> <option value={category.value.id} key={category.id}>{category.value.name}</option>)}
                            </select>
                            {this.state.errors.category.length < 1?<span style={{color:'red'}}>Completar Titulo</span> : <span> </span>}
                        </fieldset>
                        <fieldset className={s.inputContainer}>
                            <legend>Tamaño del predio</legend>
                            <input type="number" name="radio" id="radio" placeholder='Número de hectáreas' />
                        </fieldset>
                    </form>
                    <form className={s.formInputs2}>
                        <fieldset className={s.inputContainer}>
                            <legend>Descripción</legend>
                            <textarea 
                            name='CRUD_ProductDescription'
                                    value={CRUD_Product.description}
                                    placeholder='Es importante que nos proporcione la mayor cantidad de información posible. En caso de ser necesaria mayor información se le solicitará después de crear la solicitud.'
                                    onChange={(e) => this.handleOnChangeInputForm(e)} />
                            {this.state.errors.description.length < 1?<span style={{color:'red'}}>Completar Titulo</span> : <span> </span>}
                        </fieldset>
                        <fieldset className={s.inputContainer}>
                            <legend>Imágenes</legend>
                            <DragArea 
                                selectImage={this.selectImage}
                            />
                        </fieldset>
                    </form>
                    {this.state.isImageUploadingFile?<button className={s.solicitudButtonDisabled} disabled>CREANDO</button>:
                    <button className={s.solicitudButton} onClick={this.handleCRUDProduct}>CREAR SOLICITUD</button>}
                    
                </div>
            </div>
        )
    }
}

export default NewProduct

