import React, { Component } from 'react'
// Amplify
// import '@aws-amplify/ui-react/styles.css'
// Bootstrap
import  Button  from '../../ui/Button';
import  Col  from '../../ui/Col';
import  Container  from '../../ui/Container';
import  Form  from '../../ui/Form';
import  Row  from '../../ui/Row';
import  Table  from '../../ui/Table';
// GraphQL
import { API, graphqlOperation } from 'aws-amplify'
import { createCategory, updateCategory } from '../../../graphql/mutations'
import { listCategories } from '../../../graphql/queries'
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
        this.createCategoryListener = API.graphql(graphqlOperation(onCreateCategory))
        .subscribe({
            next: async (createdCategoryData) => {
                await this.loadCategorys() 
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
    componentWillUnmount() {
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
            if(this.state.CRUDButtonName !== 'UPDATE'){
                tempNewCategory.id = tempNewCategory.name.replaceAll(' ','_')
            }
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
            let tempNewCategory = {
                id: this.state.newCategory.id,
                name: this.state.newCategory.name
            }
            await API.graphql(graphqlOperation(updateCategory, { input: tempNewCategory }))
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
                    <Container> 
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {categorys.map(category => (
                                <tr key={category.id}>
                                    <td>
                                        {category.id}
                                    </td>
                                    <td>
                                        {category.name}
                                    </td>
                                    <td>
                                        <Button 
                                            variant='primary'
                                            size='sm' 
                                            onClick={(e) => this.handleLoadEditCategory(category, e)}
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
                    <h2>{CRUDButtonName} Categoría: {newCategory.name}</h2>
                    <Form>
                        <Row className='mb-2'>
                            <Form.Group as={Col} controlId='formGridNewCategoryName'>
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Ex. NUEVA CATERORIA'
                                    name='category.name'
                                    value={newCategory.name}
                                    onChange={(e) => this.handleOnChangeInputForm(e)} />
                            </Form.Group>
                        </Row>

                        <Row className='mb-1'>
                            <Button
                            variant='primary'
                            size='sm'
                            onClick={this.handleCRUDCategory}
                            disabled={this.state.isCRUDButtonDisable}
                            >{CRUDButtonName}</Button>
                        </Row>
                    </Form>
                </Container>
                <br></br>
                {renderCategorys()}
            </Container>
        
        )
    }
}

export default Categorys