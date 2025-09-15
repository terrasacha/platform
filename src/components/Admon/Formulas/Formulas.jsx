import React, { Component } from 'react';

// Bootstrap reemplazado con Tailwind CSS y sistema Terrasacha
// Componentes Terrasacha
import TerrasachaTable, { TerrasachaTableCell, TerrasachaBadge } from "../../common/TerrasachaTable";
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
                    <TerrasachaTable
                        title="📐 Fórmulas Configuradas"
                        subtitle="Lista de todas las fórmulas matemáticas disponibles en el sistema"
                        headers={['Variable ID', 'Ecuación', 'Unidad de Medida', 'Acción']}
                        data={formulas}
                        renderRow={(formula) => (
                            <>
                                <TerrasachaTableCell variant="primary">
                                    <code className="text-sm font-mono bg-terrasacha-light/10 px-2 py-1 rounded">
                                        {formula.varID}
                                    </code>
                                </TerrasachaTableCell>
                                
                                <TerrasachaTableCell variant="secondary">
                                    <code className="text-sm font-mono bg-terrasacha-secondary2/10 px-2 py-1 rounded text-terrasacha-secondary1">
                                        {formula.equation}
                                    </code>
                                </TerrasachaTableCell>
                                
                                <TerrasachaTableCell>
                                    {formula.unitOfMeasure !== undefined ? (
                                        <TerrasachaBadge variant="info">
                                            {formula.unitOfMeasure.engineeringUnit}
                                        </TerrasachaBadge>
                                    ) : (
                                        <TerrasachaBadge variant="neutral">
                                            Sin unidad
                                        </TerrasachaBadge>
                                    )}
                                </TerrasachaTableCell>
                                
                                <TerrasachaTableCell>
                                    <button
                                        className="btn-terrasacha-secondary text-sm"
                                        onClick={(e) => this.handleLoadEditFormula(formula, e)}
                                    >
                                        Editar
                                    </button>
                                </TerrasachaTableCell>
                            </>
                        )}
                    />
                )
            }
        }


        return (
            <div className="space-y-8 animate-fade-in">
                {/* Formulario de creación/edición */}
                <div className="bg-white rounded-xl shadow-terrasacha-lg border border-terrasacha-light/20 overflow-hidden">
                    <div className="bg-terrasacha-primary text-white px-6 py-4">
                        <h2 className="text-xl font-bold font-champagne tracking-wide">
                            📐 {CRUDButtonName === 'CREATE' ? 'Crear' : 'Editar'} Fórmula
                        </h2>
                        <p className="text-sm text-terrasacha-earth/80 font-typographica mt-1">
                            {CRUDButtonName === 'CREATE' 
                                ? 'Define una nueva fórmula matemática para el sistema' 
                                : `Editando fórmula: ${newFormula.varID || 'Sin nombre'}`
                            }
                        </p>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Variable ID */}
                            <div className="space-y-2">
                                <label className="form-terrasacha-label">
                                    🔤 Variable ID
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej. CARBON_CALC"
                                    name="formula.varID"
                                    value={newFormula.varID}
                                    className="form-terrasacha-input"
                                    onChange={(e) => this.handleOnChangeInputForm(e)}
                                />
                            </div>

                            {/* Ecuación */}
                            <div className="space-y-2">
                                <label className="form-terrasacha-label">
                                    ➕ Ecuación
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej. area * factor * 0.47"
                                    name="formula.equation"
                                    value={newFormula.equation}
                                    className="form-terrasacha-input font-mono"
                                    onChange={(e) => this.handleOnChangeInputForm(e)}
                                />
                            </div>

                            {/* Unidad de Medida */}
                            <div className="space-y-2">
                                <label className="form-terrasacha-label">
                                    📏 Unidad de Medida
                                </label>
                                <select
                                    name="formula.unitOfMeasure"
                                    className="form-terrasacha-select"
                                    onChange={(e) => this.handleOnChangeInputForm(e)}
                                >
                                    <option value="">Seleccionar unidad...</option>
                                    {this.state.unitOfMeasures.map((uom, idx) => (
                                        <option value={uom.id} key={idx}>
                                            {uom.engineeringUnit}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Botón de acción */}
                        <div className="flex justify-end pt-6 border-t border-terrasacha-light/20 mt-6">
                            <button
                                className={`btn-terrasacha-primary ${this.state.isCRUDButtonDisable ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={this.handleCRUDFormula}
                                disabled={this.state.isCRUDButtonDisable}
                            >
                                {CRUDButtonName === 'CREATE' ? '✨ Crear Fórmula' : '💾 Actualizar Fórmula'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Lista de fórmulas */}
                {renderFormulas()}
            </div>
        )
    }
}

export default Formulas