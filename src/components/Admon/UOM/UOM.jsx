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
import { listUnitOfMeasures } from '../../../graphql/queries'
import { createUnitOfMeasure, updateUnitOfMeasure } from '../../../graphql/mutations'
import { onCreateUnitOfMeasure, onUpdateUnitOfMeasure } from '../../../graphql/subscriptions'

class UOM extends Component {

    constructor(props) {
        super(props)
        this.state = {
            unitOfMeasures: [],
            CRUDButtonName: 'CREATE',
            isCRUDButtonDisable: true,
            newUnitOfMeasure: {
                            id: '',
                            engineeringUnit: '',
                            description: ''
                        },
        }
        this.handleOnChangeInputForm = this.handleOnChangeInputForm.bind(this)
        this.handleCRUDUnitOfMeasure = this.handleCRUDUnitOfMeasure.bind(this)
        this.handleLoadEditUnitOfMeasure = this.handleLoadEditUnitOfMeasure.bind(this)
    }

    componentDidMount = async () => {
        await this.loadUnitOfMeasures()

        // Subscriptions
        // OnCreate Category
        let tempUnitOfMeasures = this.state.unitOfMeasures
        this.createUnitOfMeasureListener = API.graphql(graphqlOperation(onCreateUnitOfMeasure))
        .subscribe({
            next: createdUnitOfMeasureData => {
                let tempOnCreateUnitOfMeasure = createdUnitOfMeasureData.value.data.onCreateUnitOfMeasure
                tempUnitOfMeasures.push(tempOnCreateUnitOfMeasure)
                // Ordering categorys by name
                tempUnitOfMeasures.sort((a, b) => (a.name > b.name) ? 1 : -1)
                // this.updateStateCategorys(tempCategorys)
                this.setState((state) => ({unitOfMeasures: tempUnitOfMeasures}))
            }
        })

        // OnUpdate Category
        this.updateCategoryListener = API.graphql(graphqlOperation(onUpdateUnitOfMeasure))
        .subscribe({
            next: updatedUnitOfMeasureData => {
                let tempUnitOfMeasures = this.state.unitOfMeasures.map((mapUnitOfMeasure) => {
                    if (updatedUnitOfMeasureData.value.data.onUpdateUnitOfMeasure.id === mapUnitOfMeasure.id) {
                        return updatedUnitOfMeasureData.value.data.onUpdateUnitOfMeasure
                    } else {
                        return mapUnitOfMeasure
                    }
                })
                // Ordering categorys by name
                tempUnitOfMeasures.sort((a, b) => (a.name > b.name) ? 1 : -1)
                this.setState((state) => ({unitOfMeasures: tempUnitOfMeasures}))
            }
        })

    }

    async loadUnitOfMeasures() {
        const listUnitOfMeasuresResult = await API.graphql(graphqlOperation(listUnitOfMeasures))
        listUnitOfMeasuresResult.data.listUnitOfMeasures.items.sort((a, b) => (a.name > b.name) ? 1 : -1)
        this.setState({unitOfMeasures: listUnitOfMeasuresResult.data.listUnitOfMeasures.items})
    }

    handleOnChangeInputForm = async(event) => {
        let tempNewUnitOfMeasure = this.state.newUnitOfMeasure
        if (event.target.name === 'newUnitOfMeasure.engineeringUnit') {
            tempNewUnitOfMeasure.engineeringUnit = event.target.value.toUpperCase()
/*             tempNewUnitOfMeasure.engineeringUnit = tempNewUnitOfMeasure.name.replace(' ','') */
        }
        if (event.target.name === 'newUnitOfMeasure.description') {
            tempNewUnitOfMeasure.description = event.target.value
        }
        this.setState({newUnitOfMeasure: tempNewUnitOfMeasure})
        this.validateCRUDUnitOfMeasure()
    }

