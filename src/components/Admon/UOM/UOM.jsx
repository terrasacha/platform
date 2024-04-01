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
// GraphQL
import { API, graphqlOperation } from 'aws-amplify'
import { createUnitOfMeasure, updateUnitOfMeasure } from '../../../graphql/mutations'
import { listUnitOfMeasures } from '../../../graphql/queries'
import { onCreateUnitOfMeasure, onUpdateUnitOfMeasure } from '../../../graphql/subscriptions'

class UOM extends Component {

    constructor(props) {
        super(props)
        this.state = {
            unitOfMeasures: [],
            CRUDButtonName: 'CREATE',
            isCRUDButtonDisable: true,
            newUnitOfMeasure: {
                            id: '',
                            engineeringUnit: '',
                            description: '',
                            isFloat: false,
                        },
        }
        this.handleOnChangeInputForm = this.handleOnChangeInputForm.bind(this)
        this.handleCRUDUnitOfMeasure = this.handleCRUDUnitOfMeasure.bind(this)
        this.handleLoadEditUnitOfMeasure = this.handleLoadEditUnitOfMeasure.bind(this)
    }

    componentDidMount = async () => {
        await this.loadUnitOfMeasures()

        // Subscriptions
        // OnCreate OUM
        let tempUnitOfMeasures = this.state.unitOfMeasures
        this.createUnitOfMeasureListener = API.graphql(graphqlOperation(onCreateUnitOfMeasure))
        .subscribe({
            next: createdUnitOfMeasureData => {
                let tempOnCreateUnitOfMeasure = createdUnitOfMeasureData.value.data.onCreateUnitOfMeasure
                tempUnitOfMeasures.push(tempOnCreateUnitOfMeasure)
                // Ordering categorys by name
                tempUnitOfMeasures.sort((a, b) => (a.name > b.name) ? 1 : -1)
                // this.updateStateCategorys(tempCategorys)
                this.setState((state) => ({unitOfMeasures: tempUnitOfMeasures}))
            }
        })

        // OnUpdate OUM
        this.updateCategoryListener = API.graphql(graphqlOperation(onUpdateUnitOfMeasure))
        .subscribe({
            next: updatedUnitOfMeasureData => {
                let tempUnitOfMeasures = this.state.unitOfMeasures.map((mapUnitOfMeasure) => {
                    if (updatedUnitOfMeasureData.value.data.onUpdateUnitOfMeasure.id === mapUnitOfMeasure.id) {
                        return updatedUnitOfMeasureData.value.data.onUpdateUnitOfMeasure
                    } else {
                        return mapUnitOfMeasure
                    }
                })
                // Ordering categorys by name
                tempUnitOfMeasures.sort((a, b) => (a.name > b.name) ? 1 : -1)
                this.setState((state) => ({unitOfMeasures: tempUnitOfMeasures}))
            }
        })

    }
    componentWillUnmount() {
        // TODO: Why is not working the unsubscribe
        // this.createUnitOfMeasureListener.unsubscribe();
        // this.updateCategoryListener.unsubscribe();
      }

    async loadUnitOfMeasures() {
        const listUnitOfMeasuresResult = await API.graphql(graphqlOperation(listUnitOfMeasures))
        listUnitOfMeasuresResult.data.listUnitOfMeasures.items.sort((a, b) => (a.name > b.name) ? 1 : -1)
        this.setState({unitOfMeasures: listUnitOfMeasuresResult.data.listUnitOfMeasures.items})
    }

    handleOnChangeInputForm = async(event, pProperty) => {
        let tempNewUnitOfMeasure = this.state.newUnitOfMeasure
        if (event.target.name === 'newUnitOfMeasure.engineeringUnit') {
            tempNewUnitOfMeasure.engineeringUnit = event.target.value
            tempNewUnitOfMeasure.id = event.target.value.replaceAll(' ','_')
        }
        if (event.target.name === 'newUnitOfMeasure.description') {
            tempNewUnitOfMeasure.description = event.target.value
        }
        if (pProperty === 'isFloat') {
            tempNewUnitOfMeasure.isFloat = !tempNewUnitOfMeasure.isFloat
        }
        this.setState({newUnitOfMeasure: tempNewUnitOfMeasure})
        this.validateCRUDUnitOfMeasure()
    }

    async validateCRUDUnitOfMeasure() {
        if (this.state.newUnitOfMeasure.name !== '') {
            this.setState({isCRUDButtonDisable: false})
        }
    }
    
