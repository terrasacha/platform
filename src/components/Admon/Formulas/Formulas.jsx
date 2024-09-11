import React, { Component } from 'react';

// import '@aws-amplify/ui-react/styles.css'
// Bootstrap
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
// Auth css custom
import Bootstrap from "../../common/themes";
// GraphQL
import { API, graphqlOperation } from 'aws-amplify';
import { v4 as uuidv4 } from 'uuid';
import { createFormula, updateFormula } from '../../../graphql/mutations';
import { listFeatures, listFormulas, listUnitOfMeasures } from '../../../graphql/queries';
import { onCreateFormula, onUpdateFormula } from '../../../graphql/subscriptions';

class Formulas extends Component {

    constructor(props) {
        super(props)
        this.state = {
            formulas: [],
            features:[],
            unitOfMeasures: [],
            CRUDButtonName: 'CREATE',
            isCRUDButtonDisable: true,
            newFormula: {   
                            id: uuidv4().replaceAll('-','_'),
                            varID: '',
                            equation: '',
                            unitOfMeasureID: ''
                        },
        }
        this.handleOnChangeInputForm = this.handleOnChangeInputForm.bind(this)
        this.handleCRUDFormula = this.handleCRUDFormula.bind(this)
        this.handleLoadEditFormula = this.handleLoadEditFormula.bind(this)
    }

    componentDidMount = async () => {
        await this.loadFormulas()
        await this.loadFeatures()
        await this.loadUnitOfMeasures()
        // Subscriptions
        // OnCreate Formula
        this.createFormulaListener = API.graphql(graphqlOperation(onCreateFormula))
        .subscribe({
            next: createdFormulaData => {
                let isOnCreateList = false;
                this.state.formulas.map((mapFormulas) => {
                    if (createdFormulaData.value.data.onCreateFormula.id === mapFormulas.id) {
                        isOnCreateList = true;
                    } 
                    return mapFormulas
                })
                let tempFormulas = this.state.formulas
                let tempOnCreateFormula = createdFormulaData.value.data.onCreateFormula
                if (!isOnCreateList) {
                    tempFormulas.push(tempOnCreateFormula)
                }
                // Ordering categorys by name
                tempFormulas.sort((a, b) => (a.name > b.name) ? 1 : -1)
                // this.updateStateCategorys(tempCategorys)
                this.setState((state) => ({formulas: tempFormulas}))
            }
        })

        // OnUpdate Formula
        this.updateFormulaListener = API.graphql(graphqlOperation(onUpdateFormula))
        .subscribe({
            next: updatedFormulaData => {
                let tempFormulas = this.state.formulas.map((mapFormula) => {
                    if (updatedFormulaData.value.data.onUpdateFormula.id === mapFormula.id) {
                        return updatedFormulaData.value.data.onUpdateFormula
                    } else {
                        return mapFormula
                    }
                })
                // Ordering formulas by varID
                tempFormulas.sort((a, b) => (a.varID > b.varID) ? 1 : -1)
                this.setState((state) => ({formulas: tempFormulas}))
            }
        })

    }
    async loadFormulas() {
        const listFormulasResult = await API.graphql(graphqlOperation(listFormulas))
        listFormulasResult.data.listFormulas.items.sort((a, b) => (a.name > b.name) ? 1 : -1)
        this.setState({formulas: listFormulasResult.data.listFormulas.items})
    }
    async loadFeatures() {
        const listFeaturesResult = await API.graphql(graphqlOperation(listFeatures))
        listFeaturesResult.data.listFeatures.items.sort((a, b) => (a.name > b.name) ? 1 : -1)
        this.setState({features: listFeaturesResult.data.listFeatures.items})
        }
    async loadUnitOfMeasures() {
        const listUnitOfMeasuresResult = await API.graphql(graphqlOperation(listUnitOfMeasures))
        /* listUnitOfMeasuresResult.data.listUnitOfMeasures.items.sort((a, b) => (a.name > b.name) ? 1 : -1) */
        this.setState({unitOfMeasures: listUnitOfMeasuresResult.data.listUnitOfMeasures.items})
        }


    handleOnChangeInputForm = async(event) => {
        let tempNewFormula = this.state.newFormula
        if (event.target.name === 'formula.varID') {
            tempNewFormula.varID = event.target.value
        }
        if (event.target.name === 'formula.equation') {
            tempNewFormula.equation = event.target.value
        }
        if (event.target.name === 'formula.unitOfMeasure') {
            tempNewFormula.unitOfMeasureID = event.target.value
        }
        
        this.setState({newFormula: tempNewFormula})
        this.validateCRUDFormula()
        
    }

