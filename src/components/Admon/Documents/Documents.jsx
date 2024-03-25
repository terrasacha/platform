import React, { Component } from 'react';

//Bootstrap
import  Button  from '../../ui/Button';
import  Card  from '../../ui/Card';
import  Col  from '../../ui/Col';
import  Container  from '../../ui/Container';
import  Dropdown  from '../../ui/Dropdown';
import  DropdownButton  from '../../ui/DropdownButton';
import  Form  from '../../ui/Form';
import  Modal  from '../../ui/Modal';
import  Row  from '../../ui/Row';
import  Table  from '../../ui/Table';

import { ArrowRight, CheckCircle, HourglassSplit, XCircle } from 'react-bootstrap-icons';
// import Bootstrap from "../../common/themes";
import './Documents.css';
// GraphQL
import { API, Auth, graphqlOperation, Storage } from 'aws-amplify';
import { v4 as uuidv4 } from 'uuid';
import { createDocument } from '../../../graphql/mutations';
import { getUser } from '../../../graphql/queries';
import { onCreateDocument } from '../../../graphql/subscriptions';
import URL from '../../common/_conf/URLS3';

class Documents extends Component {
    constructor(props) {
        super(props)
        this.state = {
            documents: [],
            actualUserID: null,
            newDocument: {
                id: null,
                data: null,
                timeStamp: null,
                docHash: '',
                url: '',
                signed: '',
                signedHash: '',
                isApproved: false,
                status: 'pending',
                isUploadedToBlockChain: false,
                productFeatureID: ''
            },
            userProductsDoc: [],
            loadingDocument: false,
            showAllDocuments: true,
            showProductsWithoutDoc: false,
            productToShow: null,
            showModalDocument: false,
            productFeatureToAddDoc: null,
            fileToUpload: null,
        }
        this.handleLoadUserProduct = this.handleLoadUserProduct.bind(this)
        this.handleCreateDocument = this.handleCreateDocument.bind(this)
        this.handleInputCreateDocument = this.handleInputCreateDocument.bind(this)
        this.handleHideModalDocument = this.handleHideModalDocument.bind(this)
    }

