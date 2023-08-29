import React, { Component } from 'react'

//Bootstrap
import { Button, Card, Col, Container, Dropdown, DropdownButton, Form, Modal, Row, Table, Stack } from 'react-bootstrap'
import InputGroup from 'react-bootstrap/InputGroup'
import { ArrowRight, CheckCircle, HourglassSplit, XCircle } from 'react-bootstrap-icons'
import { v4 as uuidv4 } from 'uuid'
import HeaderNavbar from '../../Investor/Navbars/HeaderNavbar'
// GraphQL
import { API, Auth, graphqlOperation, Storage } from 'aws-amplify'
import { createVerification, updateDocument, updateProductFeature, createVerificationComment, updateProduct, createProductFeature } from '../../../graphql/mutations'
import { onUpdateDocument, onUpdateProductFeature, onCreateVerificationComment, onCreateProductFeature } from '../../../graphql/subscriptions'
import { listFeatures } from '../../../graphql/queries'
import Select from 'react-select'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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
        productFeatureID
        productFeature {
          id
          value
          isToBlockChain
          order
          isOnMainCard
          productID
          featureID
          createdAt
          updatedAt
          feature {
            name
            id
            isVerifable
            description
            featureType {
              id
              name
            }
          }
          product {
            id
            name
            transactions{
              items {
                id
              }
            }
            category{
              name
            }
            productFeatures {
              items {
                id
                featureID
                value
              }
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
`
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
      tokenPrices: {},
      tokenNames: {},
      amountTokens: {},
      documentsPending: [],
      otherDocuments: [],
      featuresVerifables: [],
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
    await this.loadFeatures()
    await this.loadTokenPrices()
    await this.loadTokenNames()
    await this.loadAmountTokens()
    // Subscriptions
    this.updateDocumentListener = API.graphql(graphqlOperation(onUpdateDocument))
      .subscribe({
        next: async updatedDocumentData => {
          await this.loadDocuments()

        }
      })
    this.updateProductFeatureListener = API.graphql(graphqlOperation(onUpdateProductFeature))
      .subscribe({
        next: async updatedDocumentData => {
          await this.loadUsers()

        }
      })

    this.createDocumentListener = API.graphql(graphqlOperation(onCreateVerificationComment))
      .subscribe({
        next: async createdVerificationComment => {
          await this.loadDocuments()
        }
      })
    this.createProductFeatureListener = API.graphql(graphqlOperation(onCreateProductFeature))
      .subscribe({
        next: async createdproductFeature => {
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
    let documentsByVerificatorAll= []
    listDocumentsResultAll.data.listDocuments.items.map(doc => doc.productFeature?.verifications?.items.map(v =>{if(v.userVerifierID === this.state.actualUser) documentsByVerificatorAll.push(doc)}))
    this.setState({
      documents: documentsByVerificatorAll,
    })
    const listDocumentsResult = await API.graphql({ query: listDocuments, variables: { filter: filter1 } })
    listDocumentsResult.data.listDocuments.items.sort((a, b) => (a.id > b.id) ? 1 : -1)
    let documentsByVerificatorFilter1= []
    listDocumentsResult.data.listDocuments.items.map(doc => doc.productFeature?.verifications?.items.map(v =>{if(v.userVerifierID === this.state.actualUser) documentsByVerificatorFilter1.push(doc)}))
    this.setState({
      documentsPending: documentsByVerificatorFilter1,
    })
    const listDocumentsResult2 = await API.graphql({ query: listDocuments, variables: { filter: filter2 } })
    listDocumentsResult2.data.listDocuments.items.sort((a, b) => (a.id > b.id) ? 1 : -1)
    let documentsByVerificatorFilter2= []
    listDocumentsResult2.data.listDocuments.items.map(doc => doc.productFeature.verifications.items.map(v =>{if(v.userVerifierID === this.state.actualUser) documentsByVerificatorFilter2.push(doc)}))
    this.setState({
      otherDocuments: documentsByVerificatorFilter2,
    })
  }
  async loadUsers() {
    const id = 'PRODUCT_USER_VALIDATION'
    const variables = { id }

    const listUsersResult = await API.graphql(graphqlOperation(queryUsers, variables))
    this.setState({ users: listUsersResult.data.getProduct?.productFeatures?.items })
  }
  async loadFeatures(){
    let filterIsVerifable = {
      isVerifable: {
        eq: true
      }
    }
    const listfeaturesVerifablesResult = await API.graphql({ query: listFeatures, variables: { filter: filterIsVerifable } })
    const listfeaturesVerifables = listfeaturesVerifablesResult.data.listFeatures.items.map(feature => ({
      label: feature.name,
      value: feature.id
    }))
    this.setState({featuresVerifables: listfeaturesVerifables})
  }
  loadTokenPrices(){
    let documents = []
    if (this.state.showPending) documents = this.state.documentsPending
    if (this.state.showOther) documents = this.state.otherDocuments
      let products = []
      documents.map(document => document.productFeature.verifications.items.map(v => {
        if(v.userVerifierID === this.state.actualUser){
          !products.includes(document.productFeature.product.id) && products.push(document.productFeature.product)
        }
      }))
      const productsUnicos = Object.values(products.reduce((acc, product) => {
        acc[product.id] = product
        return acc
      }, {}))
      let tokenPrices = {} 
      productsUnicos.map(product => tokenPrices[product.id] = product.productFeatures.items.filter(pf => pf.featureID === 'GLOBAL_TOKEN_PRICE')[0]?.value?  product.productFeatures.items.filter(pf => pf.featureID === 'GLOBAL_TOKEN_PRICE')[0]?.value : '')
      this.setState({tokenPrices: tokenPrices})
  }
  loadTokenNames(){
    let documents = []
    if (this.state.showPending) documents = this.state.documentsPending
    if (this.state.showOther) documents = this.state.otherDocuments
      let products = []
      documents.map(document => document.productFeature.verifications.items.map(v => {
        if(v.userVerifierID === this.state.actualUser){
          !products.includes(document.productFeature.product.id) && products.push(document.productFeature.product)
        }
      }))
      const productsUnicos = Object.values(products.reduce((acc, product) => {
        acc[product.id] = product
        return acc
      }, {}))
      let tokenNames = {} 
      productsUnicos.map(product => tokenNames[product.id] = product.productFeatures.items.filter(pf => pf.featureID === 'GLOBAL_TOKEN_NAME')[0]?.value?  product.productFeatures.items.filter(pf => pf.featureID === 'GLOBAL_TOKEN_NAME')[0]?.value : '')
      this.setState({tokenNames: tokenNames})
  }
  loadAmountTokens(){
    let documents = []
    if (this.state.showPending) documents = this.state.documentsPending
    if (this.state.showOther) documents = this.state.otherDocuments
      let products = []
      documents.map(document => document.productFeature.verifications.items.map(v => {
        if(v.userVerifierID === this.state.actualUser){
          !products.includes(document.productFeature.product.id) && products.push(document.productFeature.product)
        }
      }))
      const productsUnicos = Object.values(products.reduce((acc, product) => {
        acc[product.id] = product
        return acc
      }, {}))
      let amountTokens = {} 
      productsUnicos.map(product => amountTokens[product.id] = product.productFeatures.items.filter(pf => pf.featureID === 'GLOBAL_AMOUNT_OF_TOKENS')[0]?.value?  product.productFeatures.items.filter(pf => pf.featureID === 'GLOBAL_AMOUNT_OF_TOKENS')[0]?.value : '')
      this.setState({amountTokens: amountTokens})
  }
  handleTokenPriceChange = (event, product) => {
    const newTokenPrices = { ...this.state.tokenPrices }
    newTokenPrices[product.id] = event.target.value
    this.setState({ tokenPrices: newTokenPrices })
  }
  handleTokenNameChange = (event, product) => {
    const newName = event.target.value
    const regexInputTokenName = /^[a-zA-Z0-9\-]{0,32}$/
  
    if (regexInputTokenName.test(newName)) {
      const newTokenNames = { ...this.state.tokenNames }
      newTokenNames[product.id] = newName
      this.setState({ tokenNames: newTokenNames })
    } else {
      console.log("Nombre de token no válido")
    }
  }
  
  handleAmountOfTokens = (event, product) => {
    const newAmountTokens = { ...this.state.amountTokens }
    newAmountTokens[product.id] = event.target.value
    this.setState({ amountTokens: newAmountTokens })
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
      //Me fijo si el proyecto el cual estoy verificando tiene o no algun doc aceptado para ponerlo en on_verification
      let putProductOnV = {onVerificacion: false, productID: this.state.selectedDocument.productFeature.product.id}
      this.state.otherDocuments?.map(doc =>{
        if(doc.productFeature.product.id === putProductOnV.productID) return putProductOnV.onVerificacion === true
      })
      !putProductOnV.onVerificacion && await API.graphql(graphqlOperation(updateProduct,
        {
          input: {
            id: putProductOnV.productID,
            status: 'on_verification'
          }
        }))
      //Me fijo si es el ultimo doc que falta del proyecto para ponerlo en verified
      let putProductVerified = {verify: false, productID: this.state.selectedDocument.productFeature.product.id}
      let leftDocs = this.state.documentsPending?.filter(doc => doc.productFeature.product.id === putProductVerified.productID)
      if(leftDocs?.length === 1) putProductVerified.verify = true 
      let acceptedDocs = true 
      this.state.otherDocuments?.map(doc =>{ if(doc.productFeature.product.id === putProductVerified.productID && doc.status === 'denied') return acceptedDocs = false})
      putProductVerified.verify && docStatus.status === 'accepted' && acceptedDocs && await API.graphql(graphqlOperation(updateProduct,
        {
          input: {
            id: putProductOnV.productID,
            status: 'verified'
          }
        }))
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
  async handleOnSelectFeature(event,product) {
    let input = {
      value: '',
      isToBlockChain: false,
      isOnMainCard: false,
      productID: product.id,
      featureID: event.value,
    }
    const result = await API.graphql(graphqlOperation(createProductFeature, { input: input }))
    this.notify(input.featureID, product.name)
  }
  notify = (featureID, productName) =>{
    toast.success(`${featureID} creado para ${productName}`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        })
}
  notifyAssignTokenPrice = (product, tokenPrice) =>{
    toast.success(`Nuevo precio para ${product}. $${tokenPrice}`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        })
}
  notifyAssignTokenName = (product, tokenName) =>{
    toast.success(`Nuevo nombre de token para ${product}. ${tokenName}`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        })
}
  notifyAssignAmountTokens = (product, tokenName) =>{
    toast.success(`Cantidad de tokens actualizada para   ${product}. ${tokenName}`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        })
}
  handleDownload = async (doc) => {
    try {
      
      const arrayURLSlash = doc.url.split('/')
      if (arrayURLSlash.length > 2) {
        const projectIDURL = arrayURLSlash[arrayURLSlash.length-2]
        const fileSrc = arrayURLSlash[arrayURLSlash.length-1]
        // let id = doc.url.split('/').pop()
        const key = projectIDURL + '/'+ fileSrc
        // const config = {
        //   level: 'protected',
        //   download: true, 
        //   expires: 300, 
        //   identityId: this.state.actualUser,
        //   validateObjectExistence: false
        // }

        const config = {
          download: true, 
          expires: 300, 
          validateObjectExistence: false
        }
        const response = await Storage.get(key, config)
        // const response = await Storage.get(key, { download: true })
        // Si el archivo se descargó correctamente, puedes crear un enlace para el usuario
        const url = URL.createObjectURL(response.Body)
        const link = document.createElement('a')
        link.href = url
        link.download = key
        link.click()
      }
    } catch (error) {
      console.log('Error al descargar el archivo:', error)
    }
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
  async updateTokenPrice(product){
    const tieneTokenValue = product.productFeatures.items.some(pf => pf.featureID === 'GLOBAL_TOKEN_PRICE')
    if(tieneTokenValue){
      let tokenPricePF = product.productFeatures.items.filter(pf =>  pf.featureID === 'GLOBAL_TOKEN_PRICE')[0].id
      let tempProductFeature = {
        id: tokenPricePF,
        value: this.state.tokenPrices[product.id]
      }
      API.graphql(graphqlOperation(updateProductFeature, { input: tempProductFeature }))
    }else{
      let tempProductFeature = {
        value: this.state.tokenPrices[product.id],
        isToBlockChain: false,
        isOnMainCard: false,
        productID: product.id,
        featureID: 'GLOBAL_TOKEN_PRICE',
      }
      API.graphql(graphqlOperation(createProductFeature , { input: tempProductFeature }))

    }
    this.notifyAssignTokenPrice(product.name, this.state.tokenPrices[product.id])
    await this.loadDocuments()
}
  async updateTokenName(product){
    const tieneTokenValue = product.productFeatures.items.some(pf => pf.featureID === 'GLOBAL_TOKEN_NAME')
    if(tieneTokenValue){
      let tokenPricePF = product.productFeatures.items.filter(pf =>  pf.featureID === 'GLOBAL_TOKEN_NAME')[0].id
      let tempProductFeature = {
        id: tokenPricePF,
        value: this.state.tokenNames[product.id]
      }
      API.graphql(graphqlOperation(updateProductFeature, { input: tempProductFeature }))
    }else{
      let tempProductFeature = {
        value: this.state.tokenNames[product.id],
        isToBlockChain: false,
        isOnMainCard: false,
        productID: product.id,
        featureID: 'GLOBAL_TOKEN_NAME',
      }
      API.graphql(graphqlOperation(createProductFeature , { input: tempProductFeature }))

    }
    this.notifyAssignTokenName(product.name, this.state.tokenNames[product.id])
    await this.loadDocuments()
}
  async updateAmountTokens(product){
    const tieneAmountTokens = product.productFeatures.items.some(pf => pf.featureID === 'GLOBAL_AMOUNT_OF_TOKENS')
    if(tieneAmountTokens){
      let tokenPricePF = product.productFeatures.items.filter(pf =>  pf.featureID === 'GLOBAL_AMOUNT_OF_TOKENS')[0].id
      let tempProductFeature = {
        id: tokenPricePF,
        value: this.state.amountTokens[product.id]
      }
      API.graphql(graphqlOperation(updateProductFeature, { input: tempProductFeature }))
    }else{
      let tempProductFeature = {
        value: this.state.amountTokens[product.id],
        isToBlockChain: false,
        isOnMainCard: false,
        productID: product.id,
        featureID: 'GLOBAL_AMOUNT_OF_TOKENS',
      }
      API.graphql(graphqlOperation(createProductFeature , { input: tempProductFeature }))

    }
    this.notifyAssignAmountTokens(product.name, this.state.amountTokens[product.id])
    await this.loadDocuments()
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
      let products = []
      documents.map(document => document.productFeature.verifications.items.map(v => {
        if(v.userVerifierID === this.state.actualUser){
          !products.includes(document.productFeature.product.id) && products.push(document.productFeature.product)
        }
      }))
      const productsUnicos = Object.values(products.reduce((acc, product) => {
        acc[product.id] = product
        return acc
      }, {}))
      productsUnicos.map(pu =>{ 
        if(pu.transactions.items. length > 0){
          pu.mutableName = true
        }else pu.mutableName = false} )
      if (this.state.selectedProductValidation) {
        documents = documents.filter(document => document.productFeature.product.name === this.state.selectedProductValidation.name)
      }
      if (this.state.isShowProductDocuments) {
        return (
          <Container className='mt-4'>

            <Row className="justify-content-md-center">
              <Col xs={3}>
                <h3>Proyectos</h3>
                <Container className='mt-5'>
                  {productsUnicos?.map(product => {
                    const featuresAvailables = this.state.featuresVerifables.filter(item2 => !product.productFeatures.items.some(item1 => item1.featureID === item2.value))
                    return(
                    <Card key={product.id} body  
                    style={{ cursor: 'pointer' }} 
                    onClick={() => this.handleSelectProduct(product)}>
                      {product.name}<ArrowRight />
                      <InputGroup className="mb-3">
                      <Form.Control
                        value={this.state.tokenPrices[product.id] || ''}
                        placeholder="Token price (USD)"
                        name='GLOBAL_TOKEN_PRICE'
                        aria-describedby="basic-addon2"
                        onChange={(event) => this.handleTokenPriceChange(event, product)} 
                      />
                        <Button variant="outline-success" id="button-addon2" onClick={(e) => this.updateTokenPrice(product)}>
                          Change
                        </Button>
                      </InputGroup>
                      <InputGroup className="mb-3">
                      <Form.Control
                        value={this.state.tokenNames[product.id] || ''}
                        placeholder="Token name"
                        disabled={product.mutableName}
                        name='GLOBAL_TOKEN_NAME'
                        aria-describedby="basic-addon2"
                        onChange={(event) => this.handleTokenNameChange(event, product)} 
                      />
                        <Button variant="outline-success" id="button-addon2" disabled={product.mutableName}  onClick={(e) => this.updateTokenName(product)}>
                          Change
                        </Button>
                      </InputGroup>
                      <InputGroup className="mb-3">
                      <Form.Control
                        value={this.state.amountTokens[product.id] || ''}
                        placeholder="Amount of Tokens"
                        name='GLOBAL_AMOUNT_OF_TOKENS'
                        aria-describedby="basic-addon2"
                        onChange={(event) => this.handleAmountOfTokens(event, product)} 
                      />
                        <Button variant="outline-success" id="button-addon2" onClick={(e) => this.updateAmountTokens(product)}>
                          Change
                        </Button>
                      </InputGroup>
                      <Select 
                        style={{ position: 'absolute', top: 0, left: 0, zIndex: 10 }}
                        options={featuresAvailables}
                        onChange={event => this.handleOnSelectFeature(event, product)} />
                    </Card>)}
                    )}
                </Container>  
              </Col>
              <Col xs={9}>
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
                          <Button variant="outline-primary" size='sm' onClick={() => this.handleDownload(document)}>Ver documentación</Button>
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
            aria-labelledby="contained-modal-title-vcenter "
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
                  return new Date(a.createdAt) - new Date(b.createdAt)
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
        <ToastContainer />
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