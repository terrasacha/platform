import React, { Component } from 'react';
// Bootstrap
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
// GraphQL
import { API, graphqlOperation } from 'aws-amplify';
import { v4 as uuidv4 } from 'uuid';
import { listFormulas, listProducts } from '../../../graphql/queries';


export default class Results extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formulas: [],
            products: [],
            selectedFormulaID: '', 
            selectedProductID: '', 

        }
        this.handleOnChangeInputForm = this.handleOnChangeInputForm.bind(this)
    }
    componentDidMount = async () => {
        await this.loadFormulas()
        await this.loadProducts()
    }

    async loadFormulas() {
        const listFormulasResult = await API.graphql(graphqlOperation(listFormulas))
        listFormulasResult.data.listFormulas.items.sort((a, b) => (a.name > b.name) ? 1 : -1)
        this.setState({formulas: listFormulasResult.data.listFormulas.items})
    }
    async loadProducts() {
        const listProductsResult = await API.graphql(graphqlOperation(listProducts))
        listProductsResult.data.listProducts.items.sort((a, b) => (a.order > b.order) ? 1 : -1)
        this.setState({products: listProductsResult.data.listProducts.items})
    }

    handleOnChangeInputForm = async(e) => {
        if (e.target.name === 'result.selectedProduct') {
        this.setState({selectedProductID: e.target.value})   
        }
        
    }

    render() {
        const SelectProductForm = () => {
            
                return(
                    <Form.Group as={Col} controlId='formGridNewCategoryName'>
                    <Form.Label>Select a product</Form.Label>
                    <Form.Select 
                        name='result.selectedProduct'
                        onChange={(e) => this.handleOnChangeInputForm(e)}>
                            <option>-</option>
                            {this.state.products.map((products, idx) => (<option value={products.id} key={idx}>{products.name}</option>))}
                    </Form.Select>
                </Form.Group>
                )
        }
        const SelectFormulaForm = () => {
                return(
                    <Form.Group as={Col} controlId='formGridNewCategoryName'>
                        <Form.Label>Select a formula</Form.Label>
                        <Form.Select 
                            name='result.selectedProduct'
                            onChange={(e) => this.handleOnChangeInputForm(e)}>
                                <option>-</option>
                                {this.state.products.map((products, idx) => (<option value={products.id} key={idx}>{products.name}</option>))}
                        </Form.Select>
                    </Form.Group>
                )
        }
        return (
        <Container>
        <br></br>
        <Form>

                {SelectProductForm()}   
                {SelectFormulaForm()}


{/*             <Row className='mb-1'>
                <Button
                variant='primary'
                 
                onClick={this.handleCRUDFormula}
                disabled={this.state.isCRUDButtonDisable}
                >{CRUDButtonName}</Button>
            </Row> */}
        </Form>

    </Container>
    )
  }
}
