import React, { Component } from 'react'
//bootstrap
import { Alert, Button, Col, Form, Table } from 'react-bootstrap'
//GraphQL
import { API, graphqlOperation } from 'aws-amplify'
import { updateProductFeature } from '../../../graphql/mutations'
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
                value: 0,
                isToBlockChain: false,
                isVerifable: false,
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
                newProductFeature: {                   
                    ...prevState.newProductFeature,   
                    value: e.target.value       
                }
            }))
        }
        if(e.target.name === 'isToBlockChain'){
            if(e.target.value === 'yes'){
                this.setState(prevState => ({
                    newProductFeature: {                   
                        ...prevState.newProductFeature,   
                        isToBlockChain: true       
                    }
                }))
            }
            if(e.target.value === 'no'){
                this.setState(prevState => ({
                    newProductFeature: {                   
                        ...prevState.newProductFeature,   
                        isToBlockChain: false       
                    }
                }))
            }
            
        }
        if(e.target.name === 'isVerifiable'){
            if(e.target.value === 'yes'){
                this.setState(prevState => ({
                    newProductFeature: {                   
                        ...prevState.newProductFeature,   
                        isVerifable: true       
                    }
                }))
            }
            if(e.target.value === 'no'){
                this.setState(prevState => ({
                    newProductFeature: {                   
                        ...prevState.newProductFeature,   
                        isVerifable: false       
                    }
                }))
            }
            
        }
    }
    async handleCRUDProductFeature() {
        let tempNewProductFeature = this.state.newProductFeature

        if (this.state.CRUDButtonName === 'ADD') {
            tempNewProductFeature.id = uuidv4().replaceAll('-','_')
            tempNewProductFeature.productID = this.props.CRUD_Product.id
            tempNewProductFeature.featureID = this.props.selectedFeature.id
            
            this.handleAddNewFeatureToActualProduct(tempNewProductFeature)
            await this.cleanProductFeatureCreate()
        }
        
        
        

        if (this.state.CRUDButtonName === 'UPDATE') {
            delete tempNewProductFeature.createdAt
            delete tempNewProductFeature.updatedAt
            delete tempNewProductFeature.productID
            delete tempNewProductFeature.featureID
            delete tempNewProductFeature.feature
            delete tempNewProductFeature.verifications
            delete tempNewProductFeature.documents
            await API.graphql(graphqlOperation(updateProductFeature, { input: this.state.newProductFeature }))
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
            value: 0,
            isToBlockChain: false,
            isVerifable: false,
        },
       })
   }
   handleLoadEditProductFeature= async(productFeature, event) => {
    console.log(productFeature)
    this.setState({
            newProductFeature:  productFeature,
            CRUDButtonName: 'UPDATE',
        })

    }

  render() {
    let { featuresSelectList, selectedFeature, productFeatures} = this.props

    const renderCRUDProductFeatures = () => {
        return (
            <>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Feature</th>
                    <th>Description</th>
                    <th>Value</th>
                    <th>Is to BlockChain</th>
                    <th>Is verifable</th>
                </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <Form.Group as={Col} controlId='formGridCRUD_ProductFeature'>
                                    <Select 
                                        options={featuresSelectList}
                                        onChange={this.handleOnSelectFeature} />
                                        {this.state.CRUDButtonName === 'UPDATE'?
                                            <Alert key="idx_key_1" variant='success' size='sm'>
                                                {this.state.newProductFeature.feature.name}
                                            </Alert> : ''}
                                        
                            </Form.Group>
                        </td>
                        <td>
                            <Form.Group as={Col} controlId='formGridCRUD_ProductFeature_Description'>
                                {this.state.CRUDButtonName === 'UPDATE'? 
                                        <Form.Label>{this.state.newProductFeature.feature.description}</Form.Label>
                                        :
                                        <Form.Label>{selectedFeature?selectedFeature.description : '-'}</Form.Label>}
                            </Form.Group>
                        </td>
                        <td>
                            <Form.Group as={Col} controlId='formGridCRUD_ProductOrder'>
                                <Form.Control
                                    type='number'
                                    placeholder=''
                                    name='valueProductFeature'
                                    value={this.state.newProductFeature.value}
                                    onChange={(e) => this.handleCreateProductFeature(e)} />
                            </Form.Group>
                        </td>
                        <td>
                            <Form.Group as={Col} controlId='formGridCRUD_ProductFeatureIsToBlockChain'>
                                    <Form.Select  name='isToBlockChain' onChange={(e) => this.handleCreateProductFeature(e)} >
                                        <option>-</option>
                                        <option value='no'>No</option>
                                        <option value='yes'>Yes</option>
                                    </Form.Select>
                                    <Alert key="idx_key_1" variant='success'>
                                            {this.state.newProductFeature.isToBlockChain? 'Yes' : 'No'}
                                        </Alert>
                                </Form.Group>
                        </td>
                        <td>
                            <Form.Group as={Col} controlId='formGridCRUD_ProductFeatureIsVerifable'>
                                    <Form.Select  name='isVerifiable' onChange={(e) => this.handleCreateProductFeature(e)} >
                                        <option>-</option>
                                        <option value='no' >No</option>
                                        <option value='yes'>Yes</option>
                                    </Form.Select>
                                    <Alert key="idx_key_1" variant='success'>
                                            {this.state.newProductFeature.isVerifable? 'Yes' : 'No'}
                                        </Alert>
                                </Form.Group>
                        </td>
                    </tr>
                </tbody>
            </Table>
            <Button
            variant='primary'
             
            onClick={this.handleCRUDProductFeature}
            >{this.state.CRUDButtonName}</Button>
            </>
            
        )
    }
        const renderProductFeatures = () => {
        if (productFeatures.length > 0) {
            return (
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Value</th>
                        <th>Is to BlockChain</th>
                        <th>Is verifable</th>
                        <th>Edit</th>
                    </tr>
                    </thead>
                    <tbody>
                    {productFeatures.map(productFeatures => (
                        <tr key={productFeatures.id}>
                            <td>
                                {productFeatures.id}
                            </td>
                            <td>
                                {productFeatures.value}
                            </td>
                            <td>
                                {productFeatures.isToBlockChain? 'Yes' : 'No'}
                            </td>
                            <td>
                                {productFeatures.isVerifable? 'Yes' : 'No'}
                            </td>
                            <td>
                               {!productFeatures.isToBlockChain?
                                <Button
                                    variant='primary'
                                    size='sm' 
                                    onClick={(e) => this.handleLoadEditProductFeature(productFeatures, e)}
                                >Editar</Button> : ''}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            )
        }
    
    }
    return (
      <>
        {renderCRUDProductFeatures()}
        <h2>Product Features</h2>
        {renderProductFeatures()}
      </>
    )
  }
}
