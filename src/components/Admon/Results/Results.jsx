import React, { Component } from 'react';
// Auth css custom
import Bootstrap from "../../common/themes";
// Bootstrap
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
// GraphQL
import { API, graphqlOperation } from 'aws-amplify';
import { v4 as uuidv4 } from 'uuid';
import { createFeatureFormula, createProductFeatureResult, createResult, updateProductFeature, updateProductFeatureResult } from '../../../graphql/mutations';
import { listFormulas, listProductFeatureResults, listProductFeatures, listProducts, listResults } from '../../../graphql/queries';
import { onCreateProductFeatureResult, onCreateResult, onUpdateProductFeature, onUpdateProductFeatureResult } from '../../../graphql/subscriptions';


class Results extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formulas: [],
            products: [],
            productFeatures: [],
            productFeatureResults: [],
            results:[],
            varID: '',
            selectedFormulaID: '',
            equationSelected: '', 
            selectedProductID: '', 
            selectedProductName: '',
            filterByProduct: '',
            filterByProductFeature: '',
            featuresUsed: [],
            canCalculate: '',
            result: '',
            PFid: '',
            confirmSave: false,
        }
        this.handleOnChangeInputForm = this.handleOnChangeInputForm.bind(this)
        this.handleChangeFilter = this.handleChangeFilter.bind(this)
        this.handleAsignResultToPF = this.handleAsignResultToPF.bind(this)
        this.checkIfVariablesMatchWithPF = this.checkIfVariablesMatchWithPF.bind(this)
        this.handleActiveResult = this.handleActiveResult.bind(this)
        this.resolveFormula = this.resolveFormula.bind(this)
        this.evil = this.evil.bind(this)
    }
    componentDidMount = async () => {
        Promise.all([
            this.loadProductFeaturesResults(),
            this.loadResults(),
            this.loadFormulas(),
            this.loadProducts(),
            this.loadProductFeatures()
        ])
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
        // OnCreate ProductFeatureResult
        this.createResultListener = API.graphql(graphqlOperation(onCreateProductFeatureResult))
        .subscribe({
            next: createdResultData => {
                let isOnCreateList = false;
                this.state.productFeatureResults.map((mapPFR) => {
                    if (createdResultData.value.data.onCreateProductFeatureResult.id === mapPFR.id) {
                        isOnCreateList = true;
                    } 
                    return mapPFR
                })
                let tempProductFeatureResults = this.state.productFeatureResults
                let tempOnCreateProductFeatureResult = createdResultData.value.data.onCreateProductFeatureResult
                if (!isOnCreateList) {
                    tempProductFeatureResults.push(tempOnCreateProductFeatureResult)
                }
                // Ordering products by id
                tempProductFeatureResults.sort((a, b) => (a.id > b.id) ? 1 : -1)
                this.setState((state) => ({productFeatureResults: tempProductFeatureResults}))
            }
        })
        // OnUpdate ProductFeatureResult
        this.updateProductFeatureResultListener = API.graphql(graphqlOperation(onUpdateProductFeatureResult))
            .subscribe({
                next: updatedProductFeatureResultData => {
                    let tempProductFeatureResults = this.state.productFeatureResults.map((mapPFR) => {
                        if (updatedProductFeatureResultData.value.data.onUpdateProductFeatureResult.id === mapPFR.id) {
                            return updatedProductFeatureResultData.value.data.onUpdateProductFeatureResult
                        } else {
                            return mapPFR
                        }
                    })
                    tempProductFeatureResults.sort((a, b) => (a.productFeatureID > b.productFeatureID) ? 1 : -1)
                    this.setState((state) => ({productFeatureResults: tempProductFeatureResults}))
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
    async loadProductFeaturesResults() {
        const listProductFeatureResultsResult = await API.graphql(graphqlOperation(listProductFeatureResults))
        listProductFeatureResultsResult.data.listProductFeatureResults.items.sort((a, b) => (a.productFeatureID > b.productFeatureID) ? 1 : -1)
        this.setState({productFeatureResults: listProductFeatureResultsResult.data.listProductFeatureResults.items})
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
    handleChangeFilter = async(e) => {
        if (e.target.name === 'filterProducts') {
            if(e.target.value !== ''){
                let copyProducts = this.state.products.filter(p => p.id === e.target.value)
                copyProducts = copyProducts[0]
                this.setState({filterByProduct: copyProducts,productFeaturesFiltered: copyProducts.productFeatures.items })       
            }else{
                this.setState({filterByProduct: '', filterByProductFeature: ''})    
            }
            
        }
        if (e.target.name === 'filterProductFeature') {
            this.setState({filterByProductFeature: e.target.value})    

            
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
        for(let i = 0; i < productsFeatures.length; i++){
            if(productsFeatures[i].productFeatureResults?.items.length > 0){
                let filteredIsActivePFR = productsFeatures[i].productFeatureResults.items.filter(pfr => pfr.isActive === true)
                productsFeatures[i].productFeatureResults.items = filteredIsActivePFR
            }
        }
        productsFeatures.map(pf => {
            if(pf.productFeatureResults.items[0]){
                pf.value = parseInt(pf.productFeatureResults.items[0].result.value)
            }
            return pf
        })
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
    saveResult = async() => {
        let tempNewResult = {
            id: uuidv4().replaceAll('-','_'),
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
            let newProductFeatureResult = {
                id: uuidv4().replaceAll('-','_'),
                isActive: false,
                productFeatureID: this.state.PFid,
                resultID: tempNewResult.id 
            }
            await API.graphql(graphqlOperation(createProductFeatureResult , { input: newProductFeatureResult }))
        }
        this.clearState()
    }

    handleActiveResult = async(PFid, PFRid) => {    //Aquí actualizo la propiedad de "isActive" de la productFeatureResult seleccionada y desactivo todas las otras
        let productFeaturesFiltered = this.state.productFeatures.filter(pf => pf.id === PFid)
        let promiseArray = []
        for(let i = 0; i < productFeaturesFiltered[0].productFeatureResults.items.length ; i++){
            if(productFeaturesFiltered[0].productFeatureResults.items[i].id === PFRid){
                if(productFeaturesFiltered[0].productFeatureResults.items[i].isActive === true){
                    promiseArray.push(API.graphql(graphqlOperation(updateProductFeatureResult , { input: {id:productFeaturesFiltered[0].productFeatureResults.items[i].id, isActive: false} })))
                }else{
                    promiseArray.push(API.graphql(graphqlOperation(updateProductFeatureResult , { input: {id:productFeaturesFiltered[0].productFeatureResults.items[i].id, isActive: true} })))
                }
            }else{
                promiseArray.push(API.graphql(graphqlOperation(updateProductFeatureResult , { input: {id:productFeaturesFiltered[0].productFeatureResults.items[i].id, isActive: false} })))
            }
        }
        Promise.all(promiseArray)
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
                                {this.state.formulas.map((formula, idx) => (<option value={formula.id} key={idx}>{formula.varID}: {formula.equation}</option>))}
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
                let productFeatures = this.state.productFeatures.filter(pf => pf.productID === this.state.selectedProductID)
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
                        <Form.Group as={Col}>
                            <Form.Label>Product Features</Form.Label>
                            <Form.Select 
                            name='result.selectedProductFeature'
                            onChange={(e) => this.handleOnChangeInputForm(e)}>
                                <option>-</option>
                                {productFeatures.map((pf, idx) => (<option value={pf.id} key={idx}>{pf.feature.id}</option>))}
                        </Form.Select>
                        </Form.Group>
                    </Row>
                    <Button
                        variant='primary'
                        size='sm' 
                        disabled={this.state.varID === ''}
                        onClick={(e) => this.saveResult()}
                        >Save</Button>
                    </>
                )
            }
        }
        const renderResults = () => {
            if (this.state.results.length > 0) {
                    return (
                        <>
                            <h1>Results list</h1>
                            <Table striped bordered hover>
                                <thead>
                                <tr>
                                    <th>Var ID</th>
                                    <th>Value</th>
                                    <th>Formula</th>
                                    <th>Created At</th>

                                </tr>
                                </thead>
                                <tbody>
                                {this.state.results.map(results =>{ 
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
                                                {results.createdAt.substring(0,10)}
                                            </td>
                                        </tr>
                                    )})}
                                </tbody>
                            </Table>
                        </>
                )
            }
        }
        const renderProductFeaturesResults = () => {
            let copyProductFeatureResults = this.state.productFeatureResults
            let copyFilterByProduct = this.state.filterByProduct
            let copyFilterByProductFeature = this.state.filterByProductFeature
            if(copyFilterByProduct !== ''){
                copyProductFeatureResults = copyProductFeatureResults.filter(pfr => pfr.productFeature.productID === copyFilterByProduct.id)
                if(copyFilterByProductFeature !== ''){
                    copyProductFeatureResults = copyProductFeatureResults.filter(pfr => pfr.productFeatureID === copyFilterByProductFeature)
                }
            }
                    return (
                        <>
                            <h1>PF who has a result assign</h1>
                            <Row className='mb-4'>
                                <Form.Group as={Col}>
                                <Form.Label>Filter by Product</Form.Label>
                                <Form.Select 
                                name='filterProducts'
                                onChange={(e) => this.handleChangeFilter(e)}>
                                    <option value=''>-</option>
                                    {this.state.products.map((product, idx) => (<option value={product.id} key={idx}>{product.name}</option>))}
                                </Form.Select>
                                </Form.Group>
                            </Row>
                            {this.state.filterByProduct !== ''?
                                <Row className='mb-4'>
                                    <Form.Group as={Col}>
                                    <Form.Label>Filter by Feature</Form.Label>
                                    <Form.Select 
                                    name='filterProductFeature'
                                    onChange={(e) => this.handleChangeFilter(e)}>
                                        <option value=''>-</option>
                                        {this.state.filterByProduct.productFeatures.items.map((pf, idx) => (<option value={pf.id} key={idx}>{pf.feature.name}</option>))}
                                    </Form.Select>
                                    </Form.Group>
                                </Row> : ''
                            }
                            <Table striped bordered hover>
                                <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Feature</th>
                                    <th>Result Assigned</th>
                                    <th>Formula</th>
                                    <th>Active</th>


                                </tr>
                                </thead>
                                <tbody>
                                    {copyProductFeatureResults?.map(PFR =>{ 
                                        return(
                                            <tr key={PFR.id}>
                                                <td>
                                                    {PFR.productFeature.product.name} 
                                                </td>
                                                <td>
                                                    {PFR.productFeature.feature.name} 
                                                </td>
                                                <td>
                                                    {PFR.result.value} 
                                                </td>
                                                <td>
                                                    {PFR.result.formula.equation} 
                                                </td>
                                                <td>
                                                <Button
                                                    variant={PFR.isActive?'secondary' : 'success'}
                                                    size='sm' 
                                                    onClick={(e) => this.handleActiveResult(PFR.productFeatureID, PFR.id)}>
                                                {PFR.isActive? 'Assigned': 'Assign'}
                                                </Button> 
                                                </td>
                                            </tr>
                                        )})}
                                </tbody>
                            </Table>
                        </>
                )
            }
        return (
        <Container>
            <Container style={{display: 'flex', height: '580px'}}>
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
                </Container>
                <Container style={{overflow: 'auto'}}>
                    {renderProductFeaturesResults()}
                </Container>
            </Container>
            <Container>
                {renderResults()}
            </Container>
        </Container>
    )
  }
}
export default Results