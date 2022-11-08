import React, { Component } from 'react'
//Bootstrap
import { Button, Card, Col, Container, Dropdown, DropdownButton, Form, Modal, Row, Table } from 'react-bootstrap'
import { ArrowRight } from 'react-bootstrap-icons'
// GraphQL
import { API, Auth, graphqlOperation } from 'aws-amplify'
import { v4 as uuidv4 } from 'uuid'
import { createDocument } from '../../../graphql/mutations'
import { getUser } from '../../../graphql/queries'
import { onCreateDocument } from '../../../graphql/subscriptions'

export default class Documents extends Component {
    constructor(props) {
        super(props)
        this.state = {
            documents: [],
            newDocument: {
                id: null,
                data: null,
                timeStamp: null,
                hash: '',
                url: '',
                signed: '',
                isApproved: false,
                status: 'pending',
                isUploadedToBlockChain: false,
                documentTypeID: '',
                productFeatureID: ''
            },
            userProductsDoc: [],
            showAllDocuments: true,
            showProductsWithoutDoc: false,
            productToShow: null,
            showModalDocument: false,
            productFeatureToAddDoc: null,
            fileToUpload: null,
            creatingDocument: false,
        }
        this.handleLoadUserProduct = this.handleLoadUserProduct.bind(this)
        this.handleCreateDocument = this.handleCreateDocument.bind(this)
        this.handleInputCreateDocument = this.handleInputCreateDocument.bind(this)
        this.handleHideModalDocument = this.handleHideModalDocument.bind(this)
    }

    componentDidMount = async () => {
/*         let actualUser = await  Auth.currentAuthenticatedUser()
        actualUser = actualUser.attributes.sub */
        await this.loadUserProducts()
            // Subscriptions
            // OnCreate Document
            this.createDocumentListener = API.graphql(graphqlOperation(onCreateDocument))
            .subscribe({
                next: createdDocumentData => {
                    let isOnCreateList = false;
                    this.state.documents.map((mapDocument) => {
                        if (createdDocumentData.value.data.onCreateDocument.id === mapDocument.id) {
                            isOnCreateList = true;
                        } 
                        return mapDocument
                    })
                    let tempDocuments = this.state.documents
                    let tempOnCreateDocument = createdDocumentData.value.data.onCreateDocument
                    if (!isOnCreateList) {
                        tempDocuments.push(tempOnCreateDocument)
                    }
                    this.setState((state) => ({documents: tempDocuments}))
                }
            })
    }
    async loadUserProducts() {
        let userResult = await API.graphql({ query: getUser, variables: { id: 'a5e0ea8d-95f6-4a8b-bd13-e28f9fa49934' }})
        console.log(userResult) 
        let profileDocument = userResult.data.getUser.role
        if(profileDocument === 'admon') profileDocument = 'ADMON_DOCUMENT'
        if(profileDocument === 'investor') profileDocument = 'INVESTOR_DOCUMENT'
        if(profileDocument === 'constructor') profileDocument = 'CONSTRUCTOR_DOCUMENT'
        let listUserProducts = userResult.data.getUser.userProducts.items
        listUserProducts.map(userProduct => userProduct.product)
        let listUserProductsDocs = listUserProducts.map(userProduct =>{
            let aux = 0
            for (let i = 0; i < userProduct.product.productFeatures.items.length; i++) {
                if(userProduct.product.productFeatures.items[i].feature.featureTypeID === profileDocument  ) aux++
            }
            if(aux > 0) return userProduct
            else return ''

        }).filter(userProduct => userProduct !== '')
        listUserProductsDocs.map(up =>{ 
            let productFeaturesFiltered = up.product.productFeatures.items.filter(productFeature => productFeature.feature.featureTypeID === profileDocument)
            up.product.productFeatures.items = productFeaturesFiltered
            return up
        })
        this.setState({
            userProductsDoc: listUserProductsDocs,})
    }
    
    handleLoadUserProduct = (userProduct) => {
        let userProductCopy = userProduct
        this.setState({productToShow: userProductCopy})
    }
    handleInputCreateDocument = (e) => {
        if(e.target.name === 'selected_documentType'){
            this.setState(prevState => ({newDocument: {...prevState.newDocument,documentTypeID: e.target.value}}))
        }
        if(e.target.name === 'selected_file'){
            this.setState({fileToUpload: e.target.value})
        }
    }
    handleCreateDocument = async() => {
        let tempNewDocument = this.state.newDocument
          this.setState({creatingDocument: true})
          // Creating image ID
          let imageId = ''
          let uploadImageResult = null
          let fileNameSplitByDotfileArray = this.state.fileToUpload.name.split('.')
          imageId = fileNameSplitByDotfileArray[0].replaceAll(' ', '_').replaceAll('-','_')
          // Getting extension
          let imageExtension = fileNameSplitByDotfileArray[fileNameSplitByDotfileArray.length-1]
          let imageName = imageId + '.' + imageExtension
          // Uploading image
          uploadImageResult = await Storage.put(imageName, this.state.fileToUpload, {
            level: "public/documents",
            contentType: "image/jpeg",
          });
          
          tempNewDocument.id = uuidv4().replaceAll('-','_')
          tempNewDocument.url = uploadImageResult.key
          tempNewDocument.timeStamp = Date.now()
          tempNewDocument.data = JSON.stringify({empty: ''})
          console.log(this.state.newDocument)
          await API.graphql(graphqlOperation(createDocument , { input: tempNewDocument }))
          this.cleanState()
    }
    handleHideModalDocument() {
        this.setState({showModalDocument: !this.state.showModalDocument, productFeatureToAddDoc: null})
    }
    cleanState = () => {
        this.setState({
            newDocument: {
                id: null,
                data: null,
                timeStamp: null,
                hash: '',
                url: '',
                signed: '',
                isApproved: false,
                status: 'pending',
                isUploadedToBlockChain: false,
                documentTypeID: '',
                productFeatureID: ''
            },
            productToShow: null,
            showModalDocument: false,
            productFeatureToAddDoc: null,
            fileToUpload: null,
            creatingDocument: false,
        })
    }
    
