import React, { Component } from 'react'
import s from './NewProduct.module.css'
// GraphQL
import { API, Auth, graphqlOperation } from 'aws-amplify'
import { createImage, createProduct, createUserProduct, createProductFeature, createFeatureType, createFeature } from '../../../graphql/mutations'
import { listCategories, listFeatures } from '../../../graphql/queries'
import DragArea from './dragArea/DragArea'
import CompanyInformation from './companyInformation/CompanyInformation'
import TyC from './TyC/TyC'
import Button from './components/Button/Button'
import { ToastContainer, toast } from 'react-toastify';
import { InfoCircle } from 'react-bootstrap-icons'
import { validarString } from '../functions/functions'
import 'react-toastify/dist/ReactToastify.css';
import WebAppConfig from '../../common/_conf/WebAppConfig'
// Utils 
// AWS S3 Storage
import { Storage } from 'aws-amplify'
import { v4 as uuidv4 } from 'uuid'

const regexInputName = /^[a-zA-Z_]+$/
const regexInputNumber = /^[0-9]+$/
const regexInputWebSite = /[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*\.[a-z]{2,}(\/[a-zA-Z0-9#?=&%.]*)*$/
const regexInputUbic = /^([a-zA-Z0-9]+\s*,\s*)*[a-zA-Z0-9]+$/
const regexInputCoord = /^-?\d{1,3}(.\d+)?,\s*-?\d{1,3}(.\d+)?$/
const regexInputEmail = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/
class NewProduct extends Component {

    constructor(props) {
        super(props)
        this.state = {
            CRUD_Product: {
                id: uuidv4().replaceAll('-', '_'),
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
            company: {
                name: '',
                id: '',
                direction: '',
                city: '',
                department: '',
                country: '',
                cp: '',
                phone: '',
                email: '',
                website: '',
            },
            companyerrors: {
                name: '',
                id: '',
                cp: '',
                phone: '',
                email: '',
                website: '',
            },
            productFeature: {
                ha_tot: '',
                fecha_inscripcion: '',
                ubicacion: '',
                coord: '',
                periodo_permanencia: '',
            },
            errors: {
                title: '',
                ha_tot: '',
                ubicacion: '',
                coord: '',
                periodo_permanencia: '',
            },
            renderModalInformation: false,
            activeButton: '',
            renderModalTyC: false,
            mostrarFormInfodeEmpresa: false,
            empresas: [],
            files: [],
            imageToUpload: '',
            isImageUploadingFile: false,
            loading: false,
            selectedCategory: null,
            selectedCompany: 'no company',
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
        this.onHideModalInformation = this.onHideModalInformation.bind(this)
        this.onHideModalTyC = this.onHideModalTyC.bind(this)
        this.handleButtonClick = this.handleButtonClick.bind(this)
    }
    componentDidMount = async () => {

        await this.loadCategorysSelectItems()
        await this.fetchfeatureTypeIDS()
    }
    async fetchfeatureTypeIDS() {
        const actualUser = await Auth.currentAuthenticatedUser()
        const userID = actualUser.attributes.sub;
        try {
            let filter = {
                id: {
                    contains: userID
                }
            };

            const featuresData = await API.graphql({
                query: listFeatures,
                variables: { filter }
            });
            let featuresCompany = featuresData.data.listFeatures.items.map(f => {
                let feature = f.id.split('_')
                let feature_info = feature.slice(1, -1).join("_");
                return feature_info
            })
            let valoresUnicos = [...new Set(featuresCompany)];
            this.setState({ empresas: valoresUnicos })
        } catch (error) {
            console.log(error)
        }
    }
    async addNewImageToActualProductImages() {
        let tempCRUD_Product = this.state.CRUD_Product
        let newProductImage = {
            id: uuidv4().replaceAll('-', '_'),
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
        this.setState({ CRUD_Product: tempCRUD_Product })
    }


    selectImage(e) {
        this.setState({ imageToUpload: e })
    }
    async handleFiles(e, productID) {
        let uploadImageResult = null
        let imageId = ''
        const { target: { files } } = e;
        const [file,] = files || [];
        if (!file) {
            return
        }
        // Creating image ID
        let fileNameSplitByDotfileArray = file.name.split('.')
        imageId = fileNameSplitByDotfileArray[0].replaceAll(' ', '_').replaceAll('-', '_')
        // Getting extension
        let imageExtension = fileNameSplitByDotfileArray[fileNameSplitByDotfileArray.length - 1]
        let imageName = imageId + '.' + imageExtension
        this.setState({ isImageUploadingFile: true })
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
        this.setState({ isImageUploadingFile: false })

    }

    async loadCategorysSelectItems() {
        let categorysSelectItems = []
        const listCategoriesResult = await API.graphql(graphqlOperation(listCategories))
        if (listCategoriesResult.data.listCategories.items.length > 0) {
            let tempCategorys = listCategoriesResult.data.listCategories.items
            // Ordering categorys by name
            tempCategorys.sort((a, b) => (a.name > b.name) ? 1 : -1)
            tempCategorys.map((category) => {
                categorysSelectItems.push({ value: category, label: category.name })
                return category
            })
        }
        this.setState({ categorySelectList: categorysSelectItems })
    }
    async handleCRUDProduct() {

        this.setState({ loading: true, renderModalTyC: false })
        const actualUser = await Auth.currentAuthenticatedUser()
        const userID = actualUser.attributes.sub;
        const tempCRUD_Product = this.state.CRUD_Product
        if (this.state.selectedCompany === 'no company') return this.notifyError('Debe seleccionar una empresa/persona natural')
        if (this.state.errors.title === '' && this.state.errors.ubicacion === '' && this.state.errors.ha_tot === ''
            && this.state.errors.coord === '' && this.state.companyerrors.name === '' && this.state.companyerrors.cp === ''
            && this.state.companyerrors.phone === '' && this.state.companyerrors.email === ''
            && this.state.companyerrors.website === '') {
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
            let actualUser = await Auth.currentAuthenticatedUser()
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

            await API.graphql(graphqlOperation(createProductFeature, { input: { featureID: 'ha_tot', productID: tempCRUD_Product.id, value: this.state.productFeature.ha_tot } }))
            await API.graphql(graphqlOperation(createProductFeature, { input: { featureID: 'ubicacion', productID: tempCRUD_Product.id, value: this.state.productFeature.ubicacion } }))
            await API.graphql(graphqlOperation(createProductFeature, { input: { featureID: 'fecha_inscripcion', productID: tempCRUD_Product.id, value: Date.parse(this.state.productFeature.fecha_inscripcion) } }))
            await API.graphql(graphqlOperation(createProductFeature, { input: { featureID: 'coordenadas', productID: tempCRUD_Product.id, value: this.state.productFeature.coord } }))
            await API.graphql(graphqlOperation(createProductFeature, { input: { featureID: 'periodo_permanencia', productID: tempCRUD_Product.id, value: this.state.productFeature.periodo_permanencia } }))
            await API.graphql(graphqlOperation(createUserProduct, { input: payLoadNewUserProduct }))
            await API.graphql(graphqlOperation(createUserProduct, { input: payLoadAdmonProduct }))
            await API.graphql(graphqlOperation(createProductFeature, { input: { featureID: `${userID}_${this.state.company.name}_name`, productID: tempCRUD_Product.id } }))
            /* await this.handleCRUDCompany(tempCRUD_Product.id) */
            await this.cleanProductOnCreate()
            this.setState({ loading: false })
            this.notify()
        } else {
            console.log('errors')
            this.notifyError('Tu formulario contiene campos vacíos o campos con valores erroneos')
        }
    }
    async handleCRUDCompany(tempCRUD_Product) {
        const tempCRUD_Company = this.state.company
        const actualUser = await Auth.currentAuthenticatedUser()
        const userID = actualUser.attributes.sub;
        //Creo la FT CONSTRUCTOR_ORGANIZATION_INFORMATION_<COMPANY.NAME>
        const payloadNewFeatureType = {
            id: `CONSTRUCTOR_ORGANIZATION_INFORMATION_${tempCRUD_Company.name}`,
            name: tempCRUD_Company.name,
        }
        await API.graphql(graphqlOperation(createFeatureType, { input: payloadNewFeatureType }))
        //Creo las Features para CONSTRUCTOR_ORGANIZATION_INFORMATION_<COMPANY.NAME> y sus valores los guardo en la PF
        for (let info in this.state.company) {
            let id = `${userID}_${this.state.company.name}_${info}`

            /* let id = uuidv4().replaceAll('-','_') */
            const payloadNewFeature = {
                id: id,
                name: info,
                description: this.state.company[`${info}`],
                featureTypeID: `CONSTRUCTOR_ORGANIZATION_INFORMATION_${tempCRUD_Company.name}`,
                unitOfMeasureID: 'no_unit'
            }
            await API.graphql(graphqlOperation(createFeature, { input: payloadNewFeature }))
            /* const payloadNewProductFeature = {
                value: this.state.company[`${info}`],
                productID: tempCRUD_Product,
                featureID: id
            }
            await API.graphql(graphqlOperation(createProductFeature, { input: payloadNewProductFeature })) */
        }
        this.setState({
            renderModalInformation: false,

        })
        this.notify()
        await this.cleanProductOnCreate()
    }
    checkFormStatus() {
        if (this.state.selectedCompany === 'no company') return this.notifyError('Debe seleccionar una empresa/persona natural')
        if (this.state.CRUD_Product.name !== '' && this.state.CRUD_Product.description !== '' && this.state.productFeature.ha_tot !== ''
            && this.state.productFeature.coord !== '' && this.state.company.name !== '') {
            this.setState({ renderModalTyC: true })
        } else {
            return this.notifyError('Asegurese de completar los campos necesarios antes de continuar')
        }
    }
    async cleanProductOnCreate() {
        this.setState({
            CRUD_Product: {
                id: uuidv4().replaceAll('-', '_'),
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
            company: {
                name: '',
                id: '',
                direction: '',
                city: '',
                department: '',
                country: '',
                cp: '',
                phone: '',
                email: '',
                website: '',
            },
            companyerrors: {
                name: '',
                id: '',
                cp: '',
                phone: '',
                email: '',
                website: '',
            },
            productFeature: {
                ha_tot: '',
                fecha_inscripcion: '',
                ubicacion: '',
                coord: '',
                periodo_permanencia: '',
            },
            errors: {
                title: '',
                ha_tot: '',
                ubicacion: '',
                coord: '',
                periodo_permanencia: '',
            },
            imageToUpload: '',
            isImageUploadingFile: false, //se borraban los features y categorys
            selectedCategory: null,
            selectedCompany: 'no company',
            renderModalInformation: false,
            renderModalTyC: false,
            mostrarFormInfodeEmpresa: false,
            loading: false,
        })
    }

    handleOnSelectCategory(event) {
        this.setState({ selectedCategory: event.target.value })
    }
    async handleOnSelectCompany(event) {
        if (event.target.value === 'no company') {
            this.setState({
                mostrarFormInfodeEmpresa: false,
                company: {
                    name: '',
                    id: '',
                    direction: '',
                    city: '',
                    department: '',
                    country: '',
                    cp: '',
                    phone: '',
                    email: '',
                    website: '',
                }
            })
        }
        if (event.target.value !== 'no company') {
            if (event.target.value === 'nueva empresa' || event.target.value === 'persona natural') {
                this.setState({ renderModalInformation: true })
            }
            this.setState({ selectedCompany: event.target.value, mostrarFormInfodeEmpresa: true })
        }
    }
    handleOnChangeInputForm = async (event, pProperty) => {
        let tempCRUD_Product = this.state.CRUD_Product
        let tempCRUD_productFeature = this.state.productFeature
        if (event.target.name === 'CRUD_ProductName') {
            tempCRUD_Product.name = event.target.value
            let error = validarString(event.target.value, regexInputName)
            this.setState(prevState => ({
                errors: { ...prevState.errors, title: error }
            }))
        }
        if (event.target.name === 'CRUD_ProductDescription') {
            tempCRUD_Product.description = event.target.value
        }
        if (event.target.name === 'productFeature_ha_tot') {
            tempCRUD_productFeature.ha_tot = event.target.value
            let error = validarString(event.target.value, regexInputNumber)
            this.setState(prevState => ({
                errors: { ...prevState.errors, ha_tot: error }
            }))
        }
        if (event.target.name === 'productFeature_fecha') {
            tempCRUD_productFeature.fecha_inscripcion = event.target.value
        }
        if (event.target.name === 'productFeature_ubicacion') {
            tempCRUD_productFeature.ubicacion = event.target.value
            let error = validarString(event.target.value, regexInputUbic)
            this.setState(prevState => ({
                errors: { ...prevState.errors, ubicacion: error }
            }))
        }
        if (event.target.name === 'productFeature_coord') {
            tempCRUD_productFeature.coord = event.target.value
            let error = validarString(event.target.value, regexInputCoord)
            this.setState(prevState => ({
                errors: { ...prevState.errors, coord: error }
            }))
        }
        if (event.target.name === 'productFeature_periodo_permanencia') {
            tempCRUD_productFeature.periodo_permanencia = event.target.value
            let error = validarString(event.target.value, regexInputNumber)
            this.setState(prevState => ({
                errors: { ...prevState.errors, periodo_permanencia: error }
            }))
        }
        this.setState({ CRUD_Product: tempCRUD_Product, productFeature: tempCRUD_productFeature })
    }
    handleOnChangeInputFormCompany = async (event, pProperty) => {
        let tempCRUD_Company = this.state.company
        if (event.target.name === 'company_name') {
            tempCRUD_Company.name = event.target.value.toUpperCase().replace(/ /g, "_")
            let error = validarString(event.target.value, regexInputName)
            this.setState(prevState => ({
                companyerrors: { ...prevState.companyerrors, name: error }
            }))
        }
        if (event.target.name === 'company_id') {
            tempCRUD_Company.id = event.target.value
            let error = validarString(event.target.value, regexInputNumber)
            this.setState(prevState => ({
                companyerrors: { ...prevState.companyerrors, id: error }
            }))
        }
        if (event.target.name === 'company_direction') {
            tempCRUD_Company.direction = event.target.value
        }
        if (event.target.name === 'company_city') {
            tempCRUD_Company.city = event.target.value
        }
        if (event.target.name === 'company_department') {
            tempCRUD_Company.department = event.target.value
        }
        if (event.target.name === 'company_country') {
            tempCRUD_Company.country = event.target.value
        }
        if (event.target.name === 'company_CP') {
            tempCRUD_Company.cp = event.target.value
            let error = validarString(event.target.value, regexInputNumber)
            this.setState(prevState => ({
                companyerrors: { ...prevState.companyerrors, cp: error }
            }))
        }
        if (event.target.name === 'company_phone') {
            tempCRUD_Company.phone = event.target.value
            let error = validarString(event.target.value, regexInputNumber)
            this.setState(prevState => ({
                companyerrors: { ...prevState.companyerrors, phone: error }
            }))
        }
        if (event.target.name === 'company_email') {
            tempCRUD_Company.email = event.target.value
            let error = validarString(event.target.value, regexInputEmail)
            this.setState(prevState => ({
                companyerrors: { ...prevState.companyerrors, email: error }
            }))
        }
        if (event.target.name === 'company_website') {
            tempCRUD_Company.website = event.target.value
            let error = validarString(event.target.value, regexInputWebSite)
            this.setState(prevState => ({
                companyerrors: { ...prevState.companyerrors, website: error }
            }))
        }
        this.setState({ company: tempCRUD_Company })
    }
    handleSetStateCompany(tempCompany) {
        this.setState({
            company: tempCompany
        })
    }
    handleButtonClick(buttonId){
        console.log(buttonId, 'buttonid')
        this.setState({activeButton: buttonId /* === this.state.activeButton ? null : buttonId */});
      };
    notify = () => {
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
        this.setState({ loading: false })
    }
    onHideModalInformation() {
        this.setState({
            renderModalInformation: false,
        })
    }
    onHideModalTyC() {
        this.setState({
            renderModalTyC: false,
        })
    }
    render() {
        let { CRUD_Product, selectedCategory, productFeature, activeButton } = this.state
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
                            <legend>Asociar producto a:</legend>
                            <select placeholder='' onChange={this.handleOnSelectCompany}>
                                <option value='no company' >-</option>
                                {this.state.empresas.map(empresa => <option key={empresa} value={empresa}>{empresa}</option>)}
                                <option value='nueva empresa'>Nueva empresa</option>
                                <option value='persona natural'>Persona natural</option>
                            </select>
                        </fieldset>
                    </form>
                </div>
                {this.state.mostrarFormInfodeEmpresa ?
                    <CompanyInformation
                        productID={this.state.CRUD_Product.id} handleOnChangeInputFormCompany={this.handleOnChangeInputFormCompany}
                        company={this.state.company} selectedCompany={this.state.selectedCompany}
                        handleSetStateCompany={this.handleSetStateCompany} companyerrors={this.state.companyerrors}
                        renderModalInformation={this.state.renderModalInformation}
                        onHideModalInformation={this.onHideModalInformation}
                        handleCRUDCompany={this.handleCRUDCompany}
                    /> : ''}
                <div className={s.formContainer}>
                    <h2>Información de proyecto</h2>
                    <div className={s.selectTypeProyect}>
                        <Button
                            id="proyecto_plantaciones"
                            label="Proyecto Plantaciones"
                            activeButton={this.state.activeButton}
                            handleButtonClick={this.handleButtonClick}
                        />
                        <Button
                            id="proyecto_redd"
                            label="Proyecto REDD"
                            activeButton={this.state.activeButton}
                            handleButtonClick={this.handleButtonClick}
                        />
                    </div>
                    <form className={s.formInputs1}>
                        <fieldset className={s.inputContainer}>
                            <legend>
                                Título del proyecto
                                <div className={s["tooltip-text"]}>
                                    <InfoCircle className={s.infoCircle} />
                                    <span className={s["tooltip"]}>No se acepta números</span>
                                </div>
                            </legend>
                            <input type="text"
                                name='CRUD_ProductName'
                                value={CRUD_Product.name}
                                onChange={(e) => this.handleOnChangeInputForm(e)} placeholder='Título' />
                            <span style={{ color: 'red', fontSize: '.6em' }}>{this.state.errors.title}</span>
                        </fieldset>
                        <fieldset className={s.inputContainer}>
                            <legend>
                                Categoría
                                <div className={s["tooltip-text"]}>
                                    <InfoCircle className={s.infoCircle} />
                                    <span className={s["tooltip"]}>Seleccione una categoría</span>
                                </div>
                            </legend>
                            <select placeholder='Categoría' onChange={this.handleOnSelectCategory}>
                                {this.state.categorySelectList?.map(category => <option value={category.value.id} key={category.value.id}>{category.value.name}</option>)}
                            </select>
                        </fieldset>
                        <fieldset className={s.inputContainer}>
                            <legend>
                                Tamaño del predio
                                <div className={s["tooltip-text"]}>
                                    <InfoCircle className={s.infoCircle} />
                                    <span className={s["tooltip"]}>Sólo números</span>
                                </div>
                            </legend>
                            <input type="text"
                                name='productFeature_ha_tot'
                                value={productFeature.ha_tot}
                                onChange={(e) => this.handleOnChangeInputForm(e)}
                                placeholder='Número de hectáreas' />
                            <span style={{ color: 'red', fontSize: '.6em' }}>{this.state.errors.ha_tot}</span>
                        </fieldset>
                    </form>
                    <form className={s.formInputs1}>
                        <fieldset className={s.inputContainer}>

                            <legend>
                                Ubicación
                                <div className={s["tooltip-text"]}>
                                    <InfoCircle className={s.infoCircle} />
                                    <span className={s["tooltip"]}>Ej: Bogotá, Cundinamarca, Colombia</span>
                                </div>
                            </legend>
                            <input type="text"
                                name='productFeature_ubicacion'
                                value={productFeature.ubicacion}
                                onChange={(e) => this.handleOnChangeInputForm(e)}
                                placeholder='Ciudad, Departamento, País' />
                            <span style={{ color: 'red', fontSize: '.6em' }}>{this.state.errors.ubicacion}</span>
                        </fieldset>
                        <fieldset className={s.inputContainer}>
                            <legend>
                                Coordenadas
                                <div className={s["tooltip-text"]}>
                                    <InfoCircle className={s.infoCircle} />
                                    <span className={s["tooltip"]}>Sólo números. Ej: -34.23553, -2.43256</span>
                                </div>
                            </legend>
                            <input type='text' placeholder='lat, lng. Ej: 4.710990, -74.072037' name='productFeature_coord' value={productFeature.coord} onChange={(e) => this.handleOnChangeInputForm(e)} />
                            <span style={{ color: 'red', fontSize: '.6em' }}>{this.state.errors.coord}</span>
                        </fieldset>
                        <fieldset className={s.inputContainer}>
                            <legend>
                                Fecha de inscripción
                                <div className={s["tooltip-text"]}>
                                    <InfoCircle className={s.infoCircle} />
                                    <span className={s["tooltip"]}>Seleccione una fecha</span>
                                </div>
                            </legend>
                            <input type='date' placeholder='Fecha' name='productFeature_fecha' value={productFeature.fecha_inscripcion} onChange={(e) => this.handleOnChangeInputForm(e)} />
                        </fieldset>
                    </form>
                    <form className={s.formInputs3}>
                        <fieldset className={s.inputContainer}>
                            <legend>
                                Periodo de permanencia
                                <div className={s["tooltip-text"]}>
                                    <InfoCircle className={s.infoCircle} />
                                    <span className={s["tooltip"]}>Sólo números. Años aproximado</span>
                                </div>
                            </legend>
                            <input type="text"
                                name='productFeature_periodo_permanencia'
                                value={productFeature.periodo_permanencia}
                                onChange={(e) => this.handleOnChangeInputForm(e)} placeholder='Proyección de tiempo del proyecto en años' />
                            <span style={{ color: 'red', fontSize: '.6em' }}>{this.state.errors.periodo_permanencia}</span>
                        </fieldset>
                    </form>
                    <form className={s.formInputs2}>
                        <fieldset className={s.inputContainer}>
                            <legend>
                                Descripción
                                <div className={s["tooltip-text"]}>
                                    <InfoCircle className={s.infoCircle} />
                                    <span className={s["tooltip"]}>Introduzca una descripción del proyecto</span>
                                </div>
                            </legend>
                            <textarea
                                name='CRUD_ProductDescription'
                                value={CRUD_Product.description}
                                placeholder='Es importante que nos proporcione la mayor cantidad de información posible. En caso de ser necesaria mayor información se le solicitará después de crear la solicitud.'
                                onChange={(e) => this.handleOnChangeInputForm(e)} />
                        </fieldset>
                        <fieldset className={s.inputContainer}>
                            <legend>Imágenes</legend>
                            <DragArea
                                selectImage={this.selectImage}
                            />
                        </fieldset>
                    </form>
                    {this.state.loading ? <button className={s.solicitudButtonDisabled} disabled>CREANDO</button> :
                        <button className={s.solicitudButton} onClick={() => this.checkFormStatus()}>CREAR SOLICITUD</button>}

                </div>
                <TyC
                    renderModalTyC={this.state.renderModalTyC}
                    onHideModalTyC={this.onHideModalTyC}
                    handleCRUDProduct={this.handleCRUDProduct}
                />
            </div>
        )
    }
}

export default NewProduct

