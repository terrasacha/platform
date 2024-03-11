import React, { Component } from 'react'


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
            CRUDButtonName: 'ADD',
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

        if (this.state.CRUDButtonName === 'ADD') {
            if(tempNewProductFeature.order === '') tempNewProductFeature.order = 0
            tempNewProductFeature.id = uuidv4().replaceAll('-','_')
            tempNewProductFeature.productID = this.props.CRUD_Product.id
            tempNewProductFeature.featureID = this.props.selectedFeature.id
            
            const pF = await API.graphql(graphqlOperation(createProductFeature, { input: tempNewProductFeature }) )
            console.log(pF, "pf")
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
            CRUDButtonName: 'ADD',
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
            <>
            <table className="table-auto w-full">
                <thead>
                    <tr>
                    <th>Feature</th>
                    <th>Value</th>
                    <th>Order</th>
                    <th>Is on Main Card</th>
                    <th>Is to BlockChain</th>
                    <th>Is verifable</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>
                        <div className="mb-4">
                        <select
                            options={featuresSelectList}
                            onChange={this.handleOnSelectFeature}
                        />
                        {this.state.CRUDButtonName === 'UPDATE' ? (
                            <div className="btn-yellow text-white p-4 mb-4 rounded">
                            {this.state.newProductFeature.feature.name
                                ? this.state.newProductFeature.feature.name
                                : ''}
                            </div>
                        ) : (
                            ''
                        )}
                        </div>
                    </td>
                    <td>
                        <div className="mb-4">
                        <input
                            type="text"
                            placeholder=""
                            name="valueProductFeature"
                            value={this.state.newProductFeature.value}
                            onChange={(e) => this.handleCreateProductFeature(e)}
                            className="p-2 border border-gray-300 rounded-md w-full"
                        />
                        </div>
                    </td>
                    <td>
                        <div className="mb-4">
                        <input
                            type="number"
                            placeholder=""
                            name="orderProductFeature"
                            value={this.state.newProductFeature.order}
                            onChange={(e) => this.handleCreateProductFeature(e)}
                            className="p-2 border border-gray-300 rounded-md w-full"
                        />
                        </div>
                    </td>
                    <td>
                        <div className="mb-4">
                        <select
                            name="isOnMainCardProductFeature"
                            onChange={(e) => this.handleCreateProductFeature(e)}
                            className="p-2 border border-gray-300 rounded-md w-full"
                        >
                            <option>-</option>
                            <option value="no">No</option>
                            <option value="yes">Yes</option>
                        </select>
                        {this.state.newProductFeature.isOnMainCard ? (
                            <div className="btn-yellow text-white p-4 mb-4 rounded">
                            Yes
                            </div>
                        ) : (
                            <div className="btn-yellow text-white p-4 mb-4 rounded">
                            No
                            </div>
                        )}
                        </div>
                    </td>
                    <td>
                        <div className="mb-4">
                        <select
                            name="isToBlockChain"
                            onChange={(e) => this.handleCreateProductFeature(e)}
                            className="p-2 border border-gray-300 rounded-md w-full"
                        >
                            <option>-</option>
                            <option value="no">No</option>
                            <option value="yes">Yes</option>
                        </select>
                        {this.state.newProductFeature.isToBlockChain ? (
                            <div className="btn-yellow text-white p-4 mb-4 rounded">
                            Yes
                            </div>
                        ) : (
                            <div className="btn-yellow text-white p-4 mb-4 rounded">
                            No
                            </div>
                        )}
                        </div>
                    </td>
                    <td>
                        <div className="mb-4">
                        <select
                            name="isVerifable"
                            onChange={(e) => this.handleCreateProductFeature(e)}
                            className="p-2 border border-gray-300 rounded-md w-full"
                        >
                            <option>-</option>
                            <option value="no">No</option>
                            <option value="yes">Yes</option>
                        </select>
                        {this.state.newProductFeature.isVerifable ? (
                            <div className="btn-yellow text-white p-4 mb-4 rounded">
                            Yes
                            </div>
                        ) : (
                            <div className="btn-yellow text-white p-4 mb-4 rounded">
                            No
                            </div>
                        )}
                        </div>
                    </td>
                    </tr>
                </tbody>
                </table>
                <button
                variant="primary"
                onClick={this.handleCRUDProductFeature}
                >
                {this.state.CRUDButtonName}
                </button>
                </>
            
        )
    }
        const renderProductFeatures = () => {
            let productFeatures = listPF.filter(pf => pf.productID === this.props.CRUD_Product.id);
                if (productFeatures.length > 0) {
                    return (
                        <table striped bordered hover>
                            <thead>
                            <tr>
                                <th>Feature</th>
                                <th>Order</th>
                                <th>Value</th>
                                <th>Main Card</th>
                                <th>Is to BlockChain</th>
                                <th>Is verifable</th>
                                <th>Edit</th>
                            </tr>
                            </thead>
                            <tbody>
                            {productFeatures.map(productFeatures => (
                                <tr key={productFeatures.id}>
                                    <td>
                                        {productFeatures.feature.name} 
                                    </td>
                                    <td>
                                        {productFeatures.order} 
                                    </td>
                                    <td>
                                        {productFeatures.value}
                                    </td>
                                    <td>
                                        {productFeatures.isOnMainCard? 'Yes' : 'No'}
                                    </td>
                                    <td>
                                        {productFeatures.isToBlockChain? 'Yes' : 'No'}
                                    </td>
                                    <td>
                                        {productFeatures.isVerifable? 'Yes' : 'No'}
                                    </td>
                                    <td>
                                        <button
                                            variant='primary'
                                            size='sm' 
                                            onClick={(e) => this.handleLoadEditProductFeature(productFeatures, e)}
                                        >Editar</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
            )
        }
    
    }
    return (
      <>
        <h2>Product Features</h2>
        {renderCRUDProductFeatures()}
        {renderProductFeatures()}
      </>
    )
  }
}
