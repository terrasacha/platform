import React, { Component } from 'react';
// Bootstrap reemplazado con Tailwind CSS y sistema Terrasacha
// Componentes Terrasacha
import TerrasachaTable, { TerrasachaTableCell, TerrasachaBadge } from "../../common/TerrasachaTable";   
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
    componentWillUnmount() {
        this.createResultListener.unsubscribe();
        this.updateProductFeature2Listener.unsubscribe();
        this.createResultListener.unsubscribe();
        this.updateProductFeatureResultListener.unsubscribe();
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
                <div className="space-y-2">
                    <label className="form-terrasacha-label">
                        🏭 Seleccionar un Producto
                    </label>
                    <select
                        name="result.selectedProduct"
                        defaultValue=""
                        className="form-terrasacha-select"
                        onChange={(e) => this.handleOnChangeInputForm(e)}
                    >
                        <option value="">Seleccionar producto...</option>
                        {this.state.products.map((products, idx) => (
                            <option value={products.id} key={idx}>
                                {products.name}
                            </option>
                        ))}
                    </select>
                </div>
            )
        }
        const SelectFormulaForm = () => {
                return(
                    <div className="space-y-2">
                        <label className="form-terrasacha-label">
                            📐 Seleccionar una Fórmula
                        </label>
                        <select
                            name="result.selectedFormula"
                            className="form-terrasacha-select"
                            onChange={(e) => this.handleOnChangeInputForm(e)}
                        >
                            <option value="">Seleccionar fórmula...</option>
                            {this.state.formulas.map((formula, idx) => (
                                <option value={formula.id} key={idx}>
                                    {formula.varID}: {formula.equation}
                                </option>
                            ))}
                        </select>
                    </div>
                )
        }
        const CheckVariablesPF = () => {
            if(this.state.selectedFormulaID !== '' && this.state.selectedProductID !== ''){
                return(
                    <div className="bg-terrasacha-info/10 border border-terrasacha-info/20 rounded-lg p-4 space-y-3">
                        <h6 className="text-sm font-bold text-terrasacha-primary font-champagne">
                            🔍 Verificación de Variables
                        </h6>
                        <p className="text-sm text-terrasacha-secondary1 font-typographica">
                            Verificar si las características del producto <span className="font-bold">{this.state.selectedProductName}</span> coinciden con las variables de la ecuación
                        </p>
                        <button
                            className="btn-terrasacha-info text-sm w-full"
                            onClick={(e) => this.checkIfVariablesMatchWithPF()}
                        >
                            🔍 Verificar Compatibilidad
                        </button>
                    </div>
                )
            }
        }
        const Calculate = () => {
            if(this.state.canCalculate){
                return(
                    <div className="bg-terrasacha-success/10 border border-terrasacha-success/20 rounded-lg p-4 space-y-3">
                        <h6 className="text-sm font-bold text-terrasacha-success font-champagne">
                            ✅ Variables Compatibles
                        </h6>
                        <p className="text-sm text-terrasacha-secondary1 font-typographica">
                            Las variables existen como características de este producto. Puedes proceder con el cálculo.
                        </p>
                        <button
                            className="btn-terrasacha-success text-sm w-full"
                            onClick={(e) => this.resolveFormula()}
                        >
                            🧮 Calcular Resultado
                        </button>
                    </div>
                )
            }
            if(this.state.canCalculate === false){
                return(
                    <div className="bg-terrasacha-danger/10 border border-terrasacha-danger/20 rounded-lg p-4">
                        <h6 className="text-sm font-bold text-terrasacha-danger font-champagne">
                            ❌ Variables Incompatibles
                        </h6>
                        <p className="text-sm text-terrasacha-secondary1 font-typographica">
                            Las variables no existen como características de este producto. Intenta con otro producto o fórmula.
                        </p>
                    </div>
                ) 
            }
        }
        const Result = () => {
            if(this.state.result !== ''){
                return(
                    <div className="bg-terrasacha-light/10 border border-terrasacha-light/20 rounded-lg p-4 space-y-3">
                        <h5 className="text-lg font-bold text-terrasacha-primary font-champagne">
                            🎯 Resultado Calculado
                        </h5>
                        <div className="bg-terrasacha-secondary2/10 border border-terrasacha-secondary2/20 rounded p-3">
                            <code className="text-xl font-mono font-bold text-terrasacha-secondary1">
                                {this.state.result}
                            </code>
                        </div>
                        <button
                            className="btn-terrasacha-primary text-sm w-full"
                            onClick={(e) => this.confirmSave()}
                        >
                            ✅ Verificar Datos
                        </button>
                    </div>
                )
            }
        }
        const SaveResult = () => {
            if(this.state.confirmSave !== false){
                let productFeatures = this.state.productFeatures.filter(pf => pf.productID === this.state.selectedProductID)
                return(
                    <div className="bg-terrasacha-warning/10 border border-terrasacha-warning/20 rounded-lg p-4 space-y-4">
                        <h5 className="text-lg font-bold text-terrasacha-primary font-champagne">
                            💾 Guardar Resultado
                        </h5>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <label className="form-terrasacha-label text-sm">
                                    🔤 Variable ID
                                </label>
                                <input
                                    type="text"
                                    placeholder="ID de variable"
                                    name="result.varID"
                                    value={this.state.varID}
                                    className="form-terrasacha-input text-sm"
                                    onChange={(e) => this.handleOnChangeInputForm(e)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="form-terrasacha-label text-sm">
                                    🎯 Resultado
                                </label>
                                <input
                                    type="text"
                                    name="result.varID"
                                    disabled
                                    value={this.state.result}
                                    className="form-terrasacha-input text-sm bg-gray-100 cursor-not-allowed font-mono"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="form-terrasacha-label text-sm">
                                    📐 Fórmula
                                </label>
                                <input
                                    type="text"
                                    name="result.equation"
                                    disabled
                                    value={this.state.equationSelected}
                                    className="form-terrasacha-input text-sm bg-gray-100 cursor-not-allowed font-mono"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="form-terrasacha-label text-sm">
                                    ⚙️ Características del Producto
                                </label>
                                <select
                                    name="result.selectedProductFeature"
                                    className="form-terrasacha-select text-sm"
                                    onChange={(e) => this.handleOnChangeInputForm(e)}
                                >
                                    <option value="">Seleccionar...</option>
                                    {productFeatures.map((pf, idx) => (
                                        <option value={pf.id} key={idx}>
                                            {pf.feature.id}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-terrasacha-warning/20">
                            <button
                                className={`btn-terrasacha-primary ${this.state.varID === '' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={this.state.varID === ''}
                                onClick={(e) => this.saveResult()}
                            >
                                💾 Guardar Resultado
                            </button>
                        </div>
                    </div>
                )
            }
        }
        const renderResults = () => {
            if (this.state.results.length > 0) {
                return (
                    <TerrasachaTable
                        title="📈 Resultados Guardados"
                        subtitle="Historial de todos los resultados calculados y almacenados"
                        headers={['Variable ID', 'Valor', 'Fórmula', 'Fecha de Creación']}
                        data={this.state.results}
                        renderRow={(results) => (
                            <>
                                <TerrasachaTableCell variant="primary">
                                    <code className="text-sm font-mono bg-terrasacha-light/10 px-2 py-1 rounded">
                                        {results.varID}
                                    </code>
                                </TerrasachaTableCell>
                                
                                <TerrasachaTableCell variant="secondary">
                                    <code className="text-sm font-mono bg-terrasacha-secondary2/10 px-2 py-1 rounded text-terrasacha-secondary1">
                                        {results.value}
                                    </code>
                                </TerrasachaTableCell>
                                
                                <TerrasachaTableCell>
                                    <code className="text-xs font-mono text-terrasacha-secondary1">
                                        {results.formula.equation}
                                    </code>
                                </TerrasachaTableCell>
                                
                                <TerrasachaTableCell>
                                    <TerrasachaBadge variant="info">
                                        {results.createdAt.substring(0, 10)}
                                    </TerrasachaBadge>
                                </TerrasachaTableCell>
                            </>
                        )}
                    />
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
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-terrasacha-primary font-champagne">
                                    🎯 Características con Resultados Asignados
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="form-terrasacha-label text-sm">
                                            🏭 Filtrar por Producto
                                        </label>
                                        <select
                                            name="filterProducts"
                                            className="form-terrasacha-select text-sm"
                                            onChange={(e) => this.handleChangeFilter(e)}
                                        >
                                            <option value="">Todos los productos</option>
                                            {this.state.products.map((product, idx) => (
                                                <option value={product.id} key={idx}>
                                                    {product.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {this.state.filterByProduct !== '' && (
                                        <div className="space-y-2">
                                            <label className="form-terrasacha-label text-sm">
                                                ⚙️ Filtrar por Característica
                                            </label>
                                            <select
                                                name="filterProductFeature"
                                                className="form-terrasacha-select text-sm"
                                                onChange={(e) => this.handleChangeFilter(e)}
                                            >
                                                <option value="">Todas las características</option>
                                                {this.state.filterByProduct.productFeatures.items.map((pf, idx) => (
                                                    <option value={pf.id} key={idx}>
                                                        {pf.feature.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <TerrasachaTable
                                title="📊 Resultados por Característica"
                                subtitle="Administrar los resultados asignados a cada característica del producto"
                                headers={['Producto', 'Característica', 'Resultado Asignado', 'Fórmula', 'Estado']}
                                data={copyProductFeatureResults || []}
                                renderRow={(PFR) => (
                                    <>
                                        <TerrasachaTableCell variant="primary">
                                            {PFR.productFeature.product.name}
                                        </TerrasachaTableCell>
                                        
                                        <TerrasachaTableCell variant="secondary">
                                            {PFR.productFeature.feature.name}
                                        </TerrasachaTableCell>
                                        
                                        <TerrasachaTableCell>
                                            <code className="text-sm font-mono bg-terrasacha-secondary2/10 px-2 py-1 rounded text-terrasacha-secondary1">
                                                {PFR.result.value}
                                            </code>
                                        </TerrasachaTableCell>
                                        
                                        <TerrasachaTableCell>
                                            <code className="text-xs font-mono text-terrasacha-secondary1">
                                                {PFR.result.formula.equation}
                                            </code>
                                        </TerrasachaTableCell>
                                        
                                        <TerrasachaTableCell>
                                            <button
                                                className={`text-sm font-typographica font-bold py-2 px-3 rounded-lg transition-colors duration-200 ${
                                                    PFR.isActive ? 'btn-terrasacha-secondary' : 'btn-terrasacha-success'
                                                }`}
                                                onClick={(e) => this.handleActiveResult(PFR.productFeatureID, PFR.id)}
                                            >
                                                {PFR.isActive ? '📌 Asignado' : '✅ Asignar'}
                                            </button>
                                        </TerrasachaTableCell>
                                    </>
                                )}
                            />
                        </div>
                )
            }
        return (
            <div className="space-y-8 animate-fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[580px]">
                    {/* Panel de Cálculo */}
                    <div className="bg-white rounded-xl shadow-terrasacha-lg border border-terrasacha-light/20 p-6 overflow-y-auto">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-terrasacha-primary font-champagne mb-2">
                                🧮 Calcular Resultado
                            </h2>
                            <div className="h-1 w-20 bg-terrasacha-secondary2 rounded-full"></div>
                        </div>
                        
                        <div className="space-y-6">
                            {SelectProductForm()}   
                            {SelectFormulaForm()}
                            {CheckVariablesPF()}
                            {Calculate()}
                            {Result()}
                            {SaveResult()}
                        </div>
                    </div>

                    {/* Panel de Resultados de Características */}
                    <div className="bg-white rounded-xl shadow-terrasacha-lg border border-terrasacha-light/20 p-6 overflow-y-auto">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-terrasacha-primary font-champagne mb-2">
                                📊 Características del Producto
                            </h2>
                            <div className="h-1 w-20 bg-terrasacha-secondary2 rounded-full"></div>
                        </div>
                        {renderProductFeaturesResults()}
                    </div>
                </div>

                {/* Lista de Resultados */}
                <div className="bg-white rounded-xl shadow-terrasacha-lg border border-terrasacha-light/20 p-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-terrasacha-primary font-champagne mb-2">
                            📈 Lista de Resultados
                        </h2>
                        <div className="h-1 w-20 bg-terrasacha-secondary2 rounded-full"></div>
                    </div>
                    {renderResults()}
                </div>
            </div>
        )
  }
}
export default Results