import React, { Component } from 'react'

// import '@aws-amplify/ui-react/styles.css'
// Bootstrap
import  Button  from '../../ui/Button';
import  Col  from '../../ui/Col';
import  Container  from '../../ui/Container';
import  Form  from '../../ui/Form';
import  Row  from '../../ui/Row';
// Auth css custom
import Bootstrap from "../../common/themes"
// GraphQL
import { API, graphqlOperation } from 'aws-amplify'
import { createFeatureType, updateFeatureType } from '../../../graphql/mutations'


 class FeaturesType extends Component {
    constructor(props) {
        super(props)
        this.state = {
            date: new Date(),
            CRUDButtonName: 'CREATE',
            isCRUDButtonDisable: true,
            featureTypes:[],
            newFeatureType:{
                id: '',
                name: '',
                description: '',
            },
        }
            this.handleOnChangeInputForm = this.handleOnChangeInputForm.bind(this)
            this.handleCRUDFeatureType = this.handleCRUDFeatureType.bind(this)
            this.handleLoadEditFeatureType = this.handleLoadEditFeatureType.bind(this)
        }

    componentDidMount = async () => {
    
    }

/*     async loadFeatureTypes() {
        const listFeatureTypesResult = await API.graphql(graphqlOperation(listFeatureTypes))
        listFeatureTypesResult.data.listFeatureTypes.items.sort((a, b) => (a.name > b.name) ? 1 : -1)
        this.setState({featureTypes: listFeatureTypesResult.data.listFeatureTypes.items})
        } */
        
    handleOnChangeInputForm = async(event) => {
        let tempNewFeatureType = this.state.newFeatureType
        if (event.target.name === 'featureType.name') {
            tempNewFeatureType.name = event.target.value.toUpperCase()
            tempNewFeatureType.name = tempNewFeatureType.name.replace(' ','')
        }
        if (event.target.name === 'featureType.description') {
            tempNewFeatureType.description = event.target.value
        }
       
        this.setState({newFeatureType: tempNewFeatureType})
        this.validateCRUDFeatureType()
        
    }

    async validateCRUDFeatureType() {
        if (this.state.newFeatureType.name !== '') {
            this.setState({isCRUDButtonDisable: false})
        }
    }
    
    async handleCRUDFeatureType() {
        let tempNewFeatureType = this.state.newFeatureType

        if (this.state.CRUDButtonName === 'CREATE') {
            
            const newFeatureTypeId = this.state.newFeatureType.name
            tempNewFeatureType.id = newFeatureTypeId
           await API.graphql(graphqlOperation(createFeatureType, { input: tempNewFeatureType }))
            await this.cleanFeatureTypeOnCreate() 
        }

        if (this.state.CRUDButtonName === 'UPDATE') {
            delete tempNewFeatureType.createdAt
            delete tempNewFeatureType.updatedAt
            delete tempNewFeatureType.features

            await API.graphql(graphqlOperation(updateFeatureType, { input: tempNewFeatureType }))        
            await this.cleanFeatureTypeOnCreate()
        }
    }

    handleLoadEditFeatureType= async(featureType, event) => {

        this.setState({
            newFeatureType:  featureType,
            CRUDButtonName: 'UPDATE',
            isCRUDButtonDisable: false
        })
        this.validateCRUDFeatureType()
    }

    async cleanFeatureTypeOnCreate() {
         this.setState({
            CRUDButtonName: 'CREATE',
            isCRUDButtonDisable: true,
            newFeatureType: {   
                id: '',
                name: '',
                description: '',
            }
        })
    }
    
    
        

    render() {
        let { newFeatureType, CRUDButtonName,} = this.state
        let { featureTypes } = this.props
        const renderFeatureTypes = () => {
            if (featureTypes.length > 0) {
                return (
                   <div className='container' style={{maxHeight: '30rem', overflowY: 'scroll'}}>
                    <h2>Features Types</h2>
                        <table striped bordered hover>
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                            </tr>
                            </thead>
                            <tbody>
                            {featureTypes.map((featuresType, idx) => (
                                <tr key={idx}>
                                    <td>
                                        {featuresType.name}
                                    </td>
                                    <td>
                                        {featuresType.description}
                                    </td>
                                    <td>
                                        <button 
                                            variant='primary'
                                            size='sm' 
                                             
                                            onClick={(e) => this.handleLoadEditFeatureType(featuresType, e)}
                                        >Editar</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )
            }
        
        }

        return (
           <div className='container'>
               <div className='container'>
                    <br></br>
                    <h2>{CRUDButtonName} Feature Type: {newFeatureType.name}</h2>
                    <form>
                        <div className='mb-2'>
                            <div className='mb-2'>
                            <label htmlFor='formGridNewFeatureName' className='block text-sm font-medium text-gray-700'>
                                Name
                            </label>
                            <input
                                type='text'
                                id='formGridNewFeatureName'
                                placeholder='Name...'
                                name='featureType.name'
                                value={newFeatureType.name}
                                onChange={(e) => this.handleOnChangeInputForm(e)}
                                className='mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300 block w-full'
                            />
                            </div>
                            <div className='mb-2'>
                            <label htmlFor='formGridNewFeatureDescription' className='block text-sm font-medium text-gray-700'>
                                Description
                            </label>
                            <input
                                type='text'
                                id='formGridNewFeatureDescription'
                                placeholder='Description...'
                                name='featureType.description'
                                value={newFeatureType.description}
                                onChange={(e) => this.handleOnChangeInputForm(e)}
                                className='mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300 block w-full'
                            />
                            </div>
                        </div>

                        <div className='mb-1'>
                            <button
                            className='btn-yellow hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                            onClick={this.handleCRUDFeatureType}
                            disabled={this.state.isCRUDButtonDisable}
                            >
                            {CRUDButtonName}
                            </button>
                        </div>
                        </form>

                </div>
            {renderFeatureTypes()}

        </div>
        )
    }
}

export default FeaturesType
