import React, { Component } from 'react'
import s from './CompanyInformation.module.css'
import { InfoCircle } from 'react-bootstrap-icons'
import { Modal } from 'react-bootstrap'
// GraphQL
import { listFeatures } from '../../../../graphql/queries'
import { API, Auth, graphqlOperation } from 'aws-amplify'
import 'react-toastify/dist/ReactToastify.css';
import WebAppConfig from '../../../common/_conf/WebAppConfig'
// Utils 
// AWS S3 Storage
import { v4 as uuidv4 } from 'uuid'
const query = `
query MyQuery {
    listProductFeatures {
      items {
        id
        value
        feature {
          name
          featureTypeID
        }
      }
    }
  }
`;
class CompanyInformation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            inputsBlocked:false,
            inputs: []
        }
        this.handleOnChangeInputFormCompany = this.props.handleOnChangeInputFormCompany.bind(this)
        this.fetchfeatureTypeIDS = this.fetchfeatureTypeIDS.bind(this)
        this.handleSetStateCompany = this.props.handleSetStateCompany.bind(this)
    }

    componentDidMount = async () => {
        await this.fetchfeatureTypeIDS()
    }
    componentDidUpdate = async(prevProps) => {
        // Uso tipico (no olvides de comparar las props):
        if (this.props.selectedCompany !== prevProps.selectedCompany) {
            await this.fetchfeatureTypeIDS()
        }
      }
    async fetchfeatureTypeIDS() {
        if(this.props.selectedCompany !== 'nueva empresa' && this.props.selectedCompany !== 'persona natural' && this.props.selectedCompany !== 'no company'){
            try {
                this.setState({inputsBlocked: true})
                const actualUser = await Auth.currentAuthenticatedUser()
                const userID = actualUser.attributes.sub;   
                let filter = {
                    id: {
                      contains: userID
                    }
                  };
                  
                  const featuresData = await API.graphql({
                    query: listFeatures,
                    variables: { filter }
                  });
                let initialState = featuresData.data.listFeatures.items.reduce((acc, { name, description }) => {
                return {
                    ...acc,
                    [name]: description,
                };
                }, {});
                this.handleSetStateCompany(initialState)
            } catch (error) {
                console.log(error)
            }
        }else{
            this.setState({inputsBlocked: false})
            this.handleSetStateCompany({
                name:'',
                id: '',
                direction:'',
                city:'',
                department:'',
                country:'',
                cp:'',
                phone:'',
                email:'',
                website:'',
            })
        }
      }
    render() {
        let { company } = this.props
        let { inputsBlocked } = this.state
        const urlS3Image = WebAppConfig.url_s3_public_images
        let id 
        if(this.props.selectedCompany === 'nueva empresa') id = 'N.I.T.'
        if(this.props.selectedCompany === 'persona natural') id = 'C.C.'
        return (
            <Modal
                show={this.props.renderModalInformation}
                    onHide={(e) => this.props.onHideModalInformation()}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                <Modal.Body>
                    <div className={s.container}>
                        <div className={s.formContainer}>
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
                                            disabled={inputsBlocked}
                                            name='company_name'
                                            value={company.name}
                                            onChange={(e) => this.handleOnChangeInputFormCompany(e)} 
                                            placeholder='Nombre' />
                                    <span style={{color:'red', fontSize:'.6em'}}>{this.props.companyerrors.name}</span>
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
                                            name='company_direction'
                                            disabled={inputsBlocked}
                                            value={company.direction}
                                            onChange={(e) => this.handleOnChangeInputFormCompany(e)} 
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
                                        name='company_city'
                                        disabled={inputsBlocked}
                                        value={company.city}
                                        onChange={(e) => this.handleOnChangeInputFormCompany(e)} 
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
                                            name='company_department'
                                            disabled={inputsBlocked}
                                            value={company.department}
                                            onChange={(e) => this.handleOnChangeInputFormCompany(e)} 
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
                                    <input type='text' placeholder='País' name='company_country' disabled={inputsBlocked} value={company.country} onChange={(e) => this.handleOnChangeInputFormCompany(e)} />
                                </fieldset>
                                <fieldset className={s.inputContainer}>
                                    <legend>
                                        Código postal*
                                        <div className={s["tooltip-text"]}>
                                            <InfoCircle className={s.infoCircle}/>
                                            <span className={s["tooltip"]}>Sólo números</span>
                                        </div>
                                    </legend>
                                    <input type='number' placeholder='' name='company_CP' disabled={inputsBlocked} value={company.cp}  onChange={(e) => this.handleOnChangeInputFormCompany(e)} />
                                    <span style={{color:'red', fontSize:'.6em'}}>{this.props.companyerrors.cp}</span>
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
                                            name='company_phone'
                                            disabled={inputsBlocked}
                                            value={company.phone}
                                            onChange={(e) => this.handleOnChangeInputFormCompany(e)} 
                                            placeholder='' />
                                    <span style={{color:'red', fontSize:'.6em'}}>{this.props.companyerrors.phone}</span>
                                </fieldset>
                                <fieldset className={s.inputContainer}>
                                    <legend>
                                        Email*
                                        <div className={s["tooltip-text"]}>
                                            <InfoCircle className={s.infoCircle}/>
                                            <span className={s["tooltip"]}>Ej: example@example.com</span>
                                        </div>
                                    </legend>
                                    <input type='text' placeholder='' name='company_email' disabled={inputsBlocked} value={company.email} onChange={(e) => this.handleOnChangeInputFormCompany(e)} />
                                    <span style={{color:'red', fontSize:'.6em'}}>{this.props.companyerrors.email}</span>
                                </fieldset>
                                <fieldset className={s.inputContainer}>
                                    <legend>
                                        {id}*
                                        <div className={s["tooltip-text"]}>
                                            <InfoCircle className={s.infoCircle}/>
                                            <span className={s["tooltip"]}>Sólo números</span>
                                        </div>
                                    </legend>
                                    <input type="numbre"
                                            name='company_id'
                                            disabled={inputsBlocked}
                                            value={company.id}
                                            onChange={(e) => this.handleOnChangeInputFormCompany(e)} 
                                            placeholder='' />
                                    <span style={{color:'red', fontSize:'.6em'}}>{this.props.companyerrors.id}</span>
                                </fieldset>
                            </form>           
                            <form className={s.formInputs1}>
                                {this.props.selectedCompany === 'nueva empresa'?<fieldset className={s.inputContainer}>
                                    <legend>
                                        Sitio web
                                        <div className={s["tooltip-text"]}>
                                            <InfoCircle className={s.infoCircle}/>
                                            <span className={s["tooltip"]}>Ej: www.example.com</span>
                                        </div>
                                    </legend>
                                    <input type='text' placeholder='' name='company_website' disabled={inputsBlocked} value={company.website}  onChange={(e) => this.handleOnChangeInputFormCompany(e)} />
                                    <span style={{color:'red', fontSize:'.6em'}}>{this.props.companyerrors.website}</span>
                                </fieldset> : ''}
                            </form> 
                            {this.state.inputsBlocked?'':
                                <button className={s.solicitudButton} onClick={this.props.handleCRUDCompany}>CREAR INFORMACIÓN</button>        
                            }
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        )
    }
}

export default CompanyInformation

