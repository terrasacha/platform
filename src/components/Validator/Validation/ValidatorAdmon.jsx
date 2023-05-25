import React, { Component } from 'react';

//Bootstrap
import { Button, Card, Col, Container, Dropdown, DropdownButton, Form, Modal, Row, Table, Stack, Nav } from 'react-bootstrap';
import { ArrowRight, CheckCircle, HourglassSplit, XCircle } from 'react-bootstrap-icons';
import { v4 as uuidv4 } from 'uuid';
import Bootstrap from "../../common/themes";
import HeaderNavbar from '../../Investor/Navbars/HeaderNavbar';
// GraphQL
import { API, Auth, graphqlOperation } from 'aws-amplify';
import { createVerification, updateDocument, updateProductFeature, createVerificationComment } from '../../../graphql/mutations';
import { onUpdateDocument, onUpdateProductFeature, onCreateVerificationComment } from '../../../graphql/subscriptions';
export const listDocuments = /* GraphQL */ `
  query ListDocuments(
    $filter: ModelDocumentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDocuments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        data
        timeStamp
        docHash
        signedHash
        signed
        url
        signed
        signedHash
        isApproved
        status
        isUploadedToBlockChain
        documentTypeID
        documentType {
          id
          name
          description
          createdAt
          updatedAt
        }
        productFeatureID
        productFeature {
          id
          value
          isToBlockChain
          isVerifable
          order
          isOnMainCard
          productID
          featureID
          createdAt
          updatedAt
          feature {
            name
            id
            description
            featureType {
              id
              name
            }
          }
          product {
            id
            name
            category{
              name
            }
          }
          verifications {
            items {
              id
              userVerifierID
              userVerifier {
                name
              }
              userVerifiedID
              userVerified {
                name
              }
              updatedOn
              sign
              createdOn
              verificationComments {
                items {
                  comment
                  createdAt
                  id
                  isCommentByVerifier
                  verificationID
                }
              }
            }
          }
        }
        userID
        user {
          id
          name
          dateOfBirth
          isProfileUpdated
          addresss
          cellphone
          role
          status
          email
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
const queryUsers = `query GetProduct($id: ID!) {
  getProduct(id: $id) {
    id
    productFeatures {
      items {
        id
        value
        featureID
        feature {
          id
          name
          description
          defaultValue
          featureTypeID
        }
        verifications {
          items {
            id
            sign
            userVerifiedID
            userVerifierID
          }
        }
      }
      nextToken
    }
    userProducts {
      items {
        id
        isFavorite
        userID
        productID
        createdAt
        updatedAt
      }
      nextToken
    }
    createdAt
    updatedAt
  }
}
`

class ValidatorAdmon extends Component {
  constructor(props) {
    super(props)
    this.state = {
      actualUser: '',
      documents: [],
      documentsPending: [],
      otherDocuments: [],
      showPending: true,
      showOther: false,
      isShowProductDocuments: true,
      isShowUsers: false,
      showModalDocument: false,
      showModalComments: false,
      showModalValidate: false,
      showModalDetailsValidation: false,
      selectedDocument: null,
      selectedDocumentID: null,
      selectedProductValidation: null,
      selectedProductVerificationID: null,
      creatingVerification: false,
      users: [],
      verification: {
        id: '',
        createdOn: '',
        updatedOn: '',
        sign: '',
        userVerifierID: '',
        userVerifiedID: '',
        productFeatureID: '',
        documentStatus: '',
      },
      newVerificationComment: {
        verificationID: '',
        isCommentByVerifier: true,
        comment: '',
      }
    }
    this.changeHeaderNavBarRequest = this.changeHeaderNavBarRequest.bind(this)
    this.handleHideModalDocument = this.handleHideModalDocument.bind(this)
    this.handleHideModalComments = this.handleHideModalComments.bind(this)
    this.handleHideModalValidate = this.handleHideModalValidate.bind(this)
    this.handleHideModalDetailsValidation = this.handleHideModalDetailsValidation.bind(this)
    this.handleInputCreateVerificationComment = this.handleInputCreateVerificationComment.bind(this)
    this.handleInputValidate = this.handleInputValidate.bind(this)
    this.handleSelectProduct = this.handleSelectProduct.bind(this)
    this.handleSelectStatus = this.handleSelectStatus.bind(this)
    this.getVerificationId = this.getVerificationId.bind(this)
    this.logOut = this.logOut.bind(this)
  }

  componentDidMount = async () => {
    let actualUser = await Auth.currentAuthenticatedUser()
    actualUser = actualUser.attributes.sub
    this.setState({ actualUser: actualUser })
    await this.loadDocuments()
    await this.loadUsers()
    // Subscriptions
    // OnUpdate Document
    this.updateDocumentListener = API.graphql(graphqlOperation(onUpdateDocument))
      .subscribe({
        next: async updatedDocumentData => {
          await this.loadDocuments()

        }
      })
    // OnUpdate ProductFeature
    this.updateProductFeatureListener = API.graphql(graphqlOperation(onUpdateProductFeature))
      .subscribe({
        next: async updatedDocumentData => {
          await this.loadUsers()

        }
      })

    // OnCerate VerificationComment
    this.createDocumentListener = API.graphql(graphqlOperation(onCreateVerificationComment))
      .subscribe({
        next: async createdVerificationComment => {
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
    const listDocumentsResultAll = await API.graphql({ query: listDocuments})
    listDocumentsResultAll.data.listDocuments.items.sort((a, b) => (a.id > b.id) ? 1 : -1)
    this.setState({
      documents: listDocumentsResultAll.data.listDocuments.items,
    })
    const listDocumentsResult = await API.graphql({ query: listDocuments, variables: { filter: filter1 } })
    listDocumentsResult.data.listDocuments.items.sort((a, b) => (a.id > b.id) ? 1 : -1)
    this.setState({
      documentsPending: listDocumentsResult.data.listDocuments.items,
    })
    const listDocumentsResult2 = await API.graphql({ query: listDocuments, variables: { filter: filter2 } })
    listDocumentsResult2.data.listDocuments.items.sort((a, b) => (a.id > b.id) ? 1 : -1)
    this.setState({
      otherDocuments: listDocumentsResult2.data.listDocuments.items,
    })
  }
  async loadUsers() {
    const id = 'PRODUCT_USER_VALIDATION';
    const variables = { id };

    const listUsersResult = await API.graphql(graphqlOperation(queryUsers, variables));
    this.setState({ users: listUsersResult.data.getProduct.productFeatures.items })
  }
  async changeHeaderNavBarRequest(pRequest) {
    if (pRequest === 'product_documents') {
      this.setState({
        isShowProductDocuments: true,
        isShowUsers: false
      })
    }
    if (pRequest === 'users') {
      this.setState({
        isShowProductDocuments: false,
        isShowUsers: true
      })
    }
  }
  handleHideModalDocument() {
    this.setState({ showModalDocument: !this.state.showModalDocument })
  }
  handleHideModalComments() {
    this.setState({ showModalComments: !this.state.showModalComments })
  }
  handleHideModalValidate() {
    this.setState({ showModalValidate: !this.state.showModalValidate })
  }
  handleHideModalDetailsValidation() {
    this.setState({ showModalDetailsValidation: !this.state.showModalDetailsValidation })
  }
  handleSelectStatus(data) {
    if (data === 'pendingDoc') this.setState({ showPending: true, showOther: false, selectedProductValidation: null })
    if (data === 'approveRejectDoc') this.setState({ showPending: false, showOther: true, selectedProductValidation: null })
  }
  handleSelectProduct(product) {
    this.setState({ selectedProductValidation: product })
  }
  handleInputValidate(e) {
    if (e.target.name === 'sign') {
      this.setState(prevState => ({ verification: { ...prevState.verification, sign: e.target.value } }))
    }
    if (e.target.name === 'document_status') {

      this.setState(prevState => ({ verification: { ...prevState.verification, documentStatus: e.target.value } }))
    }
  }
  handleCreateVerification = async () => {
    if (this.state.selectedDocument) {
      this.setState({ creatingVerification: true })
      let docStatus = this.state.verification.documentStatus
      let tempNewVerification = this.state.verification
      delete tempNewVerification.documentStatus
      tempNewVerification.id = uuidv4().replaceAll('-', '_')
      tempNewVerification.createdOn = new Date().toISOString()
      tempNewVerification.updatedOn = new Date().toISOString()
      tempNewVerification.userVerifierID = this.state.actualUser
      tempNewVerification.userVerifiedID = this.state.selectedDocument.userID
      tempNewVerification.productFeatureID = this.state.selectedDocument.productFeature.id
      await API.graphql(graphqlOperation(createVerification, { input: tempNewVerification }))
      if (docStatus === 'Approve') {
        docStatus = {
          isApproved: true,
          status: 'accepted'
        }
      }
      else docStatus = {
        isApproved: false,
        status: 'denied'
      }

      await API.graphql(graphqlOperation(updateDocument,
        {
          input: {
            id: this.state.selectedDocument.id,
            isApproved: docStatus.isApproved,
            status: docStatus.status
          }
        }))
    }
    this.cleanState()
  }

  async handleInputCreateVerificationComment(e) {
    if (e.target.name === 'verificationComment') {
      await this.setState(prevState => ({
        newVerificationComment: { ...prevState.newVerificationComment, comment: e.target.value }
      }))
    }
  }

  async handleCreateVerificaionComment(e) {

    await this.setState(prevState => ({
      newVerificationComment: { ...prevState.newVerificationComment, verificationID: this.state.selectedProductVerificationID }
    }))

    let tempNewVerificationComment = this.state.newVerificationComment
    if (tempNewVerificationComment.comment != '') {
      await API.graphql(graphqlOperation(createVerificationComment, { input: tempNewVerificationComment }))
      await this.cleanNewVerificationComment()
    }
  }
  
  getVerificationId(document) {
    
    let verificationID = ''
    if (document.productFeature.verifications.items.length > 0) {
      document.productFeature.verifications.items.map(v => {
        if(v.userVerifierID === this.state.actualUser) {
          verificationID = v.id
          return
        }
      })
    }

    return verificationID
  }

  validateInfoUser = async (pfID, userVerifiedID) => {
    let tempNewVerification = {}
    tempNewVerification.id = uuidv4().replaceAll('-', '_')
    tempNewVerification.createdOn = new Date().toISOString()
    tempNewVerification.updatedOn = new Date().toISOString()
    tempNewVerification.userVerifierID = this.state.actualUser
    tempNewVerification.userVerifiedID = userVerifiedID
    tempNewVerification.productFeatureID = pfID
    await API.graphql(graphqlOperation(createVerification, { input: tempNewVerification }))
    let tempProductFeature = {
      id: pfID,
      value: 'verified'
    }
    await API.graphql(graphqlOperation(updateProductFeature, { input: tempProductFeature }))

    this.cleanState()
  }
  async logOut() {
    await Auth.signOut()
    window.location.href = "/"
    localStorage.removeItem('role')
  }
  cleanState = () => {
    this.setState({
      showModalDocument: false,
      showModalComments: false,
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

  cleanNewVerificationComment = () => {
    this.setState({
      newVerificationComment: {
        verificationID: '',
        isCommentByVerifier: true,
        comment: '',
      }
    })
  }

  render() {
    const renderValidations = () => {
      let documents = []
      if (this.state.showPending) documents = this.state.documentsPending
      if (this.state.showOther) documents = this.state.otherDocuments
      let products = documents.map(document => document.productFeature.product.name)
      products = products.reduce((acc, item) => {
        if (!acc.includes(item)) {
          acc.push(item);
        }
        return acc;
      }, [])
      if (this.state.selectedProductValidation) {
        documents = documents.filter(document => document.productFeature.product.name === this.state.selectedProductValidation)
      }
      if (this.state.isShowProductDocuments) {
        return (
          <Container className='mt-4'>

            <Row className="justify-content-md-center">
              <Col xs={2}>
                <h3>Proyectos</h3>
                <Container className='mt-5'>
                  {products?.map(product => <Card key={product} body className={product === this.state.selectedProductValidation ? 'cardContainerSelected' : 'cardContainer'} style={{ cursor: 'pointer' }} onClick={() => this.handleSelectProduct(product)}>{product}<ArrowRight /></Card>)}
                </Container>
              </Col>
              <Col xs={10}>
                <div>
                  <h3>Documentación</h3>
                  <DropdownButton size='sm' variant='outline-primary' title='By status'>
                    <Dropdown.Item as="button" onClick={() => this.handleSelectStatus('pendingDoc')}>Documentación pendiente</Dropdown.Item>
                    <Dropdown.Item as="button" onClick={() => this.handleSelectStatus('approveRejectDoc')}>Documentación aceptada/rechazada</Dropdown.Item>
                  </DropdownButton>
                </div>
                <Table striped hover className='mt-4'>
                  <thead>
                    <tr>
                      <th>Proyecto</th>
                      <th>Categoría</th>
                      <th>Feature</th>
                      <th>Estado</th>
                      <th>Documento</th>
                      <th>Commentarios</th>
                      <th>{this.state.showPending ? 'Validate' : 'Validation Details'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map(document => (
                      <tr key={document.id}>
                        <td>{document.productFeature.product.name}</td>
                        <td>{document.productFeature.product.category.name}</td>
                        <td>{document.productFeature.feature.description.split('.')[0]}</td>
                        <td>{document.status === 'pending' ? <HourglassSplit size={25} color='grey' /> :
                          document.status === 'accepted' ? <CheckCircle size={25} color='#449E48' /> : <XCircle size={25} color='#CC0000' />
                        }
                        </td>
                        <td>
                          <Button variant="outline-primary" size='sm' onClick={() => this.setState({ showModalDocument: true, selectedDocument: document })}>Ver documentación</Button>
                        </td>
                        <td>
                          <Button variant="outline-primary" size='sm' onClick={() => this.setState({ showModalComments: true, selectedDocument: document, selectedDocumentID: document.id, selectedProductVerificationID: this.getVerificationId(document) })}>See comments</Button>
                        </td>
                        <td>
                          {this.state.showPending ?
                            <Button variant="outline-primary" size='sm' onClick={() => this.setState({ showModalValidate: true, selectedDocument: document })}>Validar</Button> :
                            <Button variant="outline-primary" size='sm' onClick={() => this.setState({ showModalDetailsValidation: true, selectedDocument: document })}>Detalles</Button>}
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
    }
    const modalDocument = () => {
      if (this.state.showModalDocument) {
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

    const modalComments = () => {
      if (this.state.showModalComments) {
        return (
          <Modal
            show={this.state.showModalComments}
            onHide={(e) => this.handleHideModalComments()}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                { this.state.selectedDocument.productFeature.feature.name}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {
                this.state.selectedDocument.productFeature.verifications.items.length > 0 ? this.state.selectedDocument.productFeature.verifications.items.filter(v => v.userVerifierID === this.state.actualUser)[0].verificationComments.items.sort(function (a, b) {
                  return new Date(a.createdAt) - new Date(b.createdAt);
                }).map(vc => {
                  return (
                    <p key={vc.id}>{vc.createdAt} ({vc.isCommentByVerifier === true ? "Tu" : "Constructor"}) {vc.comment}</p>
                  )
                }) : <p>Este documento aun no registra comentarios</p>

              }
              <Stack direction="horizontal" gap={2}>
                <Form.Control
                  className="me-auto"
                  type='text'
                  placeholder='Escribe un comentario aqui ...'
                  name='verificationComment'
                  value={this.state.newVerificationComment.comment}
                  onChange={(e) => this.handleInputCreateVerificationComment(e)} />
                <div className="vr" />
                <Button
                  variant="secondary"
                  onClick={(e) => this.handleCreateVerificaionComment(e)}
                >Enviar comentario</Button>
              </Stack>
            </Modal.Body>
          </Modal>
        )
      }
    }
    const modalDetailsValidation = () => {
      if (this.state.showModalDetailsValidation) {
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
                    <th>Product </th>
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
      if (this.state.showModalValidate) {
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
                  <div style={{ display: 'flex', justifyContent: 'space-around' }}>
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
                      {['Approve', 'Denied'].map((op) => <option value={op} key={op}>{op}</option>)}
                    </Form.Select>
                    <Button
                      variant="primary"
                      disabled={this.state.creatingVerification ? true : false}
                      style={{ marginLeft: '40px' }}
                      onClick={() => this.handleCreateVerification()}
                    >{this.state.creatingVerification ? 'Creating...' : 'Confirm'}</Button>
                  </div>
                </Card.Body>
              </Card>
            </Modal.Body>
          </Modal>
        )
      }
    }
    return (
      <Container style={{ paddingTop: 70, minHeight: '100vh' }}>
        <HeaderNavbar logOut={this.logOut} changeHeaderNavBarRequest={this.changeHeaderNavBarRequest}></HeaderNavbar>
        {renderValidations()}
        {modalDocument()}
        {modalComments()}
        {modalVerification()}
        {modalDetailsValidation()}
      </Container>
    )
  }
}
export default ValidatorAdmon