    async validateCRUDUnitOfMeasure() {
        if (this.state.newUnitOfMeasure.name !== '') {
            this.setState({isCRUDButtonDisable: false})
        }
    }
    
    async handleCRUDUnitOfMeasure() {
        let tempNewUnitOfMeasure = this.state.newUnitOfMeasure

        if (this.state.CRUDButtonName === 'CREATE') {
            
            const newUnitOfMeasuretId = this.state.newUnitOfMeasure.name
            tempNewUnitOfMeasure.id = newUnitOfMeasuretId

            await API.graphql(graphqlOperation(createUnitOfMeasure, { input: tempNewUnitOfMeasure }))
            await this.cleanUnitOfMeasureOnCreate()
        }

        if (this.state.CRUDButtonName === 'UPDATE') {
            delete tempNewUnitOfMeasure.createdAt
            delete tempNewUnitOfMeasure.updatedAt
            delete tempNewUnitOfMeasure.formulas
            delete tempNewUnitOfMeasure.features
            await API.graphql(graphqlOperation(updateUnitOfMeasure, { input: this.state.newUnitOfMeasure }))
            await this.cleanUnitOfMeasureOnCreate()
        }
    }
    

    handleLoadEditUnitOfMeasure= async(unitOfMeasures, event) => {

        this.setState({
            newUnitOfMeasure:  unitOfMeasures,
            CRUDButtonName: 'UPDATE',
            isCRUDButtonDisable: false
        })
        this.validateCRUDUnitOfMeasure()
    }

    async cleanUnitOfMeasureOnCreate() {
         this.setState({
            CRUDButtonName: 'CREATE',
            isCRUDButtonDisable: true,
            newUnitOfMeasure: {   
                            id: '',
                            engineeringUnit: '',
                            description: ''
                        }
        })
    }
    
    // RENDER
    render() {
        // State Varibles
        let {unitOfMeasures, newUnitOfMeasure, CRUDButtonName} = this.state

        const renderunitOfMeasures = () => {
            if (unitOfMeasures.length > 0) {
                return (
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>Engineering unit</th>
                            <th>description</th>
                        </tr>
                        </thead>
                        <tbody>
                        {unitOfMeasures.map(unitOfMeasure => (
                            <tr key={unitOfMeasure.id}>
                                <td>
                                    {unitOfMeasure.engineeringUnit}
                                </td>
                                <td>
                                    {unitOfMeasure.description}
                                </td>
                                <td>
                                    <Button 
                                        variant='primary'
                                        size='lg' 
                                         
                                        onClick={(e) => this.handleLoadEditUnitOfMeasure(unitOfMeasure, e)}
                                    >Editar</Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                )
            }
        
        }


        return (
            
            <Container>
                {renderunitOfMeasures()}
                <br></br>
                <Form>
                    <Row className='mb-2'>
                        <Form.Group as={Col} controlId='formGridNewCategoryName'>
                            <Form.Label>Engineering Unit</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder=''
                                name='newUnitOfMeasure.engineeringUnit'
                                value={newUnitOfMeasure.engineeringUnit}
                                onChange={(e) => this.handleOnChangeInputForm(e)} />
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder=''
                                name='newUnitOfMeasure.description'
                                value={newUnitOfMeasure.description}
                                onChange={(e) => this.handleOnChangeInputForm(e)} />
                        </Form.Group>
                    </Row>

                    <Row className='mb-1'>
                        <Button
                        variant='primary'
                         
                        onClick={this.handleCRUDUnitOfMeasure}
                        disabled={this.state.isCRUDButtonDisable}
                        >{CRUDButtonName}</Button>
                    </Row>
                </Form>

            </Container>
        
        )
    }
}

export default withAuthenticator(UOM, {
    theme: Bootstrap,
    includeGreetings: true,
    signUpConfig: {
        hiddenDefaults: ['phone_number'],
        signUpFields: [
        { label: 'Name', key: 'name', required: true, type: 'string' }
    ]
}})
