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
import { listCategories } from '../../../graphql/queries'
import { createCategory, updateCategory } from '../../../graphql/mutations'
import { onCreateCategory, onUpdateCategory } from '../../../graphql/subscriptions'

class Categorys extends Component {

    constructor(props) {
        super(props)
        this.state = {
            categorys: [],
            CRUDButtonName: 'CREATE',
            isCRUDButtonDisable: true,
            newCategory: {   id: '',
                            name: ''
                        },
        }
        this.handleOnChangeInputForm = this.handleOnChangeInputForm.bind(this)
        this.handleCRUDCategory = this.handleCRUDCategory.bind(this)
        this.handleLoadEditCategory = this.handleLoadEditCategory.bind(this)
    }

    componentDidMount = async () => {
        await this.loadCategorys()

        // Subscriptions
        // OnCreate Category
        let tempCategorys = this.state.categorys
        this.createCategoryListener = API.graphql(graphqlOperation(onCreateCategory))
        .subscribe({
            next: createdCategoryData => {
                let tempOnCreateCategory = createdCategoryData.value.data.onCreateCategory
                tempCategorys.push(tempOnCreateCategory)
                // Ordering categorys by name
                tempCategorys.sort((a, b) => (a.name > b.name) ? 1 : -1)
                // this.updateStateCategorys(tempCategorys)
                this.setState((state) => ({categorys: tempCategorys}))
            }
        })

        // OnUpdate Category
        this.updateCategoryListener = API.graphql(graphqlOperation(onUpdateCategory))
        .subscribe({
            next: updatedCategoryData => {
                let tempCategorys = this.state.categorys.map((mapCategory) => {
                    if (updatedCategoryData.value.data.onUpdateCategory.id === mapCategory.id) {
                        return updatedCategoryData.value.data.onUpdateCategory
                    } else {
                        return mapCategory
                    }
                })
                // Ordering categorys by name
                tempCategorys.sort((a, b) => (a.name > b.name) ? 1 : -1)
                this.setState((state) => ({categorys: tempCategorys}))
            }
        })

    }

    async loadCategorys() {
        const listCategoriesResult = await API.graphql(graphqlOperation(listCategories))
        listCategoriesResult.data.listCategories.items.sort((a, b) => (a.name > b.name) ? 1 : -1)
        this.setState({categorys: listCategoriesResult.data.listCategories.items})
    }

    handleOnChangeInputForm = async(event) => {
        let tempNewCategory = this.state.newCategory
        if (event.target.name === 'category.name') {
            tempNewCategory.name = event.target.value.toUpperCase()
            tempNewCategory.id = tempNewCategory.name.replaceAll(' ','_')
        }
        this.setState({newCategory: tempNewCategory})
        this.validateCRUDCategory()
    }

    async validateCRUDCategory() {
        if (this.state.newCategory.name !== '') {
            this.setState({isCRUDButtonDisable: false})
        }
    }
    
    async handleCRUDCategory() {
        let tempNewCategory = this.state.newCategory

        if (this.state.CRUDButtonName === 'CREATE') {
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
    

    handleLoadEditCategory= async(category, event) => {

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

export default withAuthenticator(Categorys, {
    theme: Bootstrap,
    includeGreetings: true,
    signUpConfig: {
        hiddenDefaults: ['phone_number'],
        signUpFields: [
        { label: 'Name', key: 'name', required: true, type: 'string' }
    ]
}})