    componentDidMount = async () => {
        let actualUser = await  Auth.currentAuthenticatedUser()
        const actualUserID = actualUser.attributes.sub
        this.setState({
            actualUserID: actualUserID
        })
        await this.loadUserProducts(actualUserID)
        // Subscriptions
        // OnCreate Document
        this.createDocumentListener = API.graphql(graphqlOperation(onCreateDocument))
        .subscribe({
            next: async createdDocumentData => {
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
                await this.loadUserProducts(actualUserID)
                this.setState((state) => ({documents: tempDocuments}))
            }
        })
    }
    componentWillUnmount() {
        // this.createDocumentListener.unsubscribe();
      }
    async loadUserProducts(pActualUserID) {
        let userResult = await API.graphql({ query: getUser, variables: { id: pActualUserID }})
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
        this.setState({productToShow: userProduct})
    }
    handleInputCreateDocument = (e) => {

        if(e.target.name === 'selected_file'){
            const { target: { files } } = e;
            const [file,] = files || [];
            if (!file) {
                return
            }
            this.setState({fileToUpload: file})
        }
    }
    handleCreateDocument = async() => {
        let tempNewDocument = this.state.newDocument
          this.setState({loadingDocument: true})
          // Creating image ID
          let imageId = ''
          let uploadImageResult = null
          let fileNameSplitByDotfileArray = this.state.fileToUpload.name.split('.')
          imageId = fileNameSplitByDotfileArray[0].replaceAll(' ', '_').replaceAll('-','_')
          // Getting extension
          let imageExtension = fileNameSplitByDotfileArray[fileNameSplitByDotfileArray.length-1]
          let imageName = imageId + '.' + imageExtension
          // Uploading image TO DO  MOVE TO PRIVATE
          uploadImageResult = await Storage.put(imageName, this.state.fileToUpload, {
            level: "public/",
            contentType: "image/jpeg",
          });
          
          tempNewDocument.id = uuidv4().replaceAll('-','_')
          tempNewDocument.url = URL + uploadImageResult.key
          tempNewDocument.productFeatureID = this.state.productFeatureToAddDoc.id
          tempNewDocument.timeStamp = Date.now()
          tempNewDocument.data = JSON.stringify({empty: ''})
          tempNewDocument.userID = this.state.actualUserID
          await API.graphql(graphqlOperation(createDocument , { input: tempNewDocument }))
          console.log('document created')
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
                docHash: '',
                url: '',
                signed: '',
                signedHash: '',
                isApproved: false,
                status: 'pending',
                isUploadedToBlockChain: false,
                productFeatureID: ''
            },
            productToShow: null,
            showModalDocument: false,
            productFeatureToAddDoc: null,
            fileToUpload: null,
            loadingDocument: false,
        })
    }
    render() {
        let { userProductsDoc, productToShow, productFeatureToAddDoc, showProductsWithoutDoc, showAllDocuments } = this.state;
        console.log(userProductsDoc, 'userProductsDoc');
    
        const listDocumentationStatus = () => {
          if (showAllDocuments && userProductsDoc) {
            return (
              <div classname="container mt-4 container mx-auto sm:px-4">
              <h3>Your documentation</h3>
              <div className="flex justify-center">
                <div className="w-9/12">
                  <table className="table-hover mt-4 w-full">
                    <thead>
                      <tr>
                        <th className="border p-2">Product</th>
                        <th className="border p-2">Feature</th>
                        <th className="border p-2">Document Status</th>
                        <th className="border p-2">Doc Hash</th>
                        <th className="border p-2">Sign</th>
                        <th className="border p-2">Sign Hash</th>
                        <th className="border p-2">Upload Document</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userProductsDoc.map((userProduct) =>
                        userProduct.product.productFeatures.items.map((pf) => (
                          <tr key={pf.id}>
                            <td className="border p-2">{pf.product.name}</td>
                            <td className="border p-2">{pf.feature.name}</td>
                            <td className="border p-2">
                              {pf.documents.items.length > 0 ? (
                                pf.documents.items[0].status === 'pending' ? (
                                  <HourglassSplit size={25} className="text-gray-500" />
                                ) : pf.documents.items[0].status === 'accepted' ? (
                                  <CheckCircle size={25} className="text-green-600" />
                                ) : (
                                  <XCircle size={25} className="text-red-600" />
                                )
                              ) : (
                                'Document not assigned'
                              )}
                            </td>
                            <td className="border p-2">
                              {pf.documents.items.length > 0 ? (
                                'Already uploaded'
                              ) : (
                                <button
                                  classname="btninline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline"
                                  onClick={() =>
                                    this.setState({
                                      showModalDocument: true,
                                      productFeatureToAddDoc: pf,
                                    })
                                  }
                                >
                                  Upload Document
                                </button>
                              )}
                            </td>
                            <td className="border p-2">
                              {pf.document.items[0].docHash ? document.docHash : ''}
                            </td>
                            <td className="border p-2">
                              {pf.document.items[0].signed ? document.signed : ''}
                            </td>
                            <td className="border p-2">
                              {pf.document.items[0].signedHash
                                ? document.signedHash
                                : ''}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>            
            );
          }
        };
    
        const uploadDocumentation = () => {
          if (showProductsWithoutDoc) {
            let userProductsDocCopy = userProductsDoc;
            let aux = { id: 'x' };
            if (this.state.productToShow) aux = this.state.productToShow.id;
            return (
              <div classname="container mt-3 container mx-auto sm:px-4">
                <div className="flex">
                  <div className="w-1/6">
                    <h3 className="mb-4">Products</h3>
                    <div className="mt-5 space-y-4">
                      {userProductsDocCopy?.map((userProduct) => (
                        <div
                          key={userProduct.id}
                          className={`p-4 border ${userProduct.id === aux ? 'bg-blue-500 text-white' : 'bg-gray-200'} cursor-pointer`}
                          onClick={() => this.handleLoadUserProduct(userProduct)}
                        >
                          {userProduct.product.name}<ArrowRight />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="w-5/6">
                    <h3 className="mb-4">Products Documentation</h3>
                    {!productToShow ? '' : (
                      <div classname="card relative flex flex-col min-w-0 rounded break-words border bg-white border-1 border-gray-300 relative flex flex-col relative flex-grow max-w-full flex-1 px-4">
                        <div classname="card-header relative flex flex-col min-w-0 rounded break-words border bg-white border-1 border-gray-300 relative flex flex-col relative flex-grow max-w-full flex-1 px-4">
                          {productToShow.product.name}
                        </div>
                        <div classname="card-body relative flex flex-col min-w-0 rounded break-words border bg-white border-1 border-gray-300 relative flex flex-col relative flex-grow max-w-full flex-1 px-4">
                          {productToShow.product.productFeatures.items.map((pf) => {
                            if (pf.documents.items.length > 0) {
                              return null;
                            }
                            return (
                              <div key={pf.id} classname="mb-2 card relative flex flex-col min-w-0 rounded break-words border bg-white border-1 border-gray-300 relative flex flex-col relative flex-grow max-w-full flex-1 px-4">
                                <div classname="card-header relative flex flex-col min-w-0 rounded break-words border bg-white border-1 border-gray-300 relative flex flex-col relative flex-grow max-w-full flex-1 px-4">
                                  {pf.feature.featureTypeID.replace('_', ' ')}
                                </div>
                                <div classname="card-body relative flex flex-col min-w-0 rounded break-words border bg-white border-1 border-gray-300 relative flex flex-col relative flex-grow max-w-full flex-1 px-4">
                                  <h5 classname="card-title relative flex flex-col min-w-0 rounded break-words border bg-white border-1 border-gray-300 relative flex flex-col relative flex-grow max-w-full flex-1 px-4">{pf.feature.name}</h5>
                                  <p classname="card-text relative flex flex-col min-w-0 rounded break-words border bg-white border-1 border-gray-300 relative flex flex-col relative flex-grow max-w-full flex-1 px-4">{pf.feature.description}</p>
                                  <button
                                    classname="btninline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded py-1 px-3 leading-normal no-underline"
                                    onClick={() => this.setState({ showModalDocument: true, productFeatureToAddDoc: pf })}
                                  >
                                    Upload Document
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            );
          }
        };
    
        const modalDocument = () => {
          if (productFeatureToAddDoc !== null) {
            return (
              <Modal show={this.state.showModalDocument} onHide={(e) => this.handleHideModalDocument()} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                  <Modal.Title id="contained-modal-title-vcenter">{productFeatureToAddDoc?.feature.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className='mb-3'>
                    <Form.Group>
                      <Form.Group>
                        <Form.Label>Choose file</Form.Label>
                        <Form.Control type='file' name='selected_file' onChange={(e) => this.handleInputCreateDocument(e)} />
                      </Form.Group>
                    </Form.Group>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <button disabled={this.state.loadingDocument ? true : false} onClick={(e) => this.handleCreateDocument()}>
                    {this.state.loadingDocument ? 'Uploading' : 'Upload Document'}
                  </button>
                </Modal.Footer>
              </Modal>
            );
          }
        };
    
        const dropDown = () => {
          return (
            <DropdownButton className='mt-3' title='Documentation'>
              <Dropdown.Item as="button" onClick={() => this.setState({ showProductsWithoutDoc: false, showAllDocuments: true, productToShow: null })}>
                See your documentation status
              </Dropdown.Item>
              <Dropdown.Item as="button" onClick={() => this.setState({ showProductsWithoutDoc: true, showAllDocuments: false })}>
                Upload documentation
              </Dropdown.Item>
            </DropdownButton>
          );
        };
    
        return (
          <>
            {dropDown()}
            {listDocumentationStatus()}
            {uploadDocumentation()}
            {modalDocument()}
          </>
        );
      }
    }
    
    export default Documents;