  render() {
    let {userProductsDoc, productToShow, productFeatureToAddDoc, showProductsWithoutDoc, showAllDocuments} = this.state

    const listDocumentationStatus = () => {
        if(showAllDocuments && userProductsDoc){
            return(
                <Container className='mt-4 '>
                    <h3>Your documentation</h3>
                    <Row className="justify-content-md-center">
                        <Col xs lg="9">
                            <Table striped hover className='mt-4'> 
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Feature</th>
                                        <th>Document Status</th>      
                                        <th>Upload Document</th>  
                                    </tr>
                                </thead>
                                <tbody>
                                    {userProductsDoc.map(userProduct =>(
                                        userProduct.product.productFeatures.items.map(pf => {
                                            return(
                                                <tr key={pf.id}>
                                                    <td>{pf.product.name}</td>
                                                    <td>{pf.feature.name}</td>
                                                    <td>{pf.documents.items.length > 0? pf.documents.items[0].status : 'Not document assigned' }</td>
                                                    <td>
                                                        {pf.documents.items.length > 0? 'Alredy upload' :
                                                        <Button variant="primary" size='sm' onClick={() => this.setState({showModalDocument: true, productFeatureToAddDoc: pf})}>Upload Document</Button>  }
                                                    </td>
                                                </tr>
                                            )
                                        }
                                        )
                                    ))}

                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Container>
            )
        }
    }
    const uploadDocumentation = () => {
        if(showProductsWithoutDoc){
            let userProductsDocCopy = userProductsDoc
        return (
            <Container className='mt-3'>
              <Row>
                  <Col xs={2}>
                          <h3>Products</h3>
                      <Container className='mt-5'>
                          {userProductsDocCopy?.map(userProduct => <Card key={userProduct.id} body className='mb-2' style={{cursor: 'pointer'}} onClick={() => this.handleLoadUserProduct(userProduct)}>{userProduct.product.name}<ArrowRight /></Card>)}
                      </Container>
                  </Col>
                  <Col xs={10}>
                            <h3>Products Documentation</h3>
                            {!productToShow? '' : 
                                <Card>
                                    <Card.Header as="h5">{productToShow.product.name}</Card.Header>
                                    <Card.Body>
                                        {productToShow.product.productFeatures.items.map(pf =>{
                                        if(pf.documents.items.length > 0){
                                            return null
                                        }
                                        return(
                                            <Card key={pf.id} className='mb-2'>
                                                <Card.Header>{pf.feature.featureTypeID.replace('_', ' ')}</Card.Header>
                                                <Card.Body>
                                                    <Card.Title>{pf.feature.name}</Card.Title>
                                                    <Card.Text>
                                                        {pf.feature.description}
                                                    </Card.Text>
                                                    <Button variant="primary" onClick={() => this.setState({showModalDocument: true, productFeatureToAddDoc: pf})}>Upload Document</Button>
                                                </Card.Body>
                                            </Card> 
                                        )
                                        })} 
                                    </Card.Body>
                                </Card>
                            }
                  </Col>
              </Row>
            </Container>
          )
        }
    }
    const modalDocument = () => {

        if (productFeatureToAddDoc !== null) {
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
                        {productFeatureToAddDoc?.feature.name}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className='mb-3'>
                        <Form.Group>
                            <Form.Label>Document type</Form.Label>
                            <Form.Select
                                type='text'
                                name='selected_documentType'
                                onChange={(e) => this.handleInputCreateDocument(e)}
                                >
                                {['-','documentType1', 'documentType2', 'documentType3', 'documentType4', 'documentType5', 'documentType6'].map(
                                    op => (<option value={op} key={op}>{op}</option>)
                                )}
                            </Form.Select>
                        <Form.Group >
                            <Form.Label>Choose file</Form.Label>
                            <Form.Control
                            type='file'
                            name='selected_file'
                            onChange={(e) => this.handleInputCreateDocument(e)}
                            />
                        </Form.Group>
                        </Form.Group>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button disabled onClick={(e) => this.handleCreateDocument()}>Upload Document</Button>
                </Modal.Footer>
            </Modal>
        )
        }
    }
    const dropDown = () => {
        return(
        <DropdownButton className='mt-3' title='Documentation'>
            <Dropdown.Item as="button" onClick={() =>this.setState({showProductsWithoutDoc: false, showAllDocuments: true, productToShow: null})}>See your documentation status</Dropdown.Item>
            <Dropdown.Item as="button" onClick={() =>this.setState({showProductsWithoutDoc: true, showAllDocuments: false})}>Upload documentation</Dropdown.Item>
          </DropdownButton>
        )
    }
    return (
        <>
            {dropDown()}
            {listDocumentationStatus()}
            {uploadDocumentation()}
            {modalDocument()}
        </>
    )
  }
}
