import React, { Component } from 'react';
// Amplify
import { withAuthenticator } from '@aws-amplify/ui-react';
// Auth css custom
import Bootstrap from "../../common/themes";
// Bootstrap
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
// GraphQL
import { API, graphqlOperation } from 'aws-amplify';
import { v4 as uuidv4 } from 'uuid';
import { createFeatureFormula, createResult, updateProductFeature } from '../../../graphql/mutations';
import { listFormulas, listProductFeatures, listProducts, listResults } from '../../../graphql/queries';
import { onCreateResult, onUpdateProductFeature } from '../../../graphql/subscriptions';


class Results extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formulas: [],
            products: [],
            productFeatures: [],
            results:[],
            varID: '',
            selectedFormulaID: '',
            equationSelected: '', 
            selectedProductID: '', 
            selectedProductName: '',
            featuresUsed: [],
            canCalculate: '',
            result: '',
            PFid: '',
            confirmSave: false,
            assingToPF: false,
        }
        this.handleOnChangeInputForm = this.handleOnChangeInputForm.bind(this)
        this.handleAsignResultToPF = this.handleAsignResultToPF.bind(this)
        this.checkIfVariablesMatchWithPF = this.checkIfVariablesMatchWithPF.bind(this)
        this.resolveFormula = this.resolveFormula.bind(this)
        this.evil = this.evil.bind(this)
    }
    componentDidMount = async () => {
        await this.loadFormulas()
        await this.loadProducts()
        await this.loadProductFeatures()
        await this.loadResults()
        
        // Subscriptions
        // OnCreate Result
        this.createResultListener = API.graphql(graphqlOperation(onCreateResult))
        .subscribe({
            next: createdResultData => {
                let tempResults = this.state.results
                let tempOnCreateResult = createdResultData.value.data.onCreateResult
                tempResults.push(tempOnCreateResult)
                // Ordering products by name
                tempResults.sort((a, b) => (a.id > b.id) ? 1 : -1)
                this.setState((state) => ({results: tempResults}))
            }
        })

        // OnUpdate ProductFeatures
        this.updateProductFeature2Listener = API.graphql(graphqlOperation(onUpdateProductFeature))
            .subscribe({
                next: updatedProductFeatureData => {
                    let tempProductFeatures = this.state.productFeatures.map((mapPF) => {
                        if (updatedProductFeatureData.value.data.onUpdateProductFeature.id === mapPF.id) {
                            return updatedProductFeatureData.value.data.onUpdateProductFeature
                        } else {
                            return mapPF
                        }
                    })
                    tempProductFeatures.sort((a, b) => (a.order > b.order) ? 1 : -1)
                    this.setState((state) => ({productFeatures: tempProductFeatures}))
                }
            })
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
    async loadProductFeatures() {
        const listProductFeaturesResult = await API.graphql(graphqlOperation(listProductFeatures))
        listProductFeaturesResult.data.listProductFeatures.items.sort((a, b) => (a.order > b.order) ? 1 : -1)
        this.setState({productFeatures: listProductFeaturesResult.data.listProductFeatures.items})
    }
    async loadResults() {
        const listResultsResult = await API.graphql(graphqlOperation(listResults))
        listResultsResult.data.listResults.items.sort((a, b) => (a.id > b.id) ? 1 : -1)
        this.setState({results: listResultsResult.data.listResults.items})
    }
    

    handleOnChangeInputForm = async(e) => {
        if (e.target.name === 'result.selectedProduct') {
            this.setState({
                canCalculate: '', 
                result: '',
                varID: '',
                PFid: '',
                featuresUsed: [],
                confirmSave: false,
                assingToPF: false,
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
                PFid: '',
                featuresUsed: [],
                confirmSave: false,
                assingToPF: false,
                saveButton: true
            }) 
            
        }
        if (e.target.name === 'result.varID') {
            this.setState({varID: e.target.value}) 
            
        }
        if (e.target.name === 'result.selectedProductFeature') {
            this.setState({PFid: e.target.value}) 
            
        }
    }
    handleAsignResultToPF = async(e, result) =>{
        let updatePF = {
            id: e.target.value,
            value: result
        }
        await API.graphql(graphqlOperation(updateProductFeature , { input: updatePF }))
    }
    checkIfVariablesMatchWithPF = () =>{
        let formulaCopy = this.state.equationSelected //copia formula seleccionada
        let formulaArrayVariables = formulaCopy.replace(/[()]/g, '').split(/[*/+-]/).filter(items => !parseInt(items)).filter((v, i, a) => a.indexOf(v) === i) //separa todas las variables y excluye numeros sueltos y variables repetidas
        let productFeaturesProductSelected = this.state.products.filter(p => p.id === this.state.selectedProductID) //eligo las productFeatures del producto seleccionado para usar la formula
        let productFeaturesProductSelectedNames = productFeaturesProductSelected[0].productFeatures.items.map(pf => pf.feature.id) //lo convierto en un array con los nombres de las features para comparar con el array de formulaCopyclean
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
        let productFeaturesProductSelectedNames = productFeaturesProductSelected[0].productFeatures.items.map(pf => pf.feature.id) //lo convierto en un array con los nombres de las features para comparar con el array de formulaCopyclean
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
        let resultNumberType = this.state.formulas.filter(f => f.equation === this.state.equationSelected)
        if(resultNumberType[0].unitOfMeasure.isFloat){
            this.setState({result: this.evil(formulaCopy), featuresUsed: featuresUsed})
        }else{
            this.setState({result: parseInt(this.evil(formulaCopy)), featuresUsed: featuresUsed})
        }
    }
    evil = (fn) => {
        // eslint-disable-next-line no-new-func
        return new Function('return ' + fn)();
    }
    confirmSave = () => {
        this.setState({confirmSave: true})
    }
    assingToPF = () => {
        this.setState({assingToPF: true})
    }
    saveResult = async() => {
        let tempNewResult = {
            id: uuidv4().replaceAll('-','_'),
            productID: this.state.selectedProductID,
            formulaID: this.state.selectedFormulaID,
            value: this.state.result,
            varID: this.state.varID
        }
        await API.graphql(graphqlOperation(createResult , { input: tempNewResult }))
        
        this.state.featuresUsed.map(async(FU) =>{
            let tempNewFeatureFormula = {
                id: uuidv4().replaceAll('-','_'),
                featureID: FU,
                formulaID: this.state.selectedFormulaID
            }
            return await API.graphql(graphqlOperation(createFeatureFormula , { input: tempNewFeatureFormula }))
        })
        if(this.state.PFid !== ''){
            let updatePF = {
                id: this.state.PFid,
                value: this.state.result
            }
            await API.graphql(graphqlOperation(updateProductFeature , { input: updatePF }))
        }
        this.clearState()
    }
    clearState = () => {
        this.setState({
            varID: '',
            selectedFormulaID: '',
            equationSelected: '', 
            selectedProductID: '', 
            selectedProductName: '',
            featuresUsed: [],
            canCalculate: '',
            result: '',
            PFid: '',
            confirmSave: false,
            assingToPF: false,
        })
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
                    <>
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
                    </Row>
                    <div style={{display: 'flex', alignItems: 'center', marginTop: '15px'}} >
                        <h6>Do you want to associate result {this.state.varID} with a productFeature? </h6>
                        <Button
                            variant='primary'
                            size='sm'
                            style={{marginLeft: '10px',marginRight: '10px'}} 
                            onClick={(e) => this.assingToPF()}
                        >Yes</Button> 
                        <Button
                            variant='primary'
                            size='sm' 
                            onClick={(e) => this.saveResult()}
                        >No</Button> 
                    </div>
                    </>
                )
            }
        }
        const AsingToProductFeature = () => {
            if(this.state.assingToPF){
                let productFeatures = this.state.productFeatures.filter(pf => pf.productID === this.state.selectedProductID)
                return(
                    <Row className='mb-2'>
                        <Form.Group as={Col}>
                            <Form.Label>Variable ID</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder=''
                                name='result.varID'
                                disabled
                                value={this.state.varID}
                                />
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
                            <Form.Label>Product Features</Form.Label>
                            <Form.Select 
                            name='result.selectedProductFeature'
                            onChange={(e) => this.handleOnChangeInputForm(e)}>
                                <option>-</option>
                                {productFeatures.map((pf, idx) => (<option value={pf.id} key={idx}>{pf.feature.id}</option>))}
                        </Form.Select>
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
        const renderResults = () => {
            if (this.state.results.length > 0) {
                let resultsCopy = this.state.results
                let productFeaturesCopy = this.state.productFeatures
                for (let i = 0; i < resultsCopy.length; i++) {
                    for (let j = 0; j < productFeaturesCopy.length; j++){
                        if(resultsCopy[i].value == productFeaturesCopy[j].value 
                            && resultsCopy[i].productID === productFeaturesCopy[j].productID){
                            resultsCopy[i].productFeature = productFeaturesCopy[j]
                        }
                    }
                }
                    return (
                        <>
                            <h1>Results list</h1>
                            <Table striped bordered hover>
                                <thead>
                                <tr>
                                    <th>Var ID</th>
                                    <th>Value</th>
                                    <th>Formula</th>
                                    <th>Product</th>
                                    <th>Asing to</th>
                                </tr>
                                </thead>
                                <tbody>
                                {resultsCopy.map(results =>{ 
                                    let productsFeaturesProductID = this.state.productFeatures.filter(pf => pf.productID === results.productID)
                                    return(
                                        <tr key={results.id}>
                                            <td>
                                                {results.varID} 
                                            </td>
                                            <td>
                                                {results.value} 
                                            </td>
                                            <td>
                                                {results.formula.equation}
                                            </td>
                                            <td>
                                                {results.product.name}
                                            </td>
                                            <td>
                                                {results.productFeature? results.productFeature.feature.id :
                                                <>
                                                    <Form.Label>Select to asing</Form.Label>
                                                    <Form.Select 
                                                    name=''
                                                    onChange={(e) => this.handleAsignResultToPF(e, results.value)}>
                                                        <option>-</option>
                                                        {productsFeaturesProductID.map((pf, idx) => (<option value={pf.id} key={idx}>{pf.feature.id}</option>))}
                                                    </Form.Select>
                                                </>}
                                            </td>
                                        </tr>
                                    )})}
                                </tbody>
                            </Table>
                        </>
            )
        }
    
    }
        return (
        
        <Container style={{display: 'flex'}}>
            <Container>
                <h2>Calculate Result</h2>            
                <Form>
                        {SelectProductForm()}   
                        {SelectFormulaForm()}
                </Form>
                        {CheckVariablesPF()}
                        {Calculate()}
                        {Result()}
                        {SaveResult()}
                        {AsingToProductFeature()}
            </Container>
            <Container>
                {renderResults()}
            </Container>
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