    async handleCRUDUnitOfMeasure() {
        let tempNewUnitOfMeasure = this.state.newUnitOfMeasure

        if (this.state.CRUDButtonName === 'CREATE') {
            await API.graphql(graphqlOperation(createUnitOfMeasure, { input: tempNewUnitOfMeasure }))
            await this.cleanUnitOfMeasureOnCreate()
        }

        if (this.state.CRUDButtonName === 'UPDATE') {
            delete tempNewUnitOfMeasure.createdAt
            delete tempNewUnitOfMeasure.updatedAt
            delete tempNewUnitOfMeasure.formulas
            delete tempNewUnitOfMeasure.features
            await API.graphql(graphqlOperation(updateUnitOfMeasure, { input: tempNewUnitOfMeasure }))
            await this.cleanUnitOfMeasureOnCreate()
        }
    }
    

    handleLoadEditUnitOfMeasure= async(unitOfMeasures, event) => {

        this.setState({
            newUnitOfMeasure:  unitOfMeasures,
            CRUDButtonName: 'UPDATE',
            isCRUDButtonDisable: false
        })
        this.validateCRUDUnitOfMeasure()
    }

    async cleanUnitOfMeasureOnCreate() {
         this.setState({
            CRUDButtonName: 'CREATE',
            isCRUDButtonDisable: true,
            newUnitOfMeasure: {   
                            id: '',
                            engineeringUnit: '',
                            description: '',
                            isFloat: false
                        }
        })
    }
    
  // RENDER
  render() {
    // State Variables
    let { unitOfMeasures, newUnitOfMeasure, CRUDButtonName } = this.state;

    const renderUnitOfMeasures = () => {
      if (unitOfMeasures.length > 0) {
        return (
          <div classname="container mx-auto container mx-auto sm:px-4">
            <table className="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>Engineering unit</th>
                  <th>Description</th>
                  <th>Is float</th>
                  <th>Editar</th>
                </tr>
              </thead>
              <tbody>
                {unitOfMeasures.map((unitOfMeasure) => (
                  <tr key={unitOfMeasure.id}>
                    <td>{unitOfMeasure.engineeringUnit}</td>
                    <td>{unitOfMeasure.description}</td>
                    <td>{unitOfMeasure.isFloat ? 'Yes' : 'No'}</td>
                    <td>
                      <button
                        variant='primary'
                        size='sm'
                        onClick={(e) => this.handleLoadEditUnitOfMeasure(unitOfMeasure, e)}
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
      <div classname="container mx-auto sm:px-4 mt-4 pt-4 measure">
        <div classname="container mx-auto container mx-auto sm:px-4 mt-4 pt-4">
          <h2>Create Unit of Measure</h2>
          <form>
            <div className='mb-2'>
              <div controlId='formGridNewCategoryName'>
                <label htmlFor='engineeringUnit' className='form-label'>
                  Engineering Unit
                </label>
                <input
                  type='text'
                  className='form-control'
                  id='engineeringUnit'
                  placeholder=''
                  name='newUnitOfMeasure.engineeringUnit'
                  value={newUnitOfMeasure.engineeringUnit}
                  onChange={(e) => this.handleOnChangeInputForm(e)}
                />
                <label htmlFor='description' className='form-label'>
                  Description
                </label>
                <input
                  type='text'
                  className='form-control'
                  id='description'
                  placeholder=''
                  name='newUnitOfMeasure.description'
                  value={newUnitOfMeasure.description}
                  onChange={(e) => this.handleOnChangeInputForm(e)}
                />
                <label htmlFor='isFloat' className='form-label'>
                  Is Float?
                </label>
                <br />
                <button
                  variant='primary'
                  size='sm'
                  onClick={(e) => this.handleOnChangeInputForm(e, 'isFloat')}
                >
                  {newUnitOfMeasure.isFloat ? 'YES' : 'NO'}
                </button>
              </div>
            </div>

            <div className='mb-1'>
              <button
                variant='primary'
                size='sm'
                onClick={this.handleCRUDUnitOfMeasure}
                disabled={this.state.isCRUDButtonDisable}
              >
                {CRUDButtonName}
              </button>
            </div>
          </form>
          <br />
        </div>
        {renderUnitOfMeasures()}
      </div>
    );
  }
}

export default UOM;