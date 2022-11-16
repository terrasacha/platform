import React, { Component } from 'react';
//Bootstrap
import { Button, Card, Col, Container, Dropdown, DropdownButton, Form, Modal, Row, Table } from 'react-bootstrap';
import { CheckCircle, HourglassSplit, XCircle } from 'react-bootstrap-icons';
import { v4 as uuidv4 } from 'uuid';
// GraphQL
import { API, Auth, graphqlOperation } from 'aws-amplify';
import { createVerification, updateDocument } from '../../../graphql/mutations';
import { listDocuments } from '../../../graphql/queries';
import { onUpdateDocument } from '../../../graphql/subscriptions';
export default class Validation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      actualUser: '',
      documentsPending: [],
      otherDocuments: [],
      showPending: true,
      showOther: false,
      showModalDocument: false,
      showModalValidate: false,
      showModalDetailsValidation: false,
      selectedDocument: null,
      creatingVerification: false,
      verification: {
        id: '',
        createdOn: '',
        updatedOn: '',
        sign: '',
        userVerifierID: '',
        userVerifiedID: '',
        productFeatureID: '',
        documentStatus: '',
      }
    }
    this.handleHideModalDocument = this.handleHideModalDocument.bind(this)
    this.handleHideModalValidate = this.handleHideModalValidate.bind(this)
    this.handleHideModalDetailsValidation = this.handleHideModalDetailsValidation.bind(this)
    this.handleInputValidate = this.handleInputValidate.bind(this)
}

  componentDidMount = async () => {
    let actualUser = await  Auth.currentAuthenticatedUser()
    actualUser = actualUser.attributes.sub
    this.setState({actualUser: actualUser})
    await this.loadDocuments()
    console.log(this.state.otherDocuments, 'otherDocuments')
    console.log(this.state.documentsPending, 'documentsPending')
    // Subscriptions
    // OnUpdate Document
    this.updateDocumentListener = API.graphql(graphqlOperation(onUpdateDocument))
    .subscribe({
        next: async updatedDocumentData => {
          await this.loadDocuments()
            
        }
    })
  }
  async loadDocuments() {
    let filter1 = {
      status: {
          eq: 'pending'
      }
    }
    let filter2 = {
      status: {
        notContains: 'pending'
      }
    }
    const listDocumentsResult = await API.graphql({ query: listDocuments, variables: { filter: filter1}})
    listDocumentsResult.data.listDocuments.items.sort((a, b) => (a.id > b.id) ? 1 : -1)
    this.setState({
      documentsPending: listDocumentsResult.data.listDocuments.items,
      })
    const listDocumentsResult2 = await API.graphql({ query: listDocuments, variables: { filter: filter2}})
    listDocumentsResult2.data.listDocuments.items.sort((a, b) => (a.id > b.id) ? 1 : -1)
    this.setState({
      otherDocuments: listDocumentsResult2.data.listDocuments.items,
      })
  }
  handleHideModalDocument() {
    this.setState({showModalDocument: !this.state.showModalDocument})
  }
  handleHideModalValidate() {
    this.setState({showModalValidate: !this.state.showModalValidate})
  }
  handleHideModalDetailsValidation() {
    this.setState({showModalDetailsValidation: !this.state.showModalDetailsValidation})
  }
  handleInputValidate(e) {
    if(e.target.name === 'sign'){
      this.setState(prevState => ({verification: {...prevState.verification,sign: e.target.value}}))
    }
    if(e.target.name === 'document_status'){

      this.setState(prevState => ({verification: {...prevState.verification,documentStatus: e.target.value}}))
    }
  }
  handleCreateVerification = async() => {
    if(this.state.selectedDocument){
      this.setState({creatingVerification: true})
      let docStatus = this.state.verification.documentStatus
      let tempNewVerification = this.state.verification
      delete tempNewVerification.documentStatus
      tempNewVerification.id = uuidv4().replaceAll('-','_')
      tempNewVerification.createdOn = new Date().toISOString()
      tempNewVerification.updatedOn = new Date().toISOString()
      tempNewVerification.userVerifierID = this.state.actualUser
      tempNewVerification.userVerifiedID = this.state.actualUser
      tempNewVerification.productFeatureID = this.state.selectedDocument.productFeature.id
      await API.graphql(graphqlOperation(createVerification , { input: tempNewVerification }))
      if(docStatus === 'Approve'){
        docStatus = {
          isApproved: true,
          status: 'accepted'
        }
      }
      else docStatus = {
              isApproved: false,
              status: 'denied'
            }

      await API.graphql(graphqlOperation(updateDocument ,
         { input: {
            id: this.state.selectedDocument.id,
            isApproved: docStatus.isApproved,
            status: docStatus.status
          } }))  
    }
    this.cleanState()
  }
  cleanState = () => {
    this.setState({
      showModalDocument: false,
      showModalValidate: false,
      selectedDocument: null,
      createVerification: false,
      verification: {
        id: '',
        createdOn: '',
        updatedOn: '',
        sign: '',
        userVerifierID: '',
        userVerifiedID: '',
        productFeatureID: '',
        documentStatus: '',
      }
    })
}

  render() {
    const renderValidations = () => {
/*       if(this.state.otherDocuments && this.state.documentsPending) */
      let documents = []
      if(this.state.showPending) documents = this.state.documentsPending
      if(this.state.showOther) documents = this.state.otherDocuments
      return(
        <Container className='mt-4'>
                    <Row className="justify-content-md-center">
                        <Col xs lg="9">
                          <div>
                            <h3>Documentation</h3>
                            <DropdownButton size='sm' variant='outline-primary' title='By status'>
                              <Dropdown.Item as="button" onClick={() =>this.setState({showPending: true, showOther: false})}>Pending Documentation</Dropdown.Item>
                              <Dropdown.Item as="button" onClick={() =>this.setState({showPending: false, showOther: true})}>Approve/Denied Documentation</Dropdown.Item>
                            </DropdownButton>
                          </div>
                            <Table striped hover className='mt-4'> 
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Feature</th>
                                        <th>Status</th>
                                        <th>Document</th>
                                        <th>{this.state.showPending?'Validate': 'Validation Details'}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                  {documents.map(document =>(
                                  <tr key={document.id}>
                                    <td>{document.productFeature.product.name}</td>
                                    <td>{document.productFeature.feature.name}</td>
                                    <td>{document.status === 'pending'? <HourglassSplit size={25} color='grey'/> : 
                                          document.status === 'accepted'? <CheckCircle size={25} color='#449E48'/> : <XCircle size={25} color='#CC0000'/>
                                        }
                                    </td>
                                    <td>
                                      <Button variant="outline-primary" size='sm' onClick={() => this.setState({showModalDocument: true, selectedDocument: document})}>See documentation</Button>
                                    </td>
                                    <td>
                                      {this.state.showPending?
                                        <Button variant="outline-primary" size='sm' onClick={() => this.setState({showModalValidate: true, selectedDocument: document})}>Validate</Button>: 
                                        <Button variant="outline-primary" size='sm' onClick={() => this.setState({showModalDetailsValidation: true, selectedDocument: document})}>Details</Button>}
                                      
                                    </td>
                                  </tr>
                                  ))}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Container>
      )
    }
    const modalDocument = () => {
      if(this.state.showModalDocument){
      return (
          <Modal
              show={this.state.showModalDocument}
              onHide={(e) => this.handleHideModalDocument()}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
              >
              <Modal.Header closeButton>
                  <Modal.Title id="contained-modal-title-vcenter">
                      {this.state.selectedDocument.productFeature.feature.name}
                  </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <img
                  className="d-block w-100"
                  src={this.state.selectedDocument.url}
                  alt={this.state.selectedDocument.id}
                  />
              </Modal.Body>
          </Modal>
      )
    }  
    }
    const modalDetailsValidation = () => {
      if(this.state.showModalDetailsValidation){
      return (
          <Modal
              show={this.state.showModalDetailsValidation}
              onHide={(e) => this.handleHideModalDetailsValidation()}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
              >
              <Modal.Header closeButton>
                  <Modal.Title id="contained-modal-title-vcenter">
                      {this.state.selectedDocument.productFeature.feature.name}
                  </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Table striped hover className='mt-4'>
                  <thead>
                      <tr>
                          <th>Product</th>
                          <th>Feature</th>
                          <th>userVerifierID</th>
                          <th>userVerifiedID</th>
                          <th>Sign</th>
                      </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{this.state.selectedDocument.productFeature.product.name}</td>
                      <td>{this.state.selectedDocument.productFeature.feature.name}</td>
                      <td>{this.state.selectedDocument.productFeature.verifications.items[0].userVerifier.name}</td>
                      <td>{this.state.selectedDocument.productFeature.verifications.items[0].userVerified.name}</td>
                      <td>{this.state.selectedDocument.productFeature.verifications.items[0].sign}</td>
                    </tr>
                  </tbody>
                </Table>
              </Modal.Body>
          </Modal>
      )
    }  
    }
    const modalVerification = () => {
      if(this.state.showModalValidate){
      return (
          <Modal
              show={this.state.showModalValidate}
              onHide={(e) => this.handleHideModalValidate()}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
              >
              <Modal.Header closeButton>
              </Modal.Header>
              <Modal.Body>
              <Card>
                <Card.Header as="h5">{this.state.selectedDocument.productFeature.feature.name}</Card.Header>
                  <Card.Body>
                      <Card.Text>
                        {this.state.selectedDocument.productFeature.feature.description}
                      </Card.Text>
                      <div style={{display: 'flex', justifyContent:'space-around'}}>
                        <Form.Control
                              type='text'  
                              name='sign'
                              placeholder='Firma'
                              value={this.state.verification.sign}
                              onChange={(e) => this.handleInputValidate(e)}
                              />
                        <Form.Select
                              type='text'
                              name='document_status'
                              onChange={(e) => this.handleInputValidate(e)}
                              >
                              <option>-</option>
                              {['Approve','Denied'].map((op) => <option value={op} key={op}>{op}</option>)}
                        </Form.Select>
                        <Button
                          variant="primary"
                          disabled={this.state.creatingVerification}
                          style={{marginLeft:'40px'}}
                          onClick={() => this.handleCreateVerification()}
                          >{this.state.creatingVerification?'Creating...': 'Confirm'}</Button>
                      </div>
                  </Card.Body>
                </Card>
              </Modal.Body>
          </Modal>
      )
    }  
  }
    return (
      <>
      {renderValidations()}
      {modalDocument()}
      {modalVerification()}
      {modalDetailsValidation()}
      </>
    )
  }
}