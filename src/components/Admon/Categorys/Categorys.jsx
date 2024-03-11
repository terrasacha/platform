import React, { Component } from 'react'
// Amplify
// import '@aws-amplify/ui-react/styles.css'
// Bootstrap
import  Button  from '../../ui/Button';
import  Col  from '../../ui/Col';
import  Container  from '../../ui/Container';
import  Form  from '../../ui/Form';
import  Row  from '../../ui/Row';
import  Table  from '../../ui/Table';
// GraphQL
import { API, graphqlOperation } from 'aws-amplify'
import { createCategory, updateCategory } from '../../../graphql/mutations'
import { listCategories } from '../../../graphql/queries'
import { onCreateCategory, onUpdateCategory } from '../../../graphql/subscriptions'

class Categorys extends Component {

    constructor(props) {
        super(props)
        this.state = {
            categorys: [],
            CRUDButtonName: 'CREATE',
            isCRUDButtonDisable: true,
            newCategory: {   id: '',
                            name: ''
                        },
        }
        this.handleOnChangeInputForm = this.handleOnChangeInputForm.bind(this)
        this.handleCRUDCategory = this.handleCRUDCategory.bind(this)
        this.handleLoadEditCategory = this.handleLoadEditCategory.bind(this)
    }

    componentDidMount = async () => {
        await this.loadCategorys()

        // Subscriptions
        // OnCreate Category
        this.createCategoryListener = API.graphql(graphqlOperation(onCreateCategory))
        .subscribe({
            next: async (createdCategoryData) => {
                await this.loadCategorys() 
            }
        })

        // OnUpdate Category
        this.updateCategoryListener = API.graphql(graphqlOperation(onUpdateCategory))
        .subscribe({
            next: updatedCategoryData => {
                let tempCategorys = this.state.categorys.map((mapCategory) => {
                    if (updatedCategoryData.value.data.onUpdateCategory.id === mapCategory.id) {
                        return updatedCategoryData.value.data.onUpdateCategory
                    } else {
                        return mapCategory
                    }
                })
                // Ordering categorys by name
                tempCategorys.sort((a, b) => (a.name > b.name) ? 1 : -1)
                this.setState((state) => ({categorys: tempCategorys}))
            }
        })

    }
    componentWillUnmount() {
      }

    async loadCategorys() {
        const listCategoriesResult = await API.graphql(graphqlOperation(listCategories))
        listCategoriesResult.data.listCategories.items.sort((a, b) => (a.name > b.name) ? 1 : -1)
        this.setState({categorys: listCategoriesResult.data.listCategories.items})
    }

    handleOnChangeInputForm = async(event) => {
        let tempNewCategory = this.state.newCategory
        if (event.target.name === 'category.name') {
            tempNewCategory.name = event.target.value.toUpperCase()
            if(this.state.CRUDButtonName !== 'UPDATE'){
                tempNewCategory.id = tempNewCategory.name.replaceAll(' ','_')
            }
        }
        this.setState({newCategory: tempNewCategory})
        this.validateCRUDCategory()
    }

    async validateCRUDCategory() {
        if (this.state.newCategory.name !== '') {
            this.setState({isCRUDButtonDisable: false})
        }
    }
    
    async handleCRUDCategory() {
        let tempNewCategory = this.state.newCategory

        if (this.state.CRUDButtonName === 'CREATE') {
            await API.graphql(graphqlOperation(createCategory, { input: tempNewCategory }))
            await this.cleanCategoryOnCreate()
        }

        if (this.state.CRUDButtonName === 'UPDATE') {
            let tempNewCategory = {
                id: this.state.newCategory.id,
                name: this.state.newCategory.name
            }
            await API.graphql(graphqlOperation(updateCategory, { input: tempNewCategory }))
            await this.cleanCategoryOnCreate()
        }
    }
    

    handleLoadEditCategory= async(category, event) => {

        this.setState({
            newCategory:  category,
            CRUDButtonName: 'UPDATE',
            isCRUDButtonDisable: false
        })
        this.validateCRUDCategory()
    }

    async cleanCategoryOnCreate() {
         this.setState({
            CRUDButtonName: 'CREATE',
            isCRUDButtonDisable: true,
            newCategory: {   id: '',
                            name: ''
                        }
        })
    }
    
    // RENDER
    render() {
        // State Variables
        let { categorys, newCategory, CRUDButtonName } = this.state;
    
        const renderCategorys = () => {
          if (categorys.length > 0) {
            return (
              <div className="container mx-auto">
                <table className="table-auto w-full border-collapse border border-gray-700">
                  <thead>
                    <tr>
                      <th className="border border-gray-700 px-4 py-2">ID</th>
                      <th className="border border-gray-700 px-4 py-2">Name</th>
                      <th className="border border-gray-700 px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categorys.map((category) => (
                      <tr key={category.id} className="border border-gray-700">
                        <td className="border border-gray-700 px-4 py-2">{category.id}</td>
                        <td className="border border-gray-700 px-4 py-2">{category.name}</td>
                        <td className="border border-gray-700 px-4 py-2">
                          <button
                            className="btn-yellow hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={(e) => this.handleLoadEditCategory(category, e)}
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
          <div className="container mx-auto">
            <div className="container">
              <h2 className="text-2xl font-bold mb-4">
                {CRUDButtonName} Categoría: {newCategory.name}
              </h2>
              <form>
                <div className="mb-4">
                  <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="categoryName"
                    className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder="Ex. NUEVA CATEGORÍA"
                    name="category.name"
                    value={newCategory.name}
                    onChange={(e) => this.handleOnChangeInputForm(e)}
                  />
                </div>

                <div className="mb-2">
                  <button
                    type="button"
                    className="btn-yellow hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                    onClick={this.handleCRUDCategory}
                    disabled={this.state.isCRUDButtonDisable}
                  >
                    {CRUDButtonName}
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-4">
              {renderCategorys()}
            </div>
          </div>

        );
      }
    }

export default Categorys