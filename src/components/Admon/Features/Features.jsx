import React, { Component } from 'react'
// Amplify
import { withAuthenticator } from '@aws-amplify/ui-react'
// import '@aws-amplify/ui-react/styles.css'
// Bootstrap
import { Container, Button, Form, Row, Col, Table } from 'react-bootstrap'
// Auth css custom
import Bootstrap from "../../common/themes"
// GraphQL
import { API, graphqlOperation } from 'aws-amplify'
import { listFeatures, } from '../../../graphql/queries'
import { createFeature, updateFeature } from '../../../graphql/mutations'
import { onCreateFeature, onUpdateFeature } from '../../../graphql/subscriptions'


 class Features extends Component {
    constructor(props) {
        super(props)
        this.state = {
            date: new Date(),
            CRUDButtonName: 'CREATE',
            isCRUDButtonDisable: true,
            features:[],
            newFeature:{
                id: '',
                name: '',
                description: '',
                order: 0,
                isTemplate: false,
                defaultValue: null
               /*  isAvailable: true, */
            },
        }
            this.handleOnChangeInputForm = this.handleOnChangeInputForm.bind(this)
            this.handleCRUDFeature = this.handleCRUDFeature.bind(this)
            this.handleLoadEditFeature = this.handleLoadEditFeature.bind(this)
        }

    componentDidMount = async () => {
        await this.loadFeatures()
        // Subscriptions
        // OnCreate Feature
        let tempFeatures = this.state.features
        this.createFeatureListener = API.graphql(graphqlOperation(onCreateFeature))
        .subscribe({
            next: createdFeatureData => {
                let tempOnCreateFeature = createdFeatureData.value.data.onCreateFeature
                tempFeatures.push(tempOnCreateFeature)
                // Ordering Features by name
                tempFeatures.sort((a, b) => (a.name > b.name) ? 1 : -1)
                // this.updateStateFeatures(tempFeatures)
                this.setState((state) => ({features: tempFeatures}))
            }
        })
        // OnUpdate Feature
        this.updateFeatureListener = API.graphql(graphqlOperation(onUpdateFeature))
        .subscribe({
            next: updatedFeatureData => {
                let tempFeatures = this.state.features.map((mapFeature) => {
                    if (updatedFeatureData.value.data.onUpdateFeature.id === mapFeature.id) {
                        return updatedFeatureData.value.data.onUpdateFeature
                    } else {
                        return mapFeature
                    }
                })
                // Ordering Features by name
                tempFeatures.sort((a, b) => (a.name > b.name) ? 1 : -1)
                this.setState((state) => ({features: tempFeatures}))
            }
        })
    
    }

    async loadFeatures() {
        const listFeaturesResult = await API.graphql(graphqlOperation(listFeatures))
        listFeaturesResult.data.listFeatures.items.sort((a, b) => (a.name > b.name) ? 1 : -1)
        this.setState({features: listFeaturesResult.data.listFeatures.items})
        }
        
    handleOnChangeInputForm = async(event) => {
        let tempNewFeature = this.state.newFeature
        if (event.target.name === 'feature.name') {
            tempNewFeature.name = event.target.value.toUpperCase()
            tempNewFeature.name = tempNewFeature.name.replace(' ','')
        }
        if (event.target.name === 'feature.description') {
            tempNewFeature.description = event.target.value
        }
        if (event.target.name === 'feature.order') {
        tempNewFeature.order = parseInt(event.target.value)
        }
        if (event.target.name === 'feature.defaultValue') {
        tempNewFeature.defaultValue = parseInt(event.target.value)
        }
        if (event.target.name === 'feature.isTemplate') {
            if(event.target.value === 'yes'){
               tempNewFeature.isTemplate = true
            }else{
                tempNewFeature.isTemplate = false
                
            }
        }
/*         if (event.target.name === 'feature.isAvailable') {
            if(event.target.value === 'yes'){
               tempNewFeature.isAvailable = true
            }else{
                tempNewFeature.isAvailable = false
                
            }
        } */
        
        this.setState({newFeature: tempNewFeature})
        console.log(this.state.newFeature)
        this.validateCRUDFeature()
        
    }

    async validateCRUDFeature() {
        if (this.state.newFeature.name !== '') {
            this.setState({isCRUDButtonDisable: false})
        }
    }
    
    async handleCRUDFeature() {
        let tempNewFeature = this.state.newFeature

        if (this.state.CRUDButtonName === 'CREATE') {
            
            const newFeatureId = this.state.newFeature.name
            tempNewFeature.id = newFeatureId

            await API.graphql(graphqlOperation(createFeature, { input: tempNewFeature }))
            await this.cleanFeatureOnCreate()
        }

        if (this.state.CRUDButtonName === 'UPDATE') {
            delete tempNewFeature.createdAt
            delete tempNewFeature.updatedAt
            delete tempNewFeature.featureType
            delete tempNewFeature.unitOfMeasure
            delete tempNewFeature.productFeatures
            delete tempNewFeature.formulas
            await API.graphql(graphqlOperation(updateFeature, { input: tempNewFeature }))        
            await this.cleanFeatureOnCreate()
        }
    }

    handleLoadEditFeature= async(feature, event) => {

        this.setState({
            newFeature:  feature,
            CRUDButtonName: 'UPDATE',
            isCRUDButtonDisable: false
        })
        this.validateCRUDFeature()
    }

    async cleanFeatureOnCreate() {
         this.setState({
            CRUDButtonName: 'CREATE',
            isCRUDButtonDisable: true,
            newFeature: {   
                id: '',
                name: '',
                description: '',
                order: 0,
                isTemplate: false,
                isAvailable: true,
            }
        })
    }
    
    
        

    render() {
        let {features, newFeature, CRUDButtonName,} = this.state
        
        const renderFeatures = () => {
            if (features.length > 0) {
                return (
                    <>
                    <h2>Features</h2>
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Order</th>
                                <th>Default value</th>
                                <th>Is template</th>
                                <th>Is available</th>
                            </tr>
                            </thead>
                            <tbody>
                            {features.map(features => (
                                <tr key={features.id}>
                                    <td>
                                        {features.name}
                                    </td>
                                    <td>
                                        {features.description}
                                    </td>
                                    <td>
                                        {features.order}
                                    </td>
                                    <td>
                                        {features.defaultValue}
                                    </td>
                                    <td>
                                        {features.isTemplate? 'Si' : 'No'}
                                    </td>
    {/*                                 <td>
                                        {features.isAvailable? 'Si' : 'No'}
                                    </td> */}
                                    <td>
                                        <Button 
                                            variant='primary'
                                            size='lg' 
                                            block
                                            onClick={(e) => this.handleLoadEditFeature(features, e)}
                                        >Editar</Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </>
                )
            }
        
        }

        return (
            <Container>
           {renderFeatures()}
            <br></br>
            <h2>{CRUDButtonName} Feature: {newFeature.name}</h2>
            <Form>
                <Row className='mb-2'>
                    <Form.Group as={Col} controlId='formGridNewFeatureName'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Name...'
                            name='feature.name'
                            value={newFeature.name}
                            onChange={(e) => this.handleOnChangeInputForm(e)} />
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Description...'
                            name='feature.description'
                            value={newFeature.description}
                            onChange={(e) => this.handleOnChangeInputForm(e)} />
                        <Form.Label>Order</Form.Label>
                        <Form.Control
                            type='number'
                            placeholder=''
                            name='feature.order'
                            value={newFeature.order}
                            onChange={(e) => this.handleOnChangeInputForm(e)} />
                        <Form.Label>Default value</Form.Label>
                        <Form.Control
                            type='number'
                            placeholder=''
                            name='feature.defaultValue'
                            value={newFeature.defaultValue}
                            onChange={(e) => this.handleOnChangeInputForm(e)} />
                        <Form.Label>Is template</Form.Label>
                        <Form.Select 
                            name='feature.isTemplate'
                            onChange={(e) => this.handleOnChangeInputForm(e)}>
                          <option value="no">No</option>
                          <option value="yes">Yes</option>
                        </Form.Select>
{/*                         <Form.Label>Is available</Form.Label>
                        <Form.Select 
                            name='feature.isAvailable'
                            onChange={(e) => this.handleOnChangeInputForm(e)}>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </Form.Select> */}
                    </Form.Group>
                </Row>

                <Row className='mb-1'>
                    <Button
                    variant='primary'
                    block
                    onClick={this.handleCRUDFeature}
                    disabled={this.state.isCRUDButtonDisable}
                    >{CRUDButtonName}</Button>
                </Row>
            </Form>

        </Container>
        )
    }
}

export default withAuthenticator(Features, {
    theme: Bootstrap,
    includeGreetings: true,
    signUpConfig: {
        hiddenDefaults: ['phone_number'],
        signUpFields: [
        { label: 'Name', key: 'name', required: true, type: 'string' }
    ]
}})

