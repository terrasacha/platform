import React, { Component } from 'react'
//Bootstrap reemplazado con Tailwind CSS y sistema Terrasacha
//GraphQL
import { API, graphqlOperation } from 'aws-amplify'
import { createProductFeature, updateProductFeature, createVerification } from '../../../graphql/mutations'
//Utils
import Select from 'react-select'
import { v4 as uuidv4 } from 'uuid'


export default class CRUDProductFeatures extends Component {
    constructor(props) {
        super(props)
        this.state = {
            CRUDButtonName: 'AGREGAR',
            isCRUDButtonDisable: true,
            newProductFeature: {
                id: '',
                productID: '',
                featureID: '',
                value: '',
                order: '',
                isOnMainCard: true,
                isToBlockChain: false,
                isVerifable: false,
            },
            newVerification: {
                id: '',
                createdOn: '',
                updatedOn: '',
                sign: '',
                userVerifierID: 'ef21568e-027c-4aaf-8cf4-b1bbce19110b',
                userVerifiedID: '',
                productFeatureID: '',
            },
        }
        this.handleOnSelectFeature = this.props.handleOnSelectFeature.bind(this)
        this.handleAddNewFeatureToActualProduct = this.props.handleAddNewFeatureToActualProduct.bind(this)
        this.handleCreateProductFeature = this.handleCreateProductFeature.bind(this)
        this.handleCRUDProductFeature = this.handleCRUDProductFeature.bind(this)
        this.handleLoadEditProductFeature = this.handleLoadEditProductFeature.bind(this)
    }

    handleCreateProductFeature(e){
        if(e.target.name === 'valueProductFeature'){
            this.setState(prevState => ({
                newProductFeature: {...prevState.newProductFeature, value: e.target.value}}))
        }
        if(e.target.name === 'orderProductFeature'){        
            this.setState(prevState => ({
                newProductFeature: {...prevState.newProductFeature, order: e.target.value}}))
        }
        if(e.target.name === 'isOnMainCardProductFeature'){
            if(e.target.value === 'yes'){
                this.setState(prevState => ({
                    newProductFeature: {...prevState.newProductFeature, isOnMainCard: true}}))
            }
            if(e.target.value === 'no'){
                this.setState(prevState => ({
                    newProductFeature: {...prevState.newProductFeature, isOnMainCard: false}}))
            }
        }
        if(e.target.name === 'isToBlockChain'){
            if(e.target.value === 'yes'){
                this.setState(prevState => ({
                    newProductFeature: {...prevState.newProductFeature, isToBlockChain: true}}))
            }
            if(e.target.value === 'no'){
                this.setState(prevState => ({
                    newProductFeature: {...prevState.newProductFeature, isToBlockChain: false}}))
            }
        }
        if(e.target.name === 'isVerifable'){
            if(e.target.value === 'yes'){
                this.setState(prevState => ({
                    newProductFeature: {...prevState.newProductFeature, isVerifable: true}}))
            }
            if(e.target.value === 'no'){
                this.setState(prevState => ({
                    newProductFeature: {...prevState.newProductFeature, isVerifable: false}}))
            } 
        }
    }
    async handleCRUDProductFeature() {
        let tempNewProductFeature = this.state.newProductFeature

        if (this.state.CRUDButtonName === 'AGREGAR') {
            if(tempNewProductFeature.order === '') tempNewProductFeature.order = 0
            tempNewProductFeature.id = uuidv4().replaceAll('-','_')
            tempNewProductFeature.productID = this.props.CRUD_Product.id
            tempNewProductFeature.featureID = this.props.selectedFeature.id
            
            const pF = await API.graphql(graphqlOperation(createProductFeature, { input: tempNewProductFeature }) )
            let constructorID = ''
            pF.data.createProductFeature.product.userProducts.items.map( uP => {
                if (uP.user.role === 'constructor') {
                  constructorID = uP.user.id
                  return
                }
            })

            if (tempNewProductFeature.isVerifable === true) {
                let tempNewVerification = this.state.newVerification
                tempNewVerification.id = uuidv4().replaceAll('-', '_')
                tempNewVerification.createdOn = new Date().toISOString()
                tempNewVerification.updatedOn = new Date().toISOString()
                tempNewVerification.productFeatureID = tempNewProductFeature.id
                tempNewVerification.userVerifiedID = constructorID
                await API.graphql(graphqlOperation(createVerification, { input: tempNewVerification }))
                await this.cleanVerificationCreate()
            }

            await this.cleanProductFeatureCreate()
        }
        
        if (this.state.CRUDButtonName === 'UPDATE') {
            delete tempNewProductFeature.createdAt
            delete tempNewProductFeature.updatedAt
            delete tempNewProductFeature.productID
            delete tempNewProductFeature.featureID
            delete tempNewProductFeature.feature
            delete tempNewProductFeature.product
            delete tempNewProductFeature.verifications
            delete tempNewProductFeature.productFeatureResults
            delete tempNewProductFeature.productFeatureResults2
            delete tempNewProductFeature.documents
            await API.graphql(graphqlOperation(updateProductFeature, { input: this.state.newProductFeature }))
            this.handleAddNewFeatureToActualProduct(tempNewProductFeature, 'UPDATE')
            await this.cleanProductFeatureCreate()
        }
    }

