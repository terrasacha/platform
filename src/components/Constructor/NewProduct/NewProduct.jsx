import React, { Component } from 'react'
import s from './NewProduct.module.css'
// GraphQL
import { API, Auth, graphqlOperation } from 'aws-amplify'
import { createImage, createProduct, createUserProduct, createProductFeature, createFeatureType, createFeature } from '../../../graphql/mutations'
import { listCategories } from '../../../graphql/queries'
import DragArea from './dragArea/DragArea'
import CompanyInformation from './companyInformation/CompanyInformation'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WebAppConfig from '../../common/_conf/WebAppConfig'
// Utils 
// AWS S3 Storage
import { Storage } from 'aws-amplify'
import { v4 as uuidv4 } from 'uuid'

const getUserProducts = `
  query MyQuery($userID: ID!) {
    listUserProducts(filter: {userID: {eq: $userID}}) {
        items {
            product {
              productFeatures {
                items {
                  feature {
                    featureTypeID
                  }
                }
              }
            }
          } 
    }
  }
`;
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
            company:{
                name:'',
                direction:'',
                city:'',
                department:'',
                country:'',
                cp:'',
                phone:'',
                email:'',
                website:'',
            },
            companyerrors:{
                name:'',
                direction:'',
                city:'',
                department:'',
                country:'',
                cp:'',
                phone:'',
                email:'',
                website:'',
            },
            productFeature:{
                ha_tot: '',
                fecha_inscripcion: '',
                ubicacion: '',
                coord: '',
                periodo_permanencia: '',
            },
            errors:{
                title:'no error',
                category:'no error',
                description:'no error',
                ha_tot:'no error',
                fecha_inscripcion:'no error',
                ubicacion:'no error',
                coord:'no error',
                periodo_permanencia:'no error',
            },
            mostrarFormInfodeEmpresa: false,
            empresas:[],
            files: [],
            imageToUpload: '',
            CRUDButtonName: 'CREATE',
            isCRUDButtonDisable: true,
            isImageUploadingFile: false,
            loading: false,
            selectedCategory: null,
            selectedCompany: '',
        }
        this.handleOnChangeInputForm = this.handleOnChangeInputForm.bind(this)
        this.handleCRUDProduct = this.handleCRUDProduct.bind(this)
        this.handleOnChangeInputFormCompany = this.handleOnChangeInputFormCompany.bind(this)
        this.handleCRUDCompany = this.handleCRUDCompany.bind(this)
        this.handleOnSelectCategory = this.handleOnSelectCategory.bind(this)
        this.handleOnSelectCompany = this.handleOnSelectCompany.bind(this)
        this.selectImage = this.selectImage.bind(this)
        this.fetchfeatureTypeIDS = this.fetchfeatureTypeIDS.bind(this)
        this.handleSetStateCompany = this.handleSetStateCompany.bind(this)
    }
    componentDidMount = async () => {
        Promise.all([
            this.loadCategorysSelectItems(),
        ])
        await this.fetchfeatureTypeIDS()
    }
    async fetchfeatureTypeIDS() {
        const actualUser = await Auth.currentAuthenticatedUser()
        const userID = actualUser.attributes.sub;   
        try {
          const userProductsData = await API.graphql(graphqlOperation(getUserProducts, { userID }));
          let productFeatures =  userProductsData.data.listUserProducts.items.map( up => up.product.productFeatures.items)
          let uniqueFeatureTypes = []
            for (let i = 0; i < productFeatures.length; i++) {
                const subArray = productFeatures[i];
            
                for (let j = 0; j < subArray.length; j++) {
                const featureTypeID = subArray[j].feature.featureTypeID;
            
                if (!uniqueFeatureTypes.includes(featureTypeID)) {
                    uniqueFeatureTypes.push(featureTypeID);
                }
                }
            }
            let filteredFeatureTypes = uniqueFeatureTypes.filter(featureTypeID => {
                return featureTypeID.includes('CONSTRUCTOR_ORGANIZATION_INFORMATION');
              })
            let featureTypeIds = filteredFeatureTypes.map(featureTypeID => {
            return featureTypeID.split('CONSTRUCTOR_ORGANIZATION_INFORMATION_')[1];
            });
            this.setState({empresas: featureTypeIds})
        } catch (err) {
          console.log('error fetching user products', err);
        }
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
        this.setState({loading: true})
        const tempCRUD_Product = this.state.CRUD_Product
        if (this.state.errors.title !== '' && this.state.errors.description !== ''
            && this.state.errors.ubicacion !== '' && this.state.errors.ha_tot !== ''
            && this.state.errors.ha_tot !== '') {
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
            
            await API.graphql(graphqlOperation(createProductFeature, { input: {featureID: 'ha_tot', productID: tempCRUD_Product.id, value: this.state.productFeature.ha_tot } }))
            await API.graphql(graphqlOperation(createProductFeature, { input: {featureID: 'ubicacion', productID: tempCRUD_Product.id, value: this.state.productFeature.ubicacion } }))
            await API.graphql(graphqlOperation(createProductFeature, { input: {featureID: 'fecha_inscripcion', productID: tempCRUD_Product.id, value: Date.parse(this.state.productFeature.fecha_inscripcion) } }))
            await API.graphql(graphqlOperation(createProductFeature, { input: {featureID: 'coordenadas', productID: tempCRUD_Product.id, value: this.state.productFeature.coord } }))
            await API.graphql(graphqlOperation(createProductFeature, { input: {featureID: 'periodo_permanencia', productID: tempCRUD_Product.id, value: this.state.productFeature.periodo_permanencia } }))
            await API.graphql(graphqlOperation(createUserProduct, { input: payLoadNewUserProduct }))
            await API.graphql(graphqlOperation(createUserProduct, { input: payLoadAdmonProduct }))
            await this.handleCRUDCompany(tempCRUD_Product.id)
            await this.cleanProductOnCreate()
            this.setState({loading: false})
            this.notify()
        }else{
            console.log('errors')
        }
    }
    async handleCRUDCompany(tempCRUD_Product) {
        const tempCRUD_Company = this.state.company
        if (this.state.companyerrors.name !== '' && this.state.companyerrors.direction !== ''
            && this.state.companyerrors.city !== '' && this.state.companyerrors.department !== ''
            && this.state.companyerrors.country !== '' && this.state.companyerrors.cp !== ''
            && this.state.companyerrors.phone !== '' && this.state.companyerrors.email !== ''
            && this.state.companyerrors.website !== '') {
            
            //Creo la FT CONSTRUCTOR_ORGANIZATION_INFORMATION_<COMPANY.NAME>
            if(this.state.selectedCompany === ''){
                const payloadNewFeatureType = {
                    id: `CONSTRUCTOR_ORGANIZATION_INFORMATION_${tempCRUD_Company.name}`,
                    name: tempCRUD_Company.name,
                }
                await API.graphql(graphqlOperation(createFeatureType, { input: payloadNewFeatureType }))
            }

            //Creo las Features para CONSTRUCTOR_ORGANIZATION_INFORMATION_<COMPANY.NAME> y sus valores los guardo en la PF
            for( let info in this.state.company ){
                let id = uuidv4().replaceAll('-','_')
                const payloadNewFeature = {
                    id: id,
                    name: info,
                    featureTypeID: `CONSTRUCTOR_ORGANIZATION_INFORMATION_${tempCRUD_Company.name}`,
                    unitOfMeasureID: 'no_unit'
                }
                await API.graphql(graphqlOperation(createFeature, { input: payloadNewFeature }))
                const payloadNewProductFeature = {
                    value: this.state.company[`${info}`],
                    productID: tempCRUD_Product,
                    featureID: id
                }
                await API.graphql(graphqlOperation(createProductFeature, { input: payloadNewProductFeature }))
            }
            await this.cleanProductOnCreate()
        }else{
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
            company:{
                name:'',
                direction:'',
                city:'',
                department:'',
                country:'',
                cp:'',
                phone:'',
                email:'',
                website:'',
            },
            companyerrors:{
                name:'',
                direction:'',
                city:'',
                department:'',
                country:'',
                cp:'',
                phone:'',
                email:'',
                website:'',
            },
            productFeature:{
                ha_tot: '',
                fecha_inscripcion: '',
                ubicacion: '',
                coord: '',
                periodo_permanencia: '',
            },
            errors:{
                title:'no error',
                category:'no error',
                description:'no error',
                ha_tot:'no error',
                fecha_inscripcion:'no error',
                ubicacion:'no error',
                coord:'no error',
                periodo_permanencia:'no error',
            },
            imageToUpload: '',
            CRUDButtonName: 'CREATE',
            isCRUDButtonDisable: true,
            isImageUploadingFile: false, //se borraban los features y categorys
            selectedCategory: null,
            selectedCompany: '',
        })
    }
    
    handleOnSelectCategory(event) {
        this.setState({selectedCategory: event.target.value})
        this.validateCRUDProduct()
    }
    handleOnSelectCompany(event) {
        this.setState({selectedCompany: event.target.value, mostrarFormInfodeEmpresa: true})
    }
    handleOnChangeInputForm = async(event, pProperty) => {
        let tempCRUD_Product = this.state.CRUD_Product
        let tempCRUD_productFeature = this.state.productFeature
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
        if (event.target.name === 'productFeature_ha_tot') {
            tempCRUD_productFeature.ha_tot = event.target.value
            this.setState(prevState => ({
                errors: {...prevState.errors, ha_tot: event.target.value}}))
        }
        if (event.target.name === 'productFeature_fecha') {
            tempCRUD_productFeature.fecha_inscripcion =  event.target.value
            this.setState(prevState => ({
                errors: {...prevState.errors, fecha_inscripcion: event.target.value}}))
        }
        if (event.target.name === 'productFeature_ubicacion') {
            tempCRUD_productFeature.ubicacion = event.target.value
            this.setState(prevState => ({
                errors: {...prevState.errors, ubicacion: event.target.value}}))
        }
        if (event.target.name === 'productFeature_coord') {
            tempCRUD_productFeature.coord = event.target.value
            this.setState(prevState => ({
                errors: {...prevState.errors, coord: event.target.value}}))
        }
        if (event.target.name === 'productFeature_periodo_permanencia') {
            tempCRUD_productFeature.periodo_permanencia = event.target.value
            this.setState(prevState => ({
                errors: {...prevState.errors, periodo_permanencia: event.target.value}}))
        }
        this.setState({CRUD_Product: tempCRUD_Product, productFeature: tempCRUD_productFeature})
        this.validateCRUDProduct()
    }
    handleOnChangeInputFormCompany = async(event, pProperty) => {
        let tempCRUD_Company = this.state.company
        if (event.target.name === 'company_name') {
            
            tempCRUD_Company.name = event.target.value.toUpperCase().replace(/ /g, "_")
            this.setState(prevState => ({
                companyerrors: {...prevState.companyerrors, name: event.target.value}}))
        }
        if (event.target.name === 'company_direction') {
            tempCRUD_Company.direction = event.target.value
            this.setState(prevState => ({
                companyerrors: {...prevState.companyerrors, direction: event.target.value }}))
        }
        if (event.target.name === 'company_city') {
            tempCRUD_Company.city = event.target.value
            this.setState(prevState => ({
                companyerrors: {...prevState.companyerrors, city: event.target.value}}))
        }
        if (event.target.name === 'company_department') {
            tempCRUD_Company.department =  event.target.value
            this.setState(prevState => ({
                companyerrors: {...prevState.companyerrors, department: event.target.value}}))
        }
        if (event.target.name === 'company_country') {
            tempCRUD_Company.country = event.target.value
            this.setState(prevState => ({
                companyerrors: {...prevState.companyerrors, country: event.target.value}}))
        }
        if (event.target.name === 'company_CP') {
            tempCRUD_Company.cp = event.target.value
            this.setState(prevState => ({
                companyerrors: {...prevState.companyerrors, cp: event.target.value}}))
        }
        if (event.target.name === 'company_phone') {
            tempCRUD_Company.phone = event.target.value
            this.setState(prevState => ({
                companyerrors: {...prevState.companyerrors, phone: event.target.value}}))
        }
        if (event.target.name === 'company_email') {
            tempCRUD_Company.email = event.target.value
            this.setState(prevState => ({
                companyerrors: {...prevState.companyerrors, email: event.target.value}}))
        }
        if (event.target.name === 'company_website') {
            tempCRUD_Company.website = event.target.value
            this.setState(prevState => ({
                companyerrors: {...prevState.companyerrors, website: event.target.value}}))
        }
        this.setState({company: tempCRUD_Company})
    }
    handleSetStateCompany (tempCompany){
        this.setState({
            company: tempCompany
        })
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
        let {CRUD_Product, CRUDButtonName, selectedCategory, productFeature } = this.state
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
                <div className={s.formContainercompany}>
                    <h2>Información de Contacto</h2>
                    <form className={s.formcompany}>
                        <fieldset className={s.inputContainer}>
                            <select placeholder=''  onChange={this.handleOnSelectCompany}>
                                <option value='' >Asociar Producto a </option>
                                {this.state.empresas.map(empresa => <option key={empresa} value={empresa}>{empresa}</option>)}
                                <option value=''> Nueva empresa </option>
                            </select>
                        </fieldset>
                    </form>    
                </div>
                {this.state.mostrarFormInfodeEmpresa?
                    <CompanyInformation productID={this.state.CRUD_Product.id} handleOnChangeInputFormCompany={this.handleOnChangeInputFormCompany} 
                    company={this.state.company} selectedCompany={this.state.selectedCompany} handleSetStateCompany={this.handleSetStateCompany}/> : ''}
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
                                {this.state.categorySelectList?.map(category=> <option value={category.value.id} key={category.value.id}>{category.value.name}</option>)}
                            </select>
                            {this.state.errors.category.length < 1?<span style={{color:'red'}}>Completar Titulo</span> : <span> </span>}
                        </fieldset>
                        <fieldset className={s.inputContainer}>
                            <legend>Tamaño del predio</legend>
                            <input type="text"
                                name='productFeature_ha_tot'
                                value={productFeature.ha_tot}
                                onChange={(e) => this.handleOnChangeInputForm(e)}
                                placeholder='Número de hectáreas' />
                            {this.state.errors.ha_tot.length < 1?<span style={{color:'red'}}>Completar Tamaño del predio</span> : <span> </span>}
                        </fieldset>
                    </form>
                    <form className={s.formInputs1}>
                        <fieldset className={s.inputContainer}>
                            <legend>Ubicación</legend>
                            <input type="text"
                                    name='productFeature_ubicacion'
                                    value={productFeature.ubicacion}
                                    onChange={(e) => this.handleOnChangeInputForm(e)} 
                                    placeholder='Ciudad, Departamento, País' />
                            {this.state.errors.ubicacion.length < 1?<span style={{color:'red'}}>Completar Ubicación</span> : <span> </span>}
                        </fieldset>
                        <fieldset className={s.inputContainer}>
                            <legend>Coordenadas</legend>
                            <input type='text' placeholder='lat, lng. Ej: 4.710990, -74.072037' name='productFeature_coord' value={productFeature.coord} onChange={(e) => this.handleOnChangeInputForm(e)} />
                            {this.state.errors.coord.length < 1?<span style={{color:'red'}}>Completar coordenadas</span> : <span> </span>}
                        </fieldset>
                        <fieldset className={s.inputContainer}>
                            <legend>Fecha de inscripción</legend>
                            <input type='date' placeholder='Fecha' name='productFeature_fecha' value={productFeature.fecha_inscripcion} onChange={(e) => this.handleOnChangeInputForm(e)} />
                            {this.state.errors.fecha_inscripcion.length < 1?<span style={{color:'red'}}>Completar fecha de inscripción</span> : <span> </span>}
                        </fieldset>
                    </form>
                    <form className={s.formInputs3}>
                        <fieldset className={s.inputContainer}>
                            <legend>Periodo de permanencia</legend>
                            <input type="text"
                                    name='productFeature_periodo_permanencia'
                                    value={productFeature.periodo_permanencia}
                                    onChange={(e) => this.handleOnChangeInputForm(e)} placeholder='Proyección de tiempo del proyecto en años' />
                            {this.state.errors.ubicacion.length < 1?<span style={{color:'red'}}>Completar periodo de permanencia</span> : <span> </span>}
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
                    {this.state.loading?<button className={s.solicitudButtonDisabled} disabled>CREANDO</button>:
                    <button className={s.solicitudButton} onClick={this.handleCRUDProduct}>CREAR SOLICITUD</button>}
                    
                </div>
            </div>
        )
    }
}

export default NewProduct

