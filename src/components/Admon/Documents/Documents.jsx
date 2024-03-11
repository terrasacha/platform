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
            <div className='mt-4 container'>
            <h3 className="text-3xl font-semibold">Your documentation</h3>
            <div className="flex justify-center">
              <div className="w-9/12">
                <table className='mt-4 table-auto w-full'>
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Product</th>
                      <th className="px-4 py-2">Feature</th>
                      <th className="px-4 py-2">Document Status</th>
                      <th className="px-4 py-2">Doc Hash</th>
                      <th className="px-4 py-2">Sign</th>
                      <th className="px-4 py-2">Sign Hash</th>
                      <th className="px-4 py-2">Upload Document</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userProductsDoc.map((userProduct) =>
                      userProduct.product.productFeatures.items.map((pf) => {
                        return (
                          <tr key={pf.id}>
                            <td className="px-4 py-2">{pf.product.name}</td>
                            <td className="px-4 py-2">{pf.feature.name}</td>
                            <td className="px-4 py-2">
                              {pf.documents.items.length > 0 ? (
                                pf.documents.items[0].status === 'pending' ? (
                                  <HourglassSplit size={25} color='grey' />
                                ) : pf.documents.items[0].status === 'accepted' ? (
                                  <CheckCircle size={25} color='#449E48' />
                                ) : (
                                  <XCircle size={25} color='#CC0000' />
                                )
                              ) : (
                                'Document not assigned'
                              )}
                            </td>
                            <td className="px-4 py-2">{pf.documents.items.length > 0 ? 'Already uploaded' : <button className="bg-blue-500 text-white py-1 px-2 rounded" onClick={() => this.setState({ showModalDocument: true, productFeatureToAddDoc: pf })}>Upload Document</button>}</td>
                            <td className="px-4 py-2">{pf.documents.items.length > 0 ? pf.documents.items[0].docHash : ''}</td>
                            <td className="px-4 py-2">{pf.documents.items.length > 0 ? pf.documents.items[0].signed : ''}</td>
                            <td className="px-4 py-2">{pf.documents.items.length > 0 ? pf.documents.items[0].signedHash : ''}</td>
                          </tr>
                        );
                      })
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
              <div className="mt-3">
                <div className="flex">
                  <div className="w-1/6">
                    <h3 className="text-xl font-semibold">Products</h3>
                    <div className="mt-5">
                      {userProductsDocCopy?.map((userProduct) => (
                        <div
                          key={userProduct.id}
                          className={`p-4 border ${
                            userProduct.id === aux ? 'bg-blue-500 text-white' : 'bg-gray-100'
                          } cursor-pointer`}
                          onClick={() => this.handleLoadUserProduct(userProduct)}
                        >
                          <span className="mr-2">{userProduct.product.name}</span>
                          <ArrowRight className="inline" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="w-5/6">
                    <h3 className="text-xl font-semibold">Products Documentation</h3>
                    {!productToShow ? '' : (
                      <div className="mt-3">
                        <div className="border p-4">
                          <h5 className="text-xl font-semibold">{productToShow.product.name}</h5>
                          <div className="mt-3">
                            {productToShow.product.productFeatures.items.map((pf) => {
                              if (pf.documents.items.length > 0) {
                                return null;
                              }
                              return (
                                <div key={pf.id} className="mb-4 border p-4">
                                  <h6 className="text-lg font-semibold mb-2">{pf.feature.featureTypeID.replace('_', ' ')}</h6>
                                  <div>
                                    <h4 className="text-xl font-semibold">{pf.feature.name}</h4>
                                    <p className="mb-2">{pf.feature.description}</p>
                                    <button
                                      className="bg-blue-500 text-white px-4 py-2 rounded"
                                      onClick={() =>
                                        this.setState({ showModalDocument: true, productFeatureToAddDoc: pf })
                                      }
                                    >
                                      Upload Document
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
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