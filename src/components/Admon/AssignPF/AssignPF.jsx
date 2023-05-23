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


export const listProductFeaturesAssignPF = /* GraphQL */ `
  query ListProductFeatures(
    $filter: ModelProductFeatureFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProductFeatures(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
          isTemplate
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
export default class AssignPF extends Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [],
      usersCopy: [],
      productFeatures: [],
      showModalRole: false,
      userSelected: null,
      productFeatureSelected: null,
    }
    this.loadUsers = this.loadUsers.bind(this)
    this.loadProductFeatures = this.loadProductFeatures.bind(this)
    this.handleSelectUser = this.handleSelectUser.bind(this)
    this.handleSelectProduct = this.handleSelectProduct.bind(this)
    this.handleAssignProduct = this.handleAssignProduct.bind(this)
  }
  componentDidMount = async() => {
    Promise.all([
      this.loadUsers(),
      this.loadProductFeatures(),
  ])

    // OnCreate Category
    this.createVerificationListener = API.graphql(graphqlOperation(onCreateVerification))
    .subscribe({
        next: createdCategoryData => {
            this.loadProductFeatures()
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
  async loadProductFeatures() {
    const listProductFeaturesResults = await API.graphql({ query: listProductFeaturesAssignPF})
    let pfTemplates = listProductFeaturesResults.data.listProductFeatures.items.filter(pf => pf.feature.isTemplate)
    pfTemplates.sort((a, b) => {
        let nameA = a.product.name.toUpperCase();
        let nameB = b.product.name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      })
    this.setState({productFeatures: pfTemplates})
    }
  handleSelectUser(user){
    this.setState({userSelected: user})
  }
  handleSelectProduct(product){
    this.setState({productFeatureSelected: product})
  }
  assignRole(user){
    this.handleSelectUser(user)
    this.setState({showModalRole: true})
  }
  async handleAssignProduct(){
    let existUP = false
    this.state.productFeatureSelected.verifications?.items?.map(v =>{
        if(v.userVerifier.name === this.state.userSelected.name) existUP = true
    } )
    if(!existUP){
        /* type Verification @model {
            id: ID!
            createdOn: AWSDateTime
            updatedOn: AWSDateTime
            sign: String
            userVerifierID: ID @index(name: "byVerifierUser")
            userVerifier: User @belongsTo(fields: ["userVerifierID"])
            userVerifiedID: ID @index(name: "byVerifiedUser")
            userVerified: User @belongsTo(fields: ["userVerifiedID"])
            productFeatureID: ID! @index(name: "byProductFeature")
            productFeature: ProductFeature @belongsTo(fields: ["productFeatureID"])
            verificationComments: [VerificationComment] @hasMany(indexName: "byVerification", fields: ["id"])
          }
           */
    
        let tempUserVerified
        this.state.productFeatureSelected.product.userProducts.items.map(up =>{ if(up.user.role === 'constructor') tempUserVerified = up.user.id })
        let tempVerification = {
            userVerifierID: this.state.userSelected.id,
            userVerifiedID: tempUserVerified,
            productFeatureID: this.state.productFeatureSelected.id
        }
        await API.graphql(graphqlOperation(createVerification, { input: tempVerification }))
    }else{
      alert('El validador ya tiene asignado ese Product feature')
    }
    this.cleanState()
  }
  cleanState(){
    this.setState({
      showModalRole: false,
      userSelected: null,
      productFeatureSelected: null,
    })
  }
  render() {
    let { usersCopy, productFeatures, userSelected, productFeatureSelected } = this.state

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
      if(productFeatures.length > 0){
        return(
          <>
          <h2>Product Features</h2> 
          <Table  bordered hover style={{cursor: 'pointer'}}>
              <thead>
              <tr>
                  <th>Proyect</th>
                  <th>Feature</th>
                  <th>Tipo</th>
                  <th>Verificadores</th>
              </tr>
              </thead>
              <tbody>
                  {productFeatures?.map(pf =>{ 
                      return(
                          <tr key={pf.id} onClick={(e) => this.handleSelectProduct(pf)}>
                              <td>
                                  {pf.product.name} 
                              </td>
                              <td>
                                  {pf.feature.description.split('.')[0]} 
                              </td>
                              <td>
                                  {pf.feature.featureTypeID} 
                              </td>
                              <td>
                                <ul style={{listStyle: 'none', padding: '0'}}>
                                    {pf.verifications.items.length > 0? pf.verifications.items.map(v => <li>{v.userVerifier.name}</li>): 'Sin Asignar'}
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
      if(this.state.productFeatures.length > 0){
        return(
          <>
            <h2>User productFeatures</h2>
            <Table  bordered hover>
              <thead>
              <tr>
                  <th>Product</th>
                  <th>Description</th>
                  <th>Verificadores</th>
              </tr>
              </thead>
              <tbody>
                  {this.state.productFeatures?.map(pf =>{ 
                      return(
                          <tr key={pf.id}>
                              <td>
                                  {pf.product.name} 
                              </td>
                              <td>
                                  {pf.feature.description.split('.')[0]} 
                              </td>
                              <td>
                                <ul style={{listStyle: 'none', padding: '0'}}>
                                    {pf.verifications.items.length > 0? pf.verifications.items.map(v => <li>{v.userVerifier.name}</li>): 'Sin Asignar'}
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
                          <Form.Label>Product Feature</Form.Label>
                          <Form.Control
                              type='text'
                              placeholder='Seleccionar un product feature'
                              value={this.state.productFeatureSelected !== null? `${this.state.productFeatureSelected.feature.description.split('.')[0]} | ${this.state.productFeatureSelected.product.name} ` : ''}
                              onChange={() => ''} 
                              />
                      </Form.Group>
                  </Row>

                  <Row className='mb-1'>
                      <Button
                      variant='primary'
                      size='sm'
                      disabled={userSelected === null || productFeatureSelected === null? true : false}
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
