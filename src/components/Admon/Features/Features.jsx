import React, { Component } from 'react'
// import '@aws-amplify/ui-react/styles.css'

// Bootstrap
import  Button  from '../../ui/Button'
import  Col  from '../../ui/Col'
import  Container  from '../../ui/Container'
import  Form  from '../../ui/Form'
import  Row  from '../../ui/Row'
import  Table  from '../../ui/Table'
//Feature Types component
import FeaturesType from './FeaturesType'
// GraphQL
import { API, graphqlOperation } from 'aws-amplify'
import { createFeature, updateFeature } from '../../../graphql/mutations'
import { listFeatures, listFeatureTypes, listUnitOfMeasures } from '../../../graphql/queries'
import { onCreateFeature, onCreateFeatureType, onUpdateFeature, onUpdateFeatureType } from '../../../graphql/subscriptions'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


 class Features extends Component {
    constructor(props) {
        super(props)
        this.state = {
            date: new Date(),
            CRUDButtonName: 'CREATE',
            isCRUDButtonDisable: true,
            features:[],
            featureTypes: [],
            UnitOfMeasures: [],
            newFeature:{
                id: '',
                name: '',
                description: '',
                isTemplate: false,
                isVerifable: false,
                defaultValue: '1',
                featureTypeID: '',
                unitOfMeasureID: ''
               /*  isAvailable: true, */
            },
        }
            this.handleOnChangeInputForm = this.handleOnChangeInputForm.bind(this)
            this.handleCRUDFeature = this.handleCRUDFeature.bind(this)
            this.handleLoadEditFeature = this.handleLoadEditFeature.bind(this)
            this.goToTop = this.goToTop = this.goToTop.bind(this)
        }
        
        componentDidMount = async () => {
            Promise.all([
                this.loadFeatures(),
                this.loadFeatureTypes(),
                this.loadUnitOfMeasures(),
                this.loadFeatureTypes(),
            ])
        // Subscriptions
        // OnCreate Feature
        this.createFeatureListener = API.graphql(graphqlOperation(onCreateFeature))
        .subscribe({
            next: createdFeatureData => {
                let isOnCreateList = false;
                this.state.features.map((mapFeature) => {
                    if (createdFeatureData.value.data.onCreateFeature.id === mapFeature.id) {
                        isOnCreateList = true;
                    } 
                    return mapFeature
                })
                let tempFeatures = this.state.features
                if (!isOnCreateList) {
                    tempFeatures.push(createdFeatureData.value.data.onCreateFeature)
                }
                // Ordering Features by name
                tempFeatures.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1)
                this.setState((state) => ({features: tempFeatures}))
            }
        })
        // OnUpdate Feature
        this.updateFeatureListener = API.graphql(graphqlOperation(onUpdateFeature))
        .subscribe({
            next: updatedFeatureData => {
                let tempFeatures = this.state.features.map((mapFeature) => {
                    if (updatedFeatureData.value.data.onUpdateFeature.id === mapFeature.id) {
                        return updatedFeatureData.value.data.onUpdateFeature
                    } else {
                        return mapFeature
                    }
                })
                // Ordering Features by name
                tempFeatures.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1)
                this.setState((state) => ({features: tempFeatures}))
            }
        })
        // Subscriptions
        // OnCreate FeatureType
        let tempFeatureTypes = this.state.featureTypes
        this.createFeatureTypeListener = API.graphql(graphqlOperation(onCreateFeatureType))
        .subscribe({
            next: createdFeatureTypeData => {
                let tempOnCreateFeatureType = createdFeatureTypeData.value.data.onCreateFeatureType
                tempFeatureTypes.push(tempOnCreateFeatureType)
                // Ordering Features by name
                tempFeatureTypes.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1)
                // this.updateStateFeatures(tempFeatures)
                this.setState((state) => ({featureTypes: tempFeatureTypes}))
            }
        })
        // OnUpdate FeatureType
        this.updateFeatureTypeListener = API.graphql(graphqlOperation(onUpdateFeatureType))
        .subscribe({
            next: updatedFeatureTypeData => {
                let tempFeatureTypes = this.state.featureTypes.map((mapFeatureType) => {
                    if (updatedFeatureTypeData.value.data.onUpdateFeatureType.id === mapFeatureType.id) {
                        return updatedFeatureTypeData.value.data.onUpdateFeatureType
                    } else {
                        return mapFeatureType
                    }
                })
                // Ordering Features by name
                tempFeatureTypes.sort((a, b) => (a.name > b.name) ? 1 : -1)
                this.setState((state) => ({featuresTypes: tempFeatureTypes}))
            }
        })
    
    }
    componentWillUnmount() {
        this.createFeatureListener.unsubscribe();
        this.updateFeatureListener.unsubscribe();
        this.createFeatureTypeListener.unsubscribe();
        this.updateFeatureTypeListener.unsubscribe();
      }
    async loadFeatures() {
        const listFeaturesResult = await API.graphql(graphqlOperation(listFeatures))
        listFeaturesResult.data.listFeatures.items.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1)
        this.setState({features: listFeaturesResult.data.listFeatures.items})
        }

    async loadFeatureTypes() {
        const listFeatureTypesResult = await API.graphql(graphqlOperation(listFeatureTypes))
        listFeatureTypesResult.data.listFeatureTypes.items.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1)
        this.setState({featureTypes: listFeatureTypesResult.data.listFeatureTypes.items})
        }
    async loadUnitOfMeasures() {
        const listUnitOfMeasuresResult = await API.graphql(graphqlOperation(listUnitOfMeasures))
        listUnitOfMeasuresResult.data.listUnitOfMeasures.items.sort((a, b) => (a.engineeringUnit.toLowerCase() > b.engineeringUnit.toLowerCase()) ? 1 : -1)
        this.setState({UnitOfMeasures: listUnitOfMeasuresResult.data.listUnitOfMeasures.items})
        }
        
    handleOnChangeInputForm = async(event) => {
        let tempNewFeature = this.state.newFeature
        if (event.target.name === 'feature.name') {
            tempNewFeature.name = event.target.value
            tempNewFeature.id = tempNewFeature.name.replaceAll(' ','_')
        }
        if (event.target.name === 'feature.description') {
            tempNewFeature.description = event.target.value
        }
        if (event.target.name === 'feature.defaultValue') {
            if(!tempNewFeature.unitOfMeasureID){
                tempNewFeature.defaultValue =  '' //null
            } 
            tempNewFeature.defaultValue = parseFloat(event.target.value)
        }
        if (event.target.name === 'feature.isTemplate') {
            if(event.target.value === 'yes'){
               tempNewFeature.isTemplate = true
            }else{
                tempNewFeature.isTemplate = false
                
            }
        }
        if (event.target.name === 'feature.isVerifable') {
            if(event.target.value === 'yes'){
               tempNewFeature.isVerifable = true
            }else{
                tempNewFeature.isVerifable = false
                
            }
        }
        if (event.target.name === 'feature.featureType') {
            tempNewFeature.featureTypeID = event.target.value
        }
        if (event.target.name === 'feature.unitOfMeasure') {
            tempNewFeature.unitOfMeasureID = event.target.value
        }
        
        this.setState({newFeature: tempNewFeature})
        this.validateCRUDFeature()
        
    }

    async validateCRUDFeature() {
        if (this.state.newFeature.name !== '') {
            this.setState({isCRUDButtonDisable: false})
        }
    }
    
    async handleCRUDFeature() {
        let tempNewFeature = this.state.newFeature
        if(tempNewFeature.unitOfMeasureID === '') return this.notifyError('Asegurese de Seleccionar una unidad de medida')
        if (this.state.CRUDButtonName === 'CREATE') {
            let numberType = this.state.UnitOfMeasures.filter(uom => uom.id === tempNewFeature.unitOfMeasureID)
            tempNewFeature.defaultValue = numberType[0].isFloat? parseFloat(tempNewFeature.defaultValue) : parseInt(tempNewFeature.defaultValue)
            try {
                await API.graphql(graphqlOperation(createFeature, { input: tempNewFeature }))
                this.notify()
            } catch (error) {
                return this.notifyError('Asegurese de completar los campos obligatorios para crear la Feature')
            }
            await this.cleanFeatureOnCreate()
        }

        if (this.state.CRUDButtonName === 'UPDATE') {
            delete tempNewFeature.createdAt
            delete tempNewFeature.updatedAt
            delete tempNewFeature.featureType
            delete tempNewFeature.unitOfMeasure
            delete tempNewFeature.productFeatures
            delete tempNewFeature.formulas
            delete tempNewFeature.featureFormulas
            await API.graphql(graphqlOperation(updateFeature, { input: tempNewFeature }))        
            await this.cleanFeatureOnCreate()
        }
    }

    handleLoadEditFeature= async(feature, event) => {

        this.setState({
            newFeature:  feature,
            CRUDButtonName: 'UPDATE',
            isCRUDButtonDisable: false
        })
        this.goToTop()
        this.validateCRUDFeature()
    }
    goToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };
    notify = () =>{
        toast.success('Feature creada', {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
    }
    notifyError = (e) =>{
        toast.error( e, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
        this.setState({loading: false})
    }
    async cleanFeatureOnCreate() {
         this.setState({
            CRUDButtonName: 'CREATE',
            isCRUDButtonDisable: true,
            newFeature:{
                id: '',
                name: '',
                description: '',
                isTemplate: this.state.newFeature.isTemplate,
                isVerifable: this.state.newFeature.isVerifable,
                defaultValue: '1',
                featureTypeID: this.state.newFeature.featureTypeID,
                unitOfMeasureID: this.state.newFeature.unitOfMeasureID
               /*  isAvailable: true, */
            },
        })
    }
    

    render() {
        let { features, newFeature, CRUDButtonName } = this.state;
    
        const renderFeaturesType = () => {
          return <FeaturesType featureTypes={this.state.featureTypes} />;
        };
    
        const renderFeatures = () => {
          if (features.length > 0) {
            return (
              <div className='container mx-auto' style={{ maxHeight: '30rem', overflowY: 'scroll' }}>
                <h2>Features</h2>
                <table striped bordered hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Default value</th>
                      <th>Type</th>
                      <th>Unit of Measure</th>
                      <th>Is template</th>
                      <th>Is verifiable</th>
                      <th>Editar</th>
                      {/* <th>Is available</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {features.map((feature) => (
                      <tr key={feature.id}>
                        <td>{feature.id}</td>
                        <td>{feature.name}</td>
                        <td>{feature.description}</td>
                        <td>{feature.defaultValue}</td>
                        <td>{feature.featureTypeID}</td>
                        <td>{feature.unitOfMeasureID}</td>
                        <td>{feature.isTemplate ? 'Si' : 'No'}</td>
                        <td>{feature.isVerifable ? 'Si' : 'No'}</td>
                        <td>
                          <button
                            variant='primary'
                            size='sm'
                            onClick={(e) => this.handleLoadEditFeature(feature, e)}
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
        };
    
        return (
          <div classname="container mx-auto container mx-auto sm:px-4">
            <div classname="container container mx-auto sm:px-4">
              <ToastContainer />

              <h2 className="text-2xl font-bold mb-4">
                {CRUDButtonName} FeatureID: {newFeature.id}
              </h2>

              <form>
                <div className="mb-4">
                  <label htmlFor="featureName" className="block text-sm font-medium text-gray-700">
                    Name*
                  </label>
                    <input
                      type='text'
                      className='form-control'
                      id='featureName'
                      placeholder='Name...'
                      name='feature.name'
                      value={newFeature.name}
                      onChange={(e) => this.handleOnChangeInputForm(e)}
                    />
                    <label htmlFor='featureDescription' className='form-label'>
                      Description
                    </label>
                    <input
                      type='text'
                      className='form-control'
                      id='featureDescription'
                      placeholder='Description...'
                      name='feature.description'
                      value={newFeature.description}
                      onChange={(e) => this.handleOnChangeInputForm(e)}
                    />
                    <label htmlFor='featureDefaultValue' className='form-label'>
                      Default value
                    </label>
                    <input
                      type='number'
                      className='form-control'
                      id='featureDefaultValue'
                      placeholder=''
                      name='feature.defaultValue'
                      value={newFeature.defaultValue}
                      onChange={(e) => this.handleOnChangeInputForm(e)}
                    />
                    <label htmlFor='featureIsTemplate' className='form-label'>
                      Is template
                    </label>
                    <select
                      className='form-select'
                      name='feature.isTemplate'
                      onChange={(e) => this.handleOnChangeInputForm(e)}
                    >
                      <option value='no'>No</option>
                      <option value='yes'>Yes</option>
                    </select>
                    <label htmlFor='featureIsVerifiable' className='form-label'>
                      Is verifiable
                    </label>
                    <select
                      className='form-select'
                      name='feature.isVerifable'
                      onChange={(e) => this.handleOnChangeInputForm(e)}
                    >
                      <option value='no'>No</option>
                      <option value='yes'>Yes</option>
                    </select>
                    <label htmlFor='featureFeatureType' className='form-label'>
                      Type*
                    </label>
                    <select
                      className='form-select'
                      name='feature.featureType'
                      onChange={(e) => this.handleOnChangeInputForm(e)}
                    >
                      <option value=''>-</option>
                      {this.state.featureTypes.map((featureType, idx) => (
                        <option value={featureType.name} key={idx}>
                          {featureType.name}
                        </option>
                      ))}
                    </select>
                    <label htmlFor='featureUnitOfMeasure' className='form-label'>
                      Unit Of Measure*
                    </label>
                    <select
                      className='form-select'
                      name='feature.unitOfMeasure'
                      onChange={(e) => this.handleOnChangeInputForm(e)}
                    >
                      <option value=''>-</option>
                      {this.state.UnitOfMeasures.map((UnitOfMeasure, idx) => (
                        <option value={UnitOfMeasure.id} key={idx}>
                          {UnitOfMeasure.engineeringUnit}
                        </option>
                      ))}
                    </select>
                    {/* <label htmlFor='featureIsAvailable' className='form-label'>
                      Is available
                    </label>
                    <select
                      className='form-select'
                      name='feature.isAvailable'
                      onChange={(e) => this.handleOnChangeInputForm(e)}
                    >
                      <option value='yes'>Yes</option>
                      <option value='no'>No</option>
                    </select> */}
                  </div>
    
                <div className='mb-1'>
                  <button
                    variant='primary'
                    size='sm'
                    onClick={this.handleCRUDFeature}
                    disabled={this.state.isCRUDButtonDisable}
                  >
                    {CRUDButtonName}
                  </button>
                </div>
              </form>
              <br></br>
              {renderFeatures()}
            </div>
            {renderFeaturesType()}
          </div>
        );
      }
    }

    export default Features;
