import React, { Component } from 'react'
// import '@aws-amplify/ui-react/styles.css'
// Bootstrap
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap'
// Auth css custom
import Bootstrap from "../../common/themes"
// GraphQL
import { API, graphqlOperation } from 'aws-amplify'
import { createUnitOfMeasure, updateUnitOfMeasure } from '../../../graphql/mutations'
import { listUnitOfMeasures } from '../../../graphql/queries'
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
                            description: '',
                            isFloat: false,
                        },
        }
        this.handleOnChangeInputForm = this.handleOnChangeInputForm.bind(this)
        this.handleCRUDUnitOfMeasure = this.handleCRUDUnitOfMeasure.bind(this)
        this.handleLoadEditUnitOfMeasure = this.handleLoadEditUnitOfMeasure.bind(this)
    }

    componentDidMount = async () => {
        await this.loadUnitOfMeasures()

        // Subscriptions
        // OnCreate OUM
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

        // OnUpdate OUM
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
    componentWillUnmount() {
        this.createUnitOfMeasureListener.unsubscribe();
        this.updateCategoryListener.unsubscribe();
      }

    async loadUnitOfMeasures() {
        const listUnitOfMeasuresResult = await API.graphql(graphqlOperation(listUnitOfMeasures))
        listUnitOfMeasuresResult.data.listUnitOfMeasures.items.sort((a, b) => (a.name > b.name) ? 1 : -1)
        this.setState({unitOfMeasures: listUnitOfMeasuresResult.data.listUnitOfMeasures.items})
    }

    handleOnChangeInputForm = async(event, pProperty) => {
        let tempNewUnitOfMeasure = this.state.newUnitOfMeasure
        if (event.target.name === 'newUnitOfMeasure.engineeringUnit') {
            tempNewUnitOfMeasure.engineeringUnit = event.target.value
            tempNewUnitOfMeasure.id = event.target.value.replaceAll(' ','_')
        }
        if (event.target.name === 'newUnitOfMeasure.description') {
            tempNewUnitOfMeasure.description = event.target.value
        }
        if (pProperty === 'isFloat') {
            tempNewUnitOfMeasure.isFloat = !tempNewUnitOfMeasure.isFloat
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
            await API.graphql(graphqlOperation(createUnitOfMeasure, { input: tempNewUnitOfMeasure }))
            await this.cleanUnitOfMeasureOnCreate()
        }

        if (this.state.CRUDButtonName === 'UPDATE') {
            delete tempNewUnitOfMeasure.createdAt
            delete tempNewUnitOfMeasure.updatedAt
            delete tempNewUnitOfMeasure.formulas
            delete tempNewUnitOfMeasure.features
            await API.graphql(graphqlOperation(updateUnitOfMeasure, { input: tempNewUnitOfMeasure }))
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
                            description: '',
                            isFloat: false
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
                    <Container>
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th>Engineering unit</th>
                                <th>description</th>
                                <th>Is float</th>
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
                                        {unitOfMeasure.isFloat? 'Yes':'No'}
                                    </td>
                                    <td>
                                        <Button 
                                            variant='primary'
                                            size='sm' 
                                            
                                            onClick={(e) => this.handleLoadEditUnitOfMeasure(unitOfMeasure, e)}
                                        >Editar</Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </Container>
                )
            }
        
        }


        return (
            
            <Container>
                <Container>
                    <h2>Create Unit of Measure</h2>
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
                                <Form.Label>Is Float?</Form.Label>
                                <br></br>
                                            <Button 
                                                variant='primary'
                                                size='sm' 
                                                onClick={(e) => this.handleOnChangeInputForm(e, 'isFloat')}
                                            >{newUnitOfMeasure.isFloat? 'YES' : 'NO'}</Button>
                            </Form.Group>
                        </Row>

                        <Row className='mb-1'>
                            <Button
                            variant='primary'
                            size='sm'
                            onClick={this.handleCRUDUnitOfMeasure}
                            disabled={this.state.isCRUDButtonDisable}
                            >{CRUDButtonName}</Button>
                        </Row>
                    </Form>
                    <br></br>
                </Container>
                {renderunitOfMeasures()}
            </Container>
        
        )
    }
}

export default UOM
