import React, { Component } from 'react'
import s from './InfoInvestor.module.css'
// GraphQL
import { API, Auth, graphqlOperation } from 'aws-amplify'
import { createFeatureType, createFeature } from '../../../graphql/mutations'
import { listFeatureTypes, listFeatures } from '../../../graphql/queries'
import { ToastContainer, toast } from 'react-toastify';
import { InfoCircle } from 'react-bootstrap-icons'
import 'react-toastify/dist/ReactToastify.css';
import { Storage } from 'aws-amplify'
import { v4 as uuidv4 } from 'uuid'
import { validarString } from '../../Constructor/functions/functions'

const regexInputName = /^[a-zA-Z_]+$/
const regexInputNumber = /^[0-9]+$/
const regexInputWebSite = /[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*\.[a-z]{2,}(\/[a-zA-Z0-9#?=&%.]*)*$/
const regexInputUbic = /^([a-zA-Z0-9]+\s*,\s*)*[a-zA-Z0-9]+$/
const regexInputCoord = /^-?\d{1,3}(.\d+)?,\s*-?\d{1,3}(.\d+)?$/
const regexInputEmail = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/
class InfoInvestor extends Component {

    constructor(props) {
        super(props)
        this.state = {
            contact:{
                name:'',
                id: '',
                direction:'',
                city:'',
                department:'',
                country:'',
                cp:'',
                phone:'',
                email:'',
            },
            contacterrors:{
                name:'',
                id: '',
                cp:'',
                phone:'',
                email:'',
            },
            inputBlocked: false,
            loading: false,
        }
        this.handleOnChangeInputFormcontact = this.handleOnChangeInputFormcontact.bind(this)
        this.handleCRUDcontact = this.handleCRUDcontact.bind(this)
        this.handleOnChangeInputFormcontact = this.handleOnChangeInputFormcontact.bind(this)

    }
    componentDidMount = async () => {
        this.fetchfeatureTypeIDS()
    }
    async handleCRUDcontact() {
        let errors = this.state.contacterrors
        const tempCRUD_contact = this.state.contact      
        const actualUser = await Auth.currentAuthenticatedUser()
        const userID = actualUser.attributes.sub; 
        //Creo la FT CONSTRUCTOR_ORGANIZATION_INFORMATION_<contact.NAME>
        if(errors.name === '' && errors.id === '' && errors.phone === '' 
            && errors.cp === '' && errors.email === ''){
            this.setState({loading: true})    
            const payloadNewFeatureType = {
                id: `INVESTOR_ORGANIZATION_INFORMATION_${userID}_${tempCRUD_contact.name}`,
                name: tempCRUD_contact.name,
            }
            await API.graphql(graphqlOperation(createFeatureType, { input: payloadNewFeatureType }))
            //Creo las Features para CONSTRUCTOR_ORGANIZATION_INFORMATION_<contact.NAME> y sus valores los guardo en la PF
            for( let info in this.state.contact ){
                let id = `${userID}_${this.state.contact.name}_${info}`
                
                const payloadNewFeature = {
                    id: id,
                    name: info,
                    description: this.state.contact[`${info}`],
                    featureTypeID: `INVESTOR_ORGANIZATION_INFORMATION_${userID}_${tempCRUD_contact.name}`,
                    unitOfMeasureID: 'no_unit'
                }
                await API.graphql(graphqlOperation(createFeature, { input: payloadNewFeature }))
            }
                this.setState({
                    renderModalInformation:false,
    
                })
                this.notify()
                await this.cleanProductOnCreate()
        }else{
            this.notifyError('Complete los campos obligatorios')
        }
    }
    handleOnChangeInputFormcontact = async(event, pProperty) => {
        let tempCRUD_contact = this.state.contact
        if (event.target.name === 'contact_name') {
            tempCRUD_contact.name = event.target.value.toUpperCase().replace(/ /g, "_")
            let error = validarString(event.target.value, regexInputName)
            this.setState(prevState => ({
                contacterrors: {...prevState.contacterrors, name: error}}))
        }
        if (event.target.name === 'contact_id') {
            tempCRUD_contact.id = event.target.value
            let error = validarString(event.target.value, regexInputNumber)
            this.setState(prevState => ({
                contacterrors: {...prevState.contacterrors, id: error}}))
        }
        if (event.target.name === 'contact_direction') {
            tempCRUD_contact.direction = event.target.value
        }
        if (event.target.name === 'contact_city') {
            tempCRUD_contact.city = event.target.value
        }
        if (event.target.name === 'contact_department') {
            tempCRUD_contact.department =  event.target.value
        }
        if (event.target.name === 'contact_country') {
            tempCRUD_contact.country = event.target.value
        }
        if (event.target.name === 'contact_CP') {
            tempCRUD_contact.cp = event.target.value
            let error = validarString(event.target.value, regexInputNumber)
            this.setState(prevState => ({
                contacterrors: {...prevState.contacterrors, cp: error}}))
        }
        if (event.target.name === 'contact_phone') {
            tempCRUD_contact.phone = event.target.value
            let error = validarString(event.target.value, regexInputNumber)
            this.setState(prevState => ({
                contacterrors: {...prevState.contacterrors, phone: error}}))
        }
        if (event.target.name === 'contact_email') {
            tempCRUD_contact.email = event.target.value
            let error = validarString(event.target.value, regexInputEmail)
            this.setState(prevState => ({
                contacterrors: {...prevState.contacterrors, email: error}}))
        }
        this.setState({contact: tempCRUD_contact})
    }
    async fetchfeatureTypeIDS() {
        try {
            const actualUser = await Auth.currentAuthenticatedUser()
            const userID = actualUser.attributes.sub;   
            let filter = {
                id: {
                    contains: `INVESTOR_ORGANIZATION_INFORMATION_${userID}`
                }
                };
                
            const featureTypesData = await API.graphql({
            query: listFeatureTypes,
            variables: { filter }
            });

            if(featureTypesData.data.listFeatureTypes.items.length > 0){
                let filter = {
                    id: {
                      contains: `${userID}`
                    }
                  };
                  
                  const featuresData = await API.graphql({
                    query: listFeatures,
                    variables: { filter }
                  });
                  console.log(featuresData)
                let initialState = featuresData.data.listFeatures.items.reduce((acc, { name, description }) => {
                return {
                    ...acc,
                    [name]: description,
                };
                }, {});
                this.handleSetStatecontact(initialState)
                this.setState({inputBlocked: true})
            }
        } catch (error) {
            console.log(error)
        }
      }
      handleSetStatecontact (tempcontact){
        this.setState({
            contact: tempcontact
        })
    }
    async cleanProductOnCreate() {
        this.setState({
            contact:{
                name:'',
                id: '',
                direction:'',
                city:'',
                department:'',
                country:'',
                cp:'',
                phone:'',
                email:'',
            },
            contacterrors:{
                name:'',
                id: '',
                cp:'',
                phone:'',
                email:'',
            },
            loading: false,
            inputBlocked: false,
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
    notifyError = (e) =>{
        toast.error( e, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
        this.setState({loading: false})
    }
    render() {
        let {  contact, inputBlocked } = this.state
        return (
            <div className={s.container}>
                <ToastContainer />
                <div className={s.titleContainer}>
                    <h2>¡Bienvenido!</h2>
                    <p>Por favor, proporcione su información de contacto para que podamos mantenernos en comunicación con usted. 
                        Ingrese sus datos precisos y completos en los campos correspondientes a continuación.
                    </p>
                    <p>
                    Asegúrese de incluir al menos una forma de contacto, como su dirección de 
                    correo electrónico o número de teléfono, para que podamos ponernos en contacto con usted de manera efectiva.
                    </p>
                </div>
                <div className={s.formContainer}>
                    <h2>Información de Contacto</h2>
                    <form className={s.formInputs1}>
                                <fieldset className={s.inputContainer}>
                                    <legend>
                                        Nombre de Contacto*
                                        <div className={s["tooltip-text"]}>
                                            <InfoCircle className={s.infoCircle}/>
                                            <span className={s["tooltip"]}>No se aceptan números</span>
                                        </div>
                                    </legend>
                                    <input type="text"
                                           disabled={inputBlocked}  
                                            name='contact_name'
                                            value={contact.name}
                                            onChange={(e) => this.handleOnChangeInputFormcontact(e)} 
                                            placeholder='Nombre' />
                                    <span style={{color:'red', fontSize:'.6em'}}>{this.state.contacterrors.name}</span>
                                </fieldset>
                                <fieldset className={s.inputContainer}>
                                    <legend>
                                        Dirección
                                        <div className={s["tooltip-text"]}>
                                            <InfoCircle className={s.infoCircle}/>
                                            <span className={s["tooltip"]}>Ej: Av Colón 123</span>
                                        </div>
                                    </legend>
                                    <input type="text"
                                            name='contact_direction'
                                            disabled={inputBlocked}
                                            value={contact.direction}
                                            onChange={(e) => this.handleOnChangeInputFormcontact(e)} 
                                            placeholder='Dirección' />
                                </fieldset>
                                <fieldset className={s.inputContainer}>
                                    <legend>
                                        Ciudad
                                        <div className={s["tooltip-text"]}>
                                            <InfoCircle className={s.infoCircle}/>
                                            <span className={s["tooltip"]}>Ej: Bogotá</span>
                                        </div>
                                    </legend>
                                    <input type="text"
                                        name='contact_city'
                                        disabled={inputBlocked}
                                        value={contact.city}
                                        onChange={(e) => this.handleOnChangeInputFormcontact(e)} 
                                        placeholder='Ciudad' />
                                </fieldset>
                            </form>
                            <form className={s.formInputs1}>
                                <fieldset className={s.inputContainer}>
                                    <legend>
                                        Departamento
                                        <div className={s["tooltip-text"]}>
                                            <InfoCircle className={s.infoCircle}/>
                                            <span className={s["tooltip"]}>Ej: Cundinamarca</span>
                                        </div>
                                    </legend>
                                    <input type="text"
                                            name='contact_department'
                                            disabled={inputBlocked}
                                            value={contact.department}
                                            onChange={(e) => this.handleOnChangeInputFormcontact(e)} 
                                            placeholder='Departamento' />
                                </fieldset>
                                <fieldset className={s.inputContainer}>
                                    <legend>
                                        País
                                        <div className={s["tooltip-text"]}>
                                            <InfoCircle className={s.infoCircle}/>
                                            <span className={s["tooltip"]}>Ej: Colombia</span>
                                        </div>
                                    </legend>
                                    <input type='text' placeholder='País' name='contact_country' disabled={inputBlocked}  value={contact.country} onChange={(e) => this.handleOnChangeInputFormcontact(e)} />
                                </fieldset>
                                <fieldset className={s.inputContainer}>
                                    <legend>
                                        Código postal*
                                        <div className={s["tooltip-text"]}>
                                            <InfoCircle className={s.infoCircle}/>
                                            <span className={s["tooltip"]}>Sólo números</span>
                                        </div>
                                    </legend>
                                    <input type='number' placeholder='' name='contact_CP' disabled={inputBlocked}  value={contact.cp}  onChange={(e) => this.handleOnChangeInputFormcontact(e)} />
                                    <span style={{color:'red', fontSize:'.6em'}}>{this.state.contacterrors.cp}</span>
                                </fieldset>
                            </form>
                            <form className={s.formInputs1}>
                                <fieldset className={s.inputContainer}>
                                    <legend>
                                        Teléfono*
                                        <div className={s["tooltip-text"]}>
                                            <InfoCircle className={s.infoCircle}/>
                                            <span className={s["tooltip"]}>Sólo numeros</span>
                                        </div>
                                    </legend>
                                    <input type="numbre"
                                            name='contact_phone'
                                            disabled={inputBlocked}
                                            value={contact.phone}
                                            onChange={(e) => this.handleOnChangeInputFormcontact(e)} 
                                            placeholder='' />
                                    <span style={{color:'red', fontSize:'.6em'}}>{this.state.contacterrors.phone}</span>
                                </fieldset>
                                <fieldset className={s.inputContainer}>
                                    <legend>
                                        Email*
                                        <div className={s["tooltip-text"]}>
                                            <InfoCircle className={s.infoCircle}/>
                                            <span className={s["tooltip"]}>Ej: example@example.com</span>
                                        </div>
                                    </legend>
                                    <input type='text' placeholder='' name='contact_email' disabled={inputBlocked}  value={contact.email} onChange={(e) => this.handleOnChangeInputFormcontact(e)} />
                                    <span style={{color:'red', fontSize:'.6em'}}>{this.state.contacterrors.email}</span>
                                </fieldset>
                                <fieldset className={s.inputContainer}>
                                    <legend>
                                        C.C.*
                                        <div className={s["tooltip-text"]}>
                                            <InfoCircle className={s.infoCircle}/>
                                            <span className={s["tooltip"]}>Sólo números</span>
                                        </div>
                                    </legend>
                                    <input type="numbre"
                                            name='contact_id'
                                            disabled={inputBlocked} 
                                            value={contact.id}
                                            onChange={(e) => this.handleOnChangeInputFormcontact(e)} 
                                            placeholder='' />
                                    <span style={{color:'red', fontSize:'.6em'}}>{this.state.contacterrors.id}</span>
                                </fieldset>
                            </form>    

                    {inputBlocked?'':this.state.loading?<button className={s.solicitudButtonDisabled} disabled>CREANDO</button>:
                    <button className={s.solicitudButton} onClick={() => this.handleCRUDcontact()}>GUARDAR INFORMACIÓN</button>}
                    
                </div>
            </div>
        )
    }
}

export default InfoInvestor

