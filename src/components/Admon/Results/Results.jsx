import React, { Component } from 'react';
// Amplify
import { withAuthenticator } from '@aws-amplify/ui-react';
// Auth css custom
import Bootstrap from "../../common/themes";
// Bootstrap
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
// GraphQL
import { API, graphqlOperation } from 'aws-amplify';
import { listFormulas, listProducts } from '../../../graphql/queries';


class Results extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formulas: [],
            products: [],
            varID: '',
            selectedFormulaID: '',
            equationSelected: '', 
            selectedProductID: '', 
            selectedProductName: '',
            featuresUsed: [],
            canCalculate: '',
            result: '',
            confirmSave: false
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
            this.setState({
                canCalculate: '', 
                result: '',
                varID: '',
                featuresUsed: [],
                confirmSave: false
            })  
            let productSelected = this.state.products.filter(product => product.id === e.target.value)
            this.setState({
                selectedProductID: e.target.value, 
                selectedProductName: productSelected[0].name 
            })   
        }
        if (e.target.name === 'result.selectedFormula') {
            let formulaSelected = this.state.formulas.filter(formula => formula.id === e.target.value)
            this.setState({
                selectedFormulaID: e.target.value, 
                equationSelected: formulaSelected[0].equation, 
                canCalculate: '',
                varID: '', 
                result: '',
                featuresUsed: [],
                confirmSave: false,
                saveButton: true
            }) 
            
        }
        if (e.target.name === 'result.varID') {
            this.setState({varID: e.target.value}) 
            
        }
    }
    checkIfVariablesMatchWithPF = () =>{
        let formulaCopy = this.state.equationSelected //copia formula seleccionada
        let formulaArrayVariables = formulaCopy.replace(/[()]/g, '').split(/[*/+-]/).filter(items => !parseInt(items)).filter((v, i, a) => a.indexOf(v) === i) //separa todas las variables y excluye numeros sueltos y variables repetidas
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
        let formulaArrayVariables = formulaCopy.replace(/[()]/g, '').split(/[*/+-]/).filter(items => !parseInt(items)).filter((v, i, a) => a.indexOf(v) === i) //separa todas las variables y excluye numeros sueltos y variables repetidas
        let productFeaturesProductSelected = this.state.products.filter(p => p.id === this.state.selectedProductID) //eligo las productFeatures del producto seleccionado para usar la formula
        let productFeaturesProductSelectedNames = productFeaturesProductSelected[0].productFeatures.items.map(pf => pf.feature.name) //lo convierto en un array con los nombres de las features para comparar con el array de formulaCopyclean
        let productsFeatures = productFeaturesProductSelected[0].productFeatures.items
        let featuresUsed = []
        for(let i = 0; i< formulaArrayVariables.length ; i++){
            let aux = formulaArrayVariables[i]
            if(productFeaturesProductSelectedNames.indexOf(aux) !== -1){
                let index = productFeaturesProductSelectedNames.indexOf(aux)
                window[aux] = productsFeatures[index].value
                featuresUsed.push(productsFeatures[index].feature.id)
            }
        }
        this.setState({result: this.evil(formulaCopy), featuresUsed: featuresUsed})
    }
    evil = (fn) => {
        // eslint-disable-next-line no-new-func
        return new Function('return ' + fn)();
    }
    confirmSave = () => {
        this.setState({confirmSave: true})
    }
    saveResult = async() => {
/*         let tempNewResult = {
            id: uuidv4().replaceAll('-','_'),
            varID: this.state,
            productID: this.state.selectedProductID,
            formulaID: this.state.selectedFormulaID,
            equation: this.state.result,
            varID: this.state.varID
        }
        await API.graphql(graphqlOperation(createResult , { input: tempNewResult }))

        for(let i = 0; i < this.state.featuresUsed ; i++){
            let tempNewFeatureFormula = {
                id: uuidv4().replaceAll('-','_'),
                featureID: this.state.featuresUsed[i],
                formulaID: this.state.selectedFormulaID
            }
            await API.graphql(graphqlOperation(createFeatureFormula , { input: tempNewFeatureFormula }))
        } */
        console.log('se guardo el resultado', this.state.result)
        console.log('se guardo el ID formula', this.state.selectedFormulaID)
        console.log('se guardo el ID product', this.state.selectedProductID)
        console.log('se guardaron estos productFeatures', this.state.featuresUsed)
        console.log('varID ', this.state.varID)
    }
    render() {
        const SelectProductForm = () => {
            
                return(
                    <Form.Group as={Col}>
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
                    <Form.Group as={Col}>
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
                    <div style={{display: 'flex', alignItems: 'center', marginTop: '15px'}} >
                        <h6>Check if ProductFeatures of {this.state.selectedProductName} match with the variables on the equation</h6>
                        <Button
                            variant='primary'
                            size='sm' 
                            onClick={(e) => this.checkIfVariablesMatchWithPF()}
                        >Check</Button> 
                    </div>
                )
            }
        }
        const Calculate = () => {
            if(this.state.canCalculate){
                return(
                    <div style={{display: 'flex', alignItems: 'center', marginTop: '15px'}}>
                        <h6>The variables exists as Features of this Product. You can calculate </h6>
                        <Button
                            variant='primary'
                            size='sm' 
                            onClick={(e) => this.resolveFormula()}
                        >Calculate</Button> 
                    </div>
                )
            }
            if(this.state.canCalculate === false){
                return(
                    <>
                        <h6>The variables doesn't exists as Features of this Product. Try  another product/formula</h6>
                    </>
                ) 
            }
        }
        const Result = () => {
            if(this.state.result !== ''){
                return(
                    <>
                        <h5>The Result is: {this.state.result}</h5>
                        <Button
                            variant='primary'
                            size='sm' 
                            onClick={(e) => this.confirmSave()}
                        >Check Data</Button> 
                    </>
                )
            }
        }
        const SaveResult = () => {
            if(this.state.confirmSave !== false){
                return(
                    <Row className='mb-2'>
                        
                        <Form.Group as={Col}>
                            <Form.Label>Variable ID</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder=''
                                name='result.varID'
                                value={this.state.varID}
                                onChange={(e) => this.handleOnChangeInputForm(e)} />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Result</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder=''
                                name='result.varID'
                                disabled
                                value={this.state.result}
                                />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Formula</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder=''
                                name='result.equation'
                                disabled
                                value={this.state.equationSelected}
                                />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Save</Form.Label>
                            <br></br>
                            <Button
                                    variant='primary'
                                    size='sm' 
                                    disabled={this.state.varID === ''}
                                    onClick={(e) => this.saveResult()}
                                >Save</Button> 
                        </Form.Group>

                    </Row>
                )
            }
        }
        return (
        <Container>
        <br></br>
        <Form>
                {SelectProductForm()}   
                {SelectFormulaForm()}
        </Form>
                {CheckVariablesPF()}
                {Calculate()}
                {Result()}
                {SaveResult()}

    </Container>
    )
  }
}
export default withAuthenticator(Results, {
    theme: Bootstrap,
    includeGreetings: true,
    signUpConfig: {
        hiddenDefaults: ['phone_number'],
        signUpFields: [
        { label: 'Name', key: 'name', required: true, type: 'string' }
    ]
}})
