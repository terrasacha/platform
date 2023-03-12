import React, { Component } from 'react'
import s from './CompanyInformation.module.css'
// GraphQL
import { API, Auth, graphqlOperation } from 'aws-amplify'
import { createFeatureType, createProductFeature, createFeature } from '../../../../graphql/mutations'
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
        if(this.props.selectedCompany !== ''){
            try {
                this.setState({inputsBlocked: true})
                const userProductsData = await API.graphql(graphqlOperation(query));
                let listProductFeatures = userProductsData.data.listProductFeatures.items
                const filteredData = listProductFeatures.filter(item => 
                item.feature.featureTypeID === `CONSTRUCTOR_ORGANIZATION_INFORMATION_${this.props.selectedCompany}`
                ).reduce((acc, curr) => {
                if (!acc[curr.feature.name]) {
                    acc[curr.feature.name] = curr;
                }
                return acc;
                }, {});
                let listProductFeaturesfiltered = Object.values(filteredData)
                this.setState({inputs: listProductFeaturesfiltered})
                const obj = listProductFeaturesfiltered.reduce((acc, { feature: { name }, value }) => {
                    acc[name] = value;
                    return acc;
                  }, {});
                this.handleSetStateCompany(obj)
                /* const filteredData = listProductFeatures.filter(item => item.feature.featureTypeID === `CONSTRUCTOR_ORGANIZATION_INFORMATION_${this.props.selectedCompany}`); */
            } catch (err) {
              console.log('error fetching user products', err);
            }
        }else{
            this.setState({inputsBlocked: false})
            this.handleSetStateCompany({
                name:'',
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
        return (
            <div className={s.container}>
                <div className={s.formContainer}>
                    <form className={s.formInputs1}>
                        <fieldset className={s.inputContainer}>
                            <legend>Nombre de la Compañía</legend>
                            <input type="text"
                                    disabled={inputsBlocked}
                                    name='company_name'
                                    value={company.name}
                                    onChange={(e) => this.handleOnChangeInputFormCompany(e)} 
                                    placeholder='Nombre' />
                        </fieldset>
                        <fieldset className={s.inputContainer}>
                            <legend>Dirección</legend>  
                            <input type="text"
                                    name='company_direction'
                                    disabled={inputsBlocked}
                                    value={company.direction}
                                    onChange={(e) => this.handleOnChangeInputFormCompany(e)} 
                                    placeholder='Dirección' />
                        </fieldset>
                        <fieldset className={s.inputContainer}>
                            <legend>Ciudad</legend>
                            <input type="text"
                                name='company_city'
                                disabled={inputsBlocked}
                                value={company.city}
                                onChange={(e) => this.handleOnChangeInputFormCompany(e)} 
                                placeholder='Ciudad' />
                        </fieldset>
                    </form>
                    <form className={s.formInput1}>
                        <fieldset className={s.inputContainer}>
                            <legend>Departamento</legend>
                            <input type="text"
                                    name='company_department'
                                    disabled={inputsBlocked}
                                    value={company.department}
                                    onChange={(e) => this.handleOnChangeInputFormCompany(e)} 
                                    placeholder='Departamento' />
                        </fieldset>
                        <fieldset className={s.inputContainer}>
                            <legend>País</legend>
                            <input type='text' placeholder='País' name='company_country' disabled={inputsBlocked} value={company.country} onChange={(e) => this.handleOnChangeInputFormCompany(e)} />
                        </fieldset>
                        <fieldset className={s.inputContainer}>
                            <legend>Código postal</legend>
                            <input type='number' placeholder='' name='company_CP' disabled={inputsBlocked} value={company.cp}  onChange={(e) => this.handleOnChangeInputFormCompany(e)} />
                        </fieldset>
                    </form>
                    <form className={s.formInputs1}>
                        <fieldset className={s.inputContainer}>
                            <legend>Teléfono</legend>
                            <input type="numbre"
                                    name='company_phone'
                                    disabled={inputsBlocked}
                                    value={company.phone}
                                    onChange={(e) => this.handleOnChangeInputFormCompany(e)} 
                                    placeholder='' />
                        </fieldset>
                        <fieldset className={s.inputContainer}>
                            <legend>Email corporativo</legend>
                            <input type='text' placeholder='' name='company_email' disabled={inputsBlocked} value={company.email} onChange={(e) => this.handleOnChangeInputFormCompany(e)} />
                        </fieldset>
                        <fieldset className={s.inputContainer}>
                            <legend>Sitio web</legend>
                            <input type='text' placeholder='' name='company_website' disabled={inputsBlocked} value={company.website}  onChange={(e) => this.handleOnChangeInputFormCompany(e)} />
                        </fieldset>
                    </form>           
                </div>
            </div>
        )
    }
}

export default CompanyInformation

