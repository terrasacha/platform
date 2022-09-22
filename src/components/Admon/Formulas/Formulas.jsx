import React, { Component } from 'react';
// Amplify
import { withAuthenticator } from '@aws-amplify/ui-react'
// import '@aws-amplify/ui-react/styles.css'
// Bootstrap
import { Container, Button, Form, Row, Col, Table } from 'react-bootstrap'
// Auth css custom
import Bootstrap from "../../common/themes"
// GraphQL
import { API, graphqlOperation } from 'aws-amplify'
import { listFormulas } from '../../../graphql/queries'
import { createCategory, updateCategory } from '../../../graphql/mutations'
import { onCreateFormula, onUpdateFormula } from '../../../graphql/subscriptions'
import { v4 as uuidv4 } from 'uuid'

class Formulas extends Component {

    constructor(props) {
        super(props)
        this.state = {
            formulas: [],
            CRUDButtonName: 'CREATE',
            isCRUDButtonDisable: true,
            newFormula: {   
                            id: uuidv4().replaceAll('-','_'),
                            varID: '',
                            equation: '',
                            featureID: '',
                            unitOfMeasureID: ''
                        },
        }
        this.handleOnChangeInputForm = this.handleOnChangeInputForm.bind(this)
        this.handleCRUDFormula = this.handleCRUDFormula.bind(this)
        this.handleLoadEditFormula = this.handleLoadEditFormula.bind(this)
    }

    componentDidMount = async () => {
        await this.loadFormulas()

        // Subscriptions
        // OnCreate Formula
        let tempFormulas = this.state.formulas
        this.createFormulaListener = API.graphql(graphqlOperation(onCreateFormula))
        .subscribe({
            next: createdFormulaData => {
                let tempOnCreateFormula = createdFormulaData.value.data.onCreateFormula
                tempFormulas.push(tempOnCreateFormula)
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
                // Ordering categorys by name
                tempFormulas.sort((a, b) => (a.name > b.name) ? 1 : -1)
                this.setState((state) => ({formulas: tempFormulas}))
            }
        })

    }

    async loadFormulas() {
        const listFormulasResult = await API.graphql(graphqlOperation(listFormulas))
        listFormulasResult.data.listFormulas.items.sort((a, b) => (a.name > b.name) ? 1 : -1)
        this.setState({formulas: listFormulasResult.data.listFormulas.items})
    }

    handleOnChangeInputForm = async(event) => {

    }

    async validateCRUDCategory() {
        if (this.state.newFormula.id !== '' ||
            this.state.newFormula.varID !== '' ||
            this.state.newFormula.equation !== '' ||
            this.state.newFormula.featureID !== '') {

            this.setState({isCRUDButtonDisable: false})
        }
    }
    
    async handleCRUDFormula() {
        let tempNewCategory = this.state.newCategory

        if (this.state.CRUDButtonName === 'CREATE') {
            
            const newCategorytId = this.state.newCategory.name
            tempNewCategory.id = newCategorytId

            await API.graphql(graphqlOperation(createCategory, { input: tempNewCategory }))
            await this.cleanCategoryOnCreate()
        }

        if (this.state.CRUDButtonName === 'UPDATE') {
            delete tempNewCategory.products
            delete tempNewCategory.createdAt
            delete tempNewCategory.updatedAt
            await API.graphql(graphqlOperation(updateCategory, { input: this.state.newCategory }))
            await this.cleanCategoryOnCreate()
        }
    }
    

    handleLoadEditFormula= async(category, event) => {

        this.setState({
            newCategory:  category,
            CRUDButtonName: 'UPDATE',
            isCRUDButtonDisable: false
        })
        this.validateCRUDCategory()
    }

    async cleanCategoryOnCreate() {
         this.setState({
            CRUDButtonName: 'CREATE',
            isCRUDButtonDisable: true,
            newCategory: {   id: '',
                            name: ''
                        }
        })
    }
    
    // RENDER
    render() {
        // State Varibles
        let {categorys, newCategory, CRUDButtonName} = this.state

        const renderCategorys = () => {
            if (categorys.length > 0) {
                return (
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {categorys.map(category => (
                            <tr key={category.id}>
                                <td>
                                    {category.name}
                                </td>
                                <td>
                                    <Button 
                                        variant='primary'
                                        size='lg' 
                                         
                                        onClick={(e) => this.handleLoadEditCategory(category, e)}
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
                {renderCategorys()}
                <br></br>
                <Form>
                    <Row className='mb-2'>
                        <Form.Group as={Col} controlId='formGridNewCategoryName'>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Ex. ANIMALS'
                                name='category.name'
                                value={newCategory.name}
                                onChange={(e) => this.handleOnChangeInputForm(e)} />
                        </Form.Group>
                    </Row>

                    <Row className='mb-1'>
                        <Button
                        variant='primary'
                         
                        onClick={this.handleCRUDCategory}
                        disabled={this.state.isCRUDButtonDisable}
                        >{CRUDButtonName}</Button>
                    </Row>
                </Form>

            </Container>
        
        )
    }
}

export default withAuthenticator(Formulas, {
    theme: Bootstrap,
    includeGreetings: true,
    signUpConfig: {
        hiddenDefaults: ['phone_number'],
        signUpFields: [
        { label: 'Name', key: 'name', required: true, type: 'string' }
    ]
}})