    async validateCRUDFormula() {
        if (this.state.newFormula.id !== '' &&
            this.state.newFormula.varID !== '' &&
            this.state.newFormula.equation !== '') {

            this.setState({isCRUDButtonDisable: false})
        }
    }
    
    async handleCRUDFormula() {
        let tempNewFormula = this.state.newFormula

        if (this.state.CRUDButtonName === 'CREATE') {
            
            await API.graphql(graphqlOperation(createFormula, { input: tempNewFormula }))
            await this.cleanFormulaOnCreate()
        }

        if (this.state.CRUDButtonName === 'UPDATE') {
            delete tempNewFormula.createdAt
            delete tempNewFormula.updatedAt
            delete tempNewFormula.results
            delete tempNewFormula.unitOfMeasure
            delete tempNewFormula.feature
            delete tempNewFormula.featureFormulas
            await API.graphql(graphqlOperation(updateFormula, { input: this.state.newFormula }))
            await this.cleanFormulaOnCreate()
        }
    }
    

    handleLoadEditFormula= async(formula, event) => {

        this.setState({
            newFormula:  formula,
            CRUDButtonName: 'UPDATE',
            isCRUDButtonDisable: false
        })
        this.validateCRUDFormula()
    }

    async cleanFormulaOnCreate() {
         this.setState({
            CRUDButtonName: 'CREATE',
            isCRUDButtonDisable: true,
            newFormula: {   
                id: uuidv4().replaceAll('-','_'),
                varID: '',
                equation: '',
                featureID: '',
                unitOfMeasureID: ''
            },
        })
    }
    
    // RENDER
    render() {
        // State Varibles
        let {formulas, newFormula, CRUDButtonName} = this.state

        const renderFormulas = () => {
            if (formulas.length > 0) {
                return (
                    <Container>
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th>Variable ID</th>
                                <th>Equation</th>
                                <th>Unit of Measure ID</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {formulas.map(formula => (
                                <tr key={formula.id}>

                                    <td>
                                        {formula.varID}
                                    </td>
                                    <td>
                                        {formula.equation}
                                    </td>
                                    <td>
                                        {formula.unitOfMeasure !== undefined? formula.unitOfMeasure.engineeringUnit : ''}
                                    </td>
                                    <td>
                                        <Button 
                                            variant='primary'
                                            size='sm'
                                            onClick={(e) => this.handleLoadEditFormula(formula, e)}
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
            <Container style={{display: 'flex', flexDirection: 'column'}}>
                <Container>
                    <h2>{CRUDButtonName} Formula: {newFormula.name}</h2>
                    <Form>
                        <Row className='mb-2'>
                            <Form.Group as={Col} controlId='formGridNewCategoryName'>
                                <Form.Label>Variable ID</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder=''
                                    name='formula.varID'
                                    value={newFormula.varID}
                                    onChange={(e) => this.handleOnChangeInputForm(e)} />
                            </Form.Group>
                            <Form.Group as={Col} controlId='formGridNewCategoryName'>
                                <Form.Label>Equation</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Ex. ANIMALS'
                                    name='formula.equation'
                                    value={newFormula.equation}
                                    onChange={(e) => this.handleOnChangeInputForm(e)} />
                            </Form.Group>
                            <Form.Group as={Col} controlId='formGridNewCategoryName'>
                                <Form.Label>Unit of Measure</Form.Label>
                                <Form.Select 
                                    name='formula.unitOfMeasure'
                                    onChange={(e) => this.handleOnChangeInputForm(e)}>
                                        <option>-</option>
                                        {this.state.unitOfMeasures.map((uom, idx) => (<option value={uom.id} key={idx}>{uom.engineeringUnit}</option>))}
                                </Form.Select>
                            </Form.Group>
                        </Row>

                        <Row className='mb-1'>
                            <Button
                            variant='primary'
                            size='sm'
                            onClick={this.handleCRUDFormula}
                            disabled={this.state.isCRUDButtonDisable}
                            >{CRUDButtonName}</Button>
                        </Row>
                    </Form>
                </Container>
                <br></br>
                {renderFormulas()}
            </Container>
        
        )
    }
}

export default Formulas