    async cleanProductFeatureCreate() {
        this.setState({
            CRUDButtonName: 'AGREGAR',
            isCRUDButtonDisable: true,
            newProductFeature: {
                id: '',
                productID: '',
                featureID: '',
                value: '',
                order: '',
                isOnMainCard: true,
                isToBlockChain: false,
                isVerifable: false,
            },
       })
    }

    async cleanVerificationCreate() {
        this.setState({
            newVerification: {
                id: '',
                createdOn: '',
                updatedOn: '',
                sign: '',
                userVerifierID: 'ef21568e-027c-4aaf-8cf4-b1bbce19110b',
                userVerifiedID: '',
                productFeatureID: '',
            },
        })
    }

   handleLoadEditProductFeature= async(productFeature, event) => {
    this.setState({
            newProductFeature:  productFeature,
            CRUDButtonName: 'UPDATE',
        })

    }

  render() {
    let { featuresSelectList, listPF} = this.props

    const renderCRUDProductFeatures = () => {
        return (
            <div className="bg-white rounded-xl shadow-terrasacha-lg border border-terrasacha-light/20 p-6 mb-6">
                <h3 className="text-lg font-bold text-terrasacha-primary font-champagne mb-4">
                    {this.state.CRUDButtonName === 'UPDATE' ? 'Editar' : 'Agregar'} Característica
                </h3>
                
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-terrasacha-primary text-white">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-bold font-typographica uppercase tracking-wider">
                                    Característica
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-bold font-typographica uppercase tracking-wider">
                                    Valor
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-bold font-typographica uppercase tracking-wider">
                                    Orden
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-bold font-typographica uppercase tracking-wider">
                                    ¿Tarjeta Principal?
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-bold font-typographica uppercase tracking-wider">
                                    ¿A BlockChain?
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-bold font-typographica uppercase tracking-wider">
                                    ¿Es Verificable?
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            <tr className="border-b border-terrasacha-light/20">
                                <td className="px-4 py-4">
                                    <div className="space-y-2">
                                        <Select 
                                            options={featuresSelectList}
                                            placeholder="Seleccionar característica..."
                                            onChange={this.handleOnSelectFeature}
                                            className="font-typographica"
                                            styles={{
                                                control: (provided) => ({
                                                    ...provided,
                                                    borderColor: '#b1c181',
                                                    boxShadow: 'none',
                                                    '&:hover': { borderColor: '#6e6c35' },
                                                    borderRadius: '8px',
                                                    minHeight: '40px'
                                                }),
                                                option: (provided, state) => ({
                                                    ...provided,
                                                    backgroundColor: state.isSelected ? '#6e6c35' : state.isFocused ? '#b1c181' : 'white',
                                                    color: state.isSelected ? 'white' : '#44482c',
                                                    fontFamily: 'Typographica'
                                                })
                                            }}
                                        />
                                        {this.state.CRUDButtonName === 'UPDATE' && (
                                            <div className="bg-terrasacha-success/10 border border-terrasacha-success text-terrasacha-secondary1 px-3 py-2 rounded-lg text-sm font-typographica">
                                                ✓ {this.state.newProductFeature.feature?.name || ''}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <input
                                        type="text"
                                        placeholder="Ingrese el valor"
                                        name="valueProductFeature"
                                        value={this.state.newProductFeature.value}
                                        onChange={(e) => this.handleCreateProductFeature(e)}
                                        className="form-terrasacha-input"
                                    />
                                </td>
                                <td className="px-4 py-4">
                                    <input
                                        type="number"
                                        placeholder="0"
                                        name="orderProductFeature"
                                        value={this.state.newProductFeature.order}
                                        onChange={(e) => this.handleCreateProductFeature(e)}
                                        className="form-terrasacha-input"
                                    />
                                </td>
                                <td className="px-4 py-4">
                                    <div className="space-y-2">
                                        <select 
                                            name="isOnMainCardProductFeature" 
                                            onChange={(e) => this.handleCreateProductFeature(e)}
                                            className="form-terrasacha-select"
                                        >
                                            <option value="">Seleccionar...</option>
                                            <option value="no">No</option>
                                            <option value="yes">Sí</option>
                                        </select>
                                        <div className={`inline-flex px-2 py-1 rounded-full text-xs font-bold font-typographica ${
                                            this.state.newProductFeature.isOnMainCard 
                                                ? 'bg-terrasacha-success text-white' 
                                                : 'bg-terrasacha-warning text-terrasacha-secondary1'
                                        }`}>
                                            {this.state.newProductFeature.isOnMainCard ? 'Sí' : 'No'}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="space-y-2">
                                        <select 
                                            name="isToBlockChain" 
                                            onChange={(e) => this.handleCreateProductFeature(e)}
                                            className="form-terrasacha-select"
                                        >
                                            <option value="">Seleccionar...</option>
                                            <option value="no">No</option>
                                            <option value="yes">Sí</option>
                                        </select>
                                        <div className={`inline-flex px-2 py-1 rounded-full text-xs font-bold font-typographica ${
                                            this.state.newProductFeature.isToBlockChain 
                                                ? 'bg-terrasacha-success text-white' 
                                                : 'bg-terrasacha-warning text-terrasacha-secondary1'
                                        }`}>
                                            {this.state.newProductFeature.isToBlockChain ? 'Sí' : 'No'}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="space-y-2">
                                        <select 
                                            name="isVerifable" 
                                            onChange={(e) => this.handleCreateProductFeature(e)}
                                            className="form-terrasacha-select"
                                        >
                                            <option value="">Seleccionar...</option>
                                            <option value="no">No</option>
                                            <option value="yes">Sí</option>
                                        </select>
                                        <div className={`inline-flex px-2 py-1 rounded-full text-xs font-bold font-typographica ${
                                            this.state.newProductFeature.isVerifable 
                                                ? 'bg-terrasacha-success text-white' 
                                                : 'bg-terrasacha-warning text-terrasacha-secondary1'
                                        }`}>
                                            {this.state.newProductFeature.isVerifable ? 'Sí' : 'No'}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div className="mt-6 pt-4 border-t border-terrasacha-light/20">
                    <button
                        className="btn-terrasacha-primary text-lg py-3 px-8"
                        onClick={this.handleCRUDProductFeature}
                    >
                        {this.state.CRUDButtonName}
                    </button>
                </div>
            </div>
        )
    }
        const renderProductFeatures = () => {
            let productFeatures = listPF.filter(pf => pf.productID === this.props.CRUD_Product.id);
            if (productFeatures.length > 0) {
                return (
                    <div className="bg-white shadow-terrasacha rounded-lg overflow-hidden border border-terrasacha-light/20">
                        <div className="px-6 py-4 bg-terrasacha-light/10 border-b border-terrasacha-light/20">
                            <h3 className="text-lg font-bold text-terrasacha-primary font-champagne">
                                Características Configuradas
                            </h3>
                            <p className="text-sm text-terrasacha-secondary1 font-typographica mt-1">
                                Lista de características asignadas a este producto
                            </p>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-terrasacha-primary text-white">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold font-typographica uppercase tracking-wider">
                                            Característica
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-bold font-typographica uppercase tracking-wider">
                                            Orden
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-bold font-typographica uppercase tracking-wider">
                                            Valor
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-bold font-typographica uppercase tracking-wider">
                                            Tarjeta Principal
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-bold font-typographica uppercase tracking-wider">
                                            BlockChain
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-bold font-typographica uppercase tracking-wider">
                                            Verificable
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-bold font-typographica uppercase tracking-wider">
                                            Acción
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-terrasacha-light/20">
                                    {productFeatures.map((productFeature, index) => (
                                        <tr 
                                            key={productFeature.id}
                                            className={`${
                                                index % 2 === 0 ? 'bg-white' : 'bg-terrasacha-light/5'
                                            } hover:bg-terrasacha-light/10 transition-colors duration-150`}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-terrasacha-primary font-typographica">
                                                {productFeature.feature.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-terrasacha-light/20 text-terrasacha-secondary1 font-typographica">
                                                    #{productFeature.order}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-terrasacha-secondary1 font-typographica max-w-xs truncate">
                                                {productFeature.value}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold font-typographica ${
                                                    productFeature.isOnMainCard 
                                                        ? 'bg-terrasacha-success text-white' 
                                                        : 'bg-terrasacha-warning text-terrasacha-secondary1'
                                                }`}>
                                                    {productFeature.isOnMainCard ? 'Sí' : 'No'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold font-typographica ${
                                                    productFeature.isToBlockChain 
                                                        ? 'bg-terrasacha-secondary2 text-white' 
                                                        : 'bg-gray-200 text-gray-600'
                                                }`}>
                                                    {productFeature.isToBlockChain ? 'Sí' : 'No'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold font-typographica ${
                                                    productFeature.isVerifable 
                                                        ? 'bg-terrasacha-info text-white' 
                                                        : 'bg-gray-200 text-gray-600'
                                                }`}>
                                                    {productFeature.isVerifable ? 'Sí' : 'No'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <button
                                                    className="btn-terrasacha-secondary text-sm"
                                                    onClick={(e) => this.handleLoadEditProductFeature(productFeature, e)}
                                                >
                                                    Editar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            }
        }
    
    return (
      <div className="space-y-6 p-6">
        <div className="border-b border-terrasacha-light/20 pb-4">
          <h2 className="text-2xl font-bold text-terrasacha-primary font-champagne">
            Gestión de Características del Producto
          </h2>
          <p className="text-terrasacha-secondary1 font-typographica mt-2">
            Configure las características específicas para este producto
          </p>
        </div>
        
        {renderCRUDProductFeatures()}
        {renderProductFeatures()}
      </div>
    )
  }
}
