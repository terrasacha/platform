import React, { Component } from 'react';
//Bootstrap
import { Button, Badge, Card, Col, Container, Form, Modal, Row, Tabs, Tab, Accordion, Stack } from 'react-bootstrap';
import {  XCircle } from 'react-bootstrap-icons';
// GraphQL
import WebAppConfig from '../../common/_conf/WebAppConfig';
import { API, Auth, graphqlOperation } from 'aws-amplify';
import { createVerificationComment } from '../../../graphql/mutations';
import { getUser, getVerificationComment } from '../../../graphql/queries';
import { onCreateVerificationComment } from '../../../graphql/subscriptions';

class ProductsList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            products: [],
            vertificationComments: [],
            actualUserID: null,
            productToShow: null,
            isRenderModalProductAttachments: false,
            selectedIDProductToShow: null,
            selectedVerificableProductFeaturesToShow: null,
            productFeaturesVerificables: null,
            newVerificationComment: {
                verificationID: '',
                isCommentByVerifier: false,
                comment: '',
            }
        }
        this.handleHideModal = this.handleHideModal.bind(this)
        this.handleInputCreateVerificationComment = this.handleInputCreateVerificationComment.bind(this)
        this.handleCreateVerificaionComment = this.handleCreateVerificaionComment.bind(this)
    }

    componentDidMount = async () => {
        let actualUser = await Auth.currentAuthenticatedUser()
        const actualUserID = actualUser.attributes.sub
        this.setState({
            actualUserID: actualUserID
        })
        await this.loadUserProducts(actualUserID)

        this.createDocumentListener = API.graphql(graphqlOperation(onCreateVerificationComment))
            .subscribe({
                next: async createdVerificationComment => {
                    await this.loadUserProducts(actualUserID)
                }
            })
    }

    async loadUserProducts(ActualUserID) {
        let userResult = await API.graphql({ query: getUser, variables: { id: ActualUserID } })
        let listUserProducts = userResult.data.getUser.userProducts.items
        this.setState({ products: listUserProducts, productFeaturesVerificables: listUserProducts })
    }

    async handleHideModal(event, pModal) {
        if (pModal === 'hide_modal_product_attatchments') {
            this.setState({ isRenderModalProductAttachments: !this.state.isRenderModalProductAttachments })
        }
    }

    async handleLoadModal(event, productID, pModal) {
        if (pModal === 'show_modal_product_attatchments') {
            this.setState({ isRenderModalProductAttachments: true, selectedIDProductToShow: productID })
        }
    }

    async handleInputCreateVerificationComment(e) {
        if (e.target.name === 'verificationComment') {
            await this.setState(prevState => ({
                newVerificationComment: { ...prevState.newVerificationComment, comment: e.target.value }
            }))
        }
    }

    async handleCreateVerificaionComment(verificationID) {

        await this.setState(prevState => ({
            newVerificationComment: { ...prevState.newVerificationComment, verificationID: verificationID }
        }))

        let tempNewVerificationComment = this.state.newVerificationComment
        await API.graphql(graphqlOperation(createVerificationComment, { input: tempNewVerificationComment }))
        await this.cleanState()
    }

    cleanState = () => {
        this.setState({
            newVerificationComment: {
                verificationID: null,
                isCommentByVerifier: false,
                comment: '',
            },
        })
    }



    render() {
        let { products, selectedIDProductToShow, isRenderModalProductAttachments, newVerificationComment } = this.state
        const url = WebAppConfig.url_s3_public_images
        const cardTextStyle = {
            textAlign: "justify",
        };

        const scrollable = {
            overflowY: 'scroll',
            height: '150px',
        }

        const listAllUserProducts = () => {
            if (products) {
                return (
                    <Container className='mt-4 '>
                        <Row xs={1} md={2} className="g-4">
                            {
                                products.map(product => {
                                    return (
                                        <Col key={product.productID}>
                                            <Card>
                                                <Card.Img variant="top" src={`${url}${product.product.images.items[0].imageURL}`} style={{height:'24rem', width:'auto'}}/>
                                                <Card.Body>
                                                    <Card.Title><h5>{product.product.name}</h5></Card.Title>
                                                    <Row className="my-3 px-3">
                                                        <Badge pill bg="primary">{product.product.category.name}</Badge>
                                                    </Row>
                                                    <div className="mb-2">
                                                        <div className="fw-bold">Fecha de inscripción:</div>
                                                        {product.createdAt}
                                                    </div>
                                                    <div className="mb-2">
                                                        <div className="fw-bold">Estado del proyecto:</div>
                                                        {
                                                            product.product.status === 'draft' ? "En espera" :
                                                                product.product.status === 'verified' ? "Verificado" :
                                                                    product.product.status === 'in_blockchain' ? "En blockchain" :
                                                                        product.product.status === 'in_equilibrium' ? "Financiado" :
                                                                            <XCircle size={25} color='#CC0000' />
                                                        }
                                                    </div>
                                                    <div className="mb-2">
                                                        <div className="fw-bold">Descripcion del proyecto:</div>
                                                        <div style={scrollable}>
                                                            <Card.Text style={cardTextStyle}>{product.product.description}</Card.Text>
                                                        </div>
                                                    </div>

                                                    <Row className="mt-3 px-2">
                                                        <Button onClick={(e) => this.handleLoadModal(e, product.productID, 'show_modal_product_attatchments')} variant="secondary">Verificables</Button>
                                                    </Row>
                                                </Card.Body>
                                                <Card.Footer>
                                                    <small className="text-muted">Last updated 3 mins ago</small>
                                                </Card.Footer>
                                            </Card>
                                        </Col>
                                    )

                                })
                            }
                        </Row>
                    </Container>
                )
            }
        }

        const modalProductAttachments = () => {
            if (isRenderModalProductAttachments && selectedIDProductToShow !== null) {
                let product = products.filter(product => product.productID === selectedIDProductToShow)[0]
                return (
                    <Modal
                        show={this.state.isRenderModalProductAttachments}
                        onHide={(e) => this.handleHideModal(e, 'hide_modal_product_attatchments')}
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                    >
                        <Modal.Header closeButton>
                            <Modal.Title id="contained-modal-title-vcenter">
                                {product.product.name}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Accordion defaultActiveKey="0">
                                {
                                    product.product.productFeatures.items
                                    .filter(productFeature => productFeature.feature.isVerifable === true)
                                    .map(pf => {
                                      return (
                                        <Accordion.Item key={pf.featureID} eventKey={pf.featureID}>
                                          <Accordion.Header>{pf.feature.name}</Accordion.Header>
                                          <Accordion.Body>
                                            <Tabs
                                              transition={false}
                                              id="noanim-tab-example"
                                              className="mb-3"
                                            >
                                              {pf.verifications && pf.verifications.items
                                                ? pf.verifications.items.map(v => {
                                                    return (
                                                      <Tab key={v.id} eventKey={v.id} title={v.id}>
                                                        {v.verificationComments &&
                                                          v.verificationComments.items ?
                                                          v.verificationComments.items
                                                            .sort(function (a, b) {
                                                              return new Date(a.createdAt) - new Date(b.createdAt);
                                                            })
                                                            .map(vc => {
                                                              return (
                                                                <p key={vc.id}>
                                                                  {vc.createdAt} (
                                                                  {vc.isCommentByVerifier === true
                                                                    ? "Verificador"
                                                                    : "Tu"}) {vc.comment}
                                                                </p>
                                                              );
                                                            }) : null}
                                                        <Stack direction="horizontal" gap={2}>
                                                          <Form.Control
                                                            className="me-auto"
                                                            type="text"
                                                            placeholder="Escribe un comentario aquí ..."
                                                            name="verificationComment"
                                                            value={newVerificationComment.comment}
                                                            onChange={(e) => this.handleInputCreateVerificationComment(e)}
                                                          />
                                                          <div className="vr" />
                                                          <Button
                                                            variant="secondary"
                                                            onClick={(e) => this.handleCreateVerificaionComment(v.id)}
                                                          >
                                                            Enviar comentario
                                                          </Button>
                                                        </Stack>
                                                      </Tab>
                                                    );
                                                  })
                                                : null}
                                            </Tabs>
                                          </Accordion.Body>
                                        </Accordion.Item>
                                      );
                                    })
                                  
                                }
                            </Accordion>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={(e) => this.handleHideModal(e, 'hide_modal_product_attatchments')} variant="secondary">Cerrar</Button>
                        </Modal.Footer>
                    </Modal>
                )
            }
        }

        return (
            <Container>
                <Container>
                    {listAllUserProducts()}
                    {modalProductAttachments()}
                </Container>
            </Container>
        )
    }
}
export default ProductsList
