import React, { Component } from 'react';
//Bootstrap
import { Button, Col, Container, Dropdown, DropdownButton, Form, Modal, Row, Table } from 'react-bootstrap';
// GraphQL
import { API, graphqlOperation } from 'aws-amplify';
import { v4 as uuidv4 } from 'uuid';
import { createUserProduct, updateUser, createVerification } from '../../../graphql/mutations';
import { onCreateVerification } from '../../../graphql/subscriptions';
import { listUsers } from '../../../graphql/queries';
import { graphql } from 'graphql';


export const listproductsAssignPF = /* GraphQL */ `
  query Listproducts(
    $filter: ModelProductFeatureFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listproducts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        isVerifable
        product {
          name
          description
          userProducts {
            items {
              id
              user {
                name
                role
                id
              }
            }
          }
        }
        featureID
        feature {
          id
          name
          description
          isVerifable
          featureTypeID
        }
        documents {
        items {
          status
            }
        }
        verifications {
            items {
              id
              userVerifiedID
              userVerifierID
              userVerifier {
                name
              }
            }
          }
      }
      nextToken
    }
  }
`;
export const listProductsAssign = /* GraphQL */ `
  query ListProducts(
    $filter: ModelProductFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProducts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        categoryID
        productFeatures {
          items {
            id
            product {
              userProducts {
                items {
                  id
                  user {
                    name
                    role
                    id
                  }
                }
              }
            }
            featureID
            feature {
              id
              name
              description
              isVerifable
              featureTypeID
            }
            documents {
              items {
                status
                  }
              }
            verifications {
              items {
                id
                userVerifiedID
                userVerifierID
                userVerifier {
                  name
                }
              }
            }  
          }
        }
        userProducts {
          items {
            id
            user {
              name
              role
              id
            }
          }
        }
        transactions {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export default class AssignPF extends Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [],
      usersCopy: [],
      products: [],
      showModalRole: false,
      userSelected: null,
      productselected: null,
    }
    this.loadUsers = this.loadUsers.bind(this)
    this.loadProducts = this.loadProducts.bind(this)
    this.handleSelectUser = this.handleSelectUser.bind(this)
    this.handleSelectProduct = this.handleSelectProduct.bind(this)
    this.handleAssignProduct = this.handleAssignProduct.bind(this)
  }
  componentDidMount = async() => {
    Promise.all([
      this.loadUsers(),
      this.loadProducts(),
  ])

    this.createVerificationListener = API.graphql(graphqlOperation(onCreateVerification))
    .subscribe({
        next: createdCategoryData => {
            this.loadProducts()
        }
    })
}
  async loadUsers() {
    let filter = {
        role: {
            eq: 'validator'
        }
      }
    const listUsersResults = await API.graphql({ query: listUsers, variables: { filter: filter}})
    this.setState({users: listUsersResults.data.listUsers.items, usersCopy: listUsersResults.data.listUsers.items})
  }
  async loadProducts() {
    const listproductsResults = await API.graphql({ query: listProductsAssign})
    let productTemplates = listproductsResults.data.listProducts.items.sort((a, b) => {
        let nameA = a.name.toUpperCase();
        let nameB = b.name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      })
    this.setState({products: productTemplates})
    }
  handleSelectUser(user){
    this.setState({userSelected: user})
  }
  handleSelectProduct(product){
    this.setState({productselected: product})
  }
  assignRole(user){
    this.handleSelectUser(user)
    this.setState({showModalRole: true})
  }
  async handleAssignProduct(){
    let existValidator = false
    this.state.productselected.productFeatures.items.map(pf =>{
      pf.verifications?.items?.map(v =>{
        if(v.userVerifier.name === this.state.userSelected.name) existValidator = true
      } )
    })
    if(!existValidator){
      let promises = []
        this.state.productselected.productFeatures.items.map(pf =>{
          if(pf.feature.isVerifable){
            let tempUserVerified
            pf.product.userProducts.items.map(up =>{ if(up.user.role === 'constructor') tempUserVerified = up.user.id })
            let tempVerification = {
              sign: 'test', //BORRAR
              userVerifierID: this.state.userSelected.id,
              userVerifiedID: tempUserVerified,
              productFeatureID: pf.id,
              createdOn: new Date().toISOString(),
              updatedOn: new Date().toISOString()
            }
            promises.push(API.graphql(graphqlOperation(createVerification, { input: tempVerification })))
            }
        })
        await Promise.all(promises)
    }else{
      alert('El validador ya tiene asignado ese Proyecto')
    }
    this.cleanState()
  }
  cleanState(){
    this.setState({
      showModalRole: false,
      userSelected: null,
      productselected: null,
    })
  }
  render() {
    let { usersCopy, products, userSelected, productselected } = this.state

    const renderUsers = () => {
      if(usersCopy.length > 0){
        return(
          <>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <h2 className='mr-5'>Users</h2> 
          </div>
          <Table  bordered hover style={{cursor: 'pointer'}}>
              <thead>
              <tr>
                  <th>Name</th>
                  <th>Role</th>
              </tr>
              </thead>
              <tbody>
                  {usersCopy?.map(user =>{ 
                      return(
                          <tr key={user.id} onClick={(e) => this.handleSelectUser(user)}>
                              <td>
                                  {user.name} 
                              </td>
                              <td>
                                  {user.role?
                                   user.role: 
                                    <Button
                                      size='sm' 
                                      onClick={(e) => this.assignRole(user)}>
                                      Assign role on DB
                                    </Button> 
                                  }
                              </td>
                          </tr>
                      )})}
              </tbody>
          </Table>
          </>
        )
      }
    }
    const renderProducts = () => {
      if(products.length > 0){
        return(
          <>
          <h2>Products</h2> 
          <Table  bordered hover style={{cursor: 'pointer'}}>
              <thead>
              <tr>
                  <th>Proyecto</th>
                  <th>Categoría</th>
                  <th>Verificadores</th>
              </tr>
              </thead>
              <tbody>
                  {products?.map(product =>{
                      let verificadores = []
                      product.productFeatures.items.map(pf=>{
                        pf.verifications.items.length > 0 && pf.verifications.items.map(v => !verificadores.includes(v.userVerifier.name) && verificadores.push(v.userVerifier.name))
                      })
                      return(
                          <tr key={product.id} onClick={(e) => this.handleSelectProduct(product)}>
                              <td>
                                  {product.name} 
                              </td>
                              <td>
                                  {product.categoryID} 
                              </td>
                              <td>
                                <ul style={{listStyle: 'none', padding: '0'}}>
                                  {verificadores.length > 0? verificadores.map(v => <li key={v}>{v}</li>) : 'Sin asignar'} 
                                </ul>
                              </td>
                          </tr>
                      )})}
              </tbody>
          </Table>
          </>
        )
      }
    }
    const renderUserProducts = () => {
      if(products.length > 0){
        return(
          <>
          <h2>Products</h2> 
          <Table  bordered hover style={{cursor: 'pointer'}}>
              <thead>
              <tr>
                  <th>Proyecto</th>
                  <th>Categoría</th>
                  <th>Verificadores</th>
              </tr>
              </thead>
              <tbody>
                  {products?.map(product =>{
                      let verificadores = []
                      product.productFeatures.items.map(pf=>{
                        pf.verifications.items.length > 0 && pf.verifications.items.map(v => !verificadores.includes(v.userVerifier.name) && verificadores.push(v.userVerifier.name))
                      })
                      return(
                          <tr key={product.id} onClick={(e) => this.handleSelectProduct(product)}>
                              <td>
                                  {product.name} 
                              </td>
                              <td>
                                  {product.categoryID} 
                              </td>
                              <td>
                                <ul style={{listStyle: 'none', padding: '0'}}>
                                  {verificadores.length > 0? verificadores.map(v => <li key={v}>{v}</li>) : 'Sin asignar'} 
                                </ul>
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
      <>
      <Container>
          <Container>
              <h2>Assign Product</h2>
              <Form>
                  <Row className='mb-2' >
                      <Form.Group as={Col}>
                          <Form.Label>User</Form.Label>
                          <Form.Control
                              type='text'
                              placeholder='Seleccionar un usuario'
                              value={this.state.userSelected !== null? this.state.userSelected.name : ''}
                              onChange={() => ''}
                               />
                      </Form.Group>
                      <Form.Group as={Col}>
                          <Form.Label>Proyecto</Form.Label>
                          <Form.Control
                              type='text'
                              placeholder='Seleccionar un proyecto'
                              value={this.state.productselected !== null? `${this.state.productselected.name} ` : ''}
                              onChange={() => ''} 
                              />
                      </Form.Group>
                  </Row>

                  <Row className='mb-1'>
                      <Button
                      variant='primary'
                      size='sm'
                      disabled={userSelected === null || productselected === null? true : false}
                      onClick={() => this.handleAssignProduct()}
                      >ASIGNAR VERIFICADOR</Button>
                  </Row>
              </Form>
          </Container>
          <Container style={{display: 'flex', height: '580px'}}>
                <Container style={{overflow: 'auto', width: '40%'}}>           
                    {renderUsers()}       
                </Container>
                <Container style={{overflow: 'auto'}}>           
                    {renderProducts()}
                </Container>
          </Container>
          <Container>
            {renderUserProducts()}
          </Container>
      </Container>
      </>
    )
  }
}
