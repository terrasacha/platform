import React, { Component } from 'react'

// import '@aws-amplify/ui-react/styles.css'
// Bootstrap
import  Button  from '../../ui/Button';
import  Col  from '../../ui/Col';
import  Container  from '../../ui/Container';
import  Form  from '../../ui/Form';
import  Row  from '../../ui/Row';
import  Table  from '../../ui/Table';
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
                    <Container style={{maxHeight: '30rem', overflowY: 'scroll'}}>
                    <h2>Features Types</h2>
                        <Table striped bordered hover>
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
                                        <Button 
                                            variant='primary'
                                            size='sm' 
                                             
                                            onClick={(e) => this.handleLoadEditFeatureType(featuresType, e)}
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
            <Container>
                <Container>
                    <br></br>
                    <h2>{CRUDButtonName} Feature Type: {newFeatureType.name}</h2>
                    <Form>
                        <Row className='mb-2'>
                            <Form.Group as={Col} controlId='formGridNewFeatureName'>
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Name...'
                                    name='featureType.name'
                                    value={newFeatureType.name}
                                    onChange={(e) => this.handleOnChangeInputForm(e)} />
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Description...'
                                    name='featureType.description'
                                    value={newFeatureType.description}
                                    onChange={(e) => this.handleOnChangeInputForm(e)} />
                            </Form.Group>
                        </Row>

                        <Row className='mb-1'>
                            <Button
                            variant='primary'
                            size='sm'
                            onClick={this.handleCRUDFeatureType}
                            disabled={this.state.isCRUDButtonDisable}
                            >{CRUDButtonName}</Button>
                        </Row>
                    </Form>
                </Container>
            {renderFeatureTypes()}

        </Container>
        )
    }
}

export default FeaturesType
