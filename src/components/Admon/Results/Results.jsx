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
            equationSelected: '', 
            selectedProductID: '', 
            selectedProductName: '',
            canCalculate: ''
        }
        this.handleOnChangeInputForm = this.handleOnChangeInputForm.bind(this)
        this.checkIfVariablesMatchWithPF = this.checkIfVariablesMatchWithPF.bind(this)
        this.resolveFormula = this.resolveFormula.bind(this)
        this.evil = this.evil.bind(this)
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
            this.setState({selectedProductID: e.target.value, canCalculate: ''})  
            let productSelected = this.state.products.filter(product => product.id === e.target.value)
            this.setState({selectedProductID: e.target.value, selectedProductName: productSelected[0].name })   
        }
        if (e.target.name === 'result.selectedFormula') {
            let formulaSelected = this.state.formulas.filter(formula => formula.id === e.target.value)
            this.setState({selectedFormulaID: e.target.value, equationSelected: formulaSelected[0].equation, canCalculate: '' }) 
            
        }
    }
    checkIfVariablesMatchWithPF = () =>{
        let formulaCopy = this.state.equationSelected //copia formula seleccionada
        let formulaArrayVariables = formulaCopy.replace(/[()]/g, '').split(/[*/+-]/).filter(items => !parseInt(items)) //separa todas las variables y excluye numeros sueltos
        let productFeaturesProductSelected = this.state.products.filter(p => p.id === this.state.selectedProductID) //eligo las productFeatures del producto seleccionado para usar la formula
        let productFeaturesProductSelectedNames = productFeaturesProductSelected[0].productFeatures.items.map(pf => pf.feature.name) //lo convierto en un array con los nombres de las features para comparar con el array de formulaCopyclean
        let aux = 0
        for (let i = 0;i < formulaArrayVariables.length; i++){
            if(productFeaturesProductSelectedNames.includes(formulaArrayVariables[i])) aux = aux + 1
        }
        if(formulaArrayVariables.length === aux) {return(//si las variables de la formula existen como features del producto calculo, sino no hago nada
               this.setState({canCalculate: true})
        )
        }else{
            this.setState({canCalculate: false})
            return(
                console.log(' El producto no contiene todas las variables')
            )
         }
    }

    resolveFormula = () => {
        let formulaCopy = this.state.equationSelected //copia formula seleccionada
        let formulaArrayVariables = formulaCopy.replace(/[()]/g, '').split(/[*/+-]/).filter(items => !parseInt(items)) //separa todas las variables y excluye numeros sueltos
        let productFeaturesProductSelected = this.state.products.filter(p => p.id === this.state.selectedProductID) //eligo las productFeatures del producto seleccionado para usar la formula
        let productFeaturesProductSelectedNames = productFeaturesProductSelected[0].productFeatures.items.map(pf => pf.feature.name) //lo convierto en un array con los nombres de las features para comparar con el array de formulaCopyclean
        let productsFeatures = productFeaturesProductSelected[0].productFeatures.items
        for(let i = 0; i< formulaArrayVariables.length ; i++){
            let aux = formulaArrayVariables[i]
            if(productFeaturesProductSelectedNames.indexOf(aux) !== -1){
                let index = productFeaturesProductSelectedNames.indexOf(aux)
                window[aux] = productsFeatures[index].value
            }
        }
        console.log( this.evil(formulaCopy) );
    }
    evil(fn) {
        console.log('entra a evil')
        return new Function('return ' + fn)();
      }
    render() {
        const SelectProductForm = () => {
            
                return(
                    <Form.Group as={Col} controlId='formGridNewCategoryName'>
                    <Form.Label>Select a product</Form.Label>
                    <Form.Select 
                        name='result.selectedProduct'
                        defaultValue={'-'}
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
                            name='result.selectedFormula'
                            onChange={(e) => this.handleOnChangeInputForm(e)}>
                                <option>-</option>
                                {this.state.formulas.map((formula, idx) => (<option value={formula.id} key={idx}>{formula.equation}</option>))}
                        </Form.Select>
                    </Form.Group>
                )
        }
        const CheckVariablesPF = () => {
            if(this.state.selectedFormulaID !== '' && this.state.selectedProductID !== ''){
                return(
                    <>
                        <div>Check if ProductFeatures of {this.state.selectedProductName} match with the variables on the equation</div>
                        <Button
                            variant='primary'
                            size='sm' 
                            onClick={(e) => this.checkIfVariablesMatchWithPF()}
                        >Check</Button> 
                    </>
                )
            }
        }
        const Calculate = () => {
            if(this.state.canCalculate){
                return(
                    <>
                        <div>The variables exists as Features of this Product. You can calculate </div>
                        <Button
                            variant='primary'
                            size='sm' 
                            onClick={(e) => this.resolveFormula()}
                        >Calculate</Button> 
                    </>
                )
            }
            if(this.state.canCalculate === false){
                return(
                    <>
                        <div>The variables doesn't exists as Features of this Product. Try  another product/formula</div>
                    </>
                ) 
            }
        }
        return (
        <Container>
        <br></br>
        <Form>
                {SelectProductForm()}   
                {SelectFormulaForm()}
                {CheckVariablesPF()}
                {Calculate()}
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
