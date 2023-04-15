import React, { Component } from 'react';
//Bootstrap
import { Button, Badge, Card, Col, Container, Dropdown, DropdownButton, Form, Modal, Row, Table, ListGroup, Tabs, Tab, Accordion, Stack } from 'react-bootstrap';
import { ArrowRight, CheckCircle, HourglassSplit, XCircle, Server, Water } from 'react-bootstrap-icons';
import Bootstrap from "../../common/themes";
// GraphQL
import { API, Auth } from 'aws-amplify';
import { getUser } from '../../../graphql/queries';

class ProductsList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            products: [],
            actualUserID: null,
            productToShow: null,
            isRenderModalProductAttachments: false,
            selectedProductToShow: null,
            selectedVerificableProductFeaturesToShow: null,
            productFeaturesVerificables: null,
            verificationComment: {

            }
        }
        this.handleHideModal = this.handleHideModal.bind(this)
    }

    componentDidMount = async () => {
        let actualUser = await Auth.currentAuthenticatedUser()
        const actualUserID = actualUser.attributes.sub
        console.log(actualUserID, 'actualUserID')
        this.setState({
            actualUserID: actualUserID
        })
        await this.loadUserProducts(actualUserID)
        console.log(this.state.products, 'proyectos')
    }
    
    async loadUserProducts(ActualUserID) {
        let userResult = await API.graphql({ query: getUser, variables: { id: ActualUserID } })
        let listUserProducts = userResult.data.getUser.userProducts.items
        this.setState({ products: listUserProducts, productFeaturesVerificables: listUserProducts })

    }

    async handleHideModal(event, pModal) {
        if  (pModal === 'hide_modal_product_attatchments') {
            this.setState({isRenderModalProductAttachments: !this.state.isRenderModalProductAttachments})
        }
    }

    async handleLoadModal(event, pProduct, pModal) {
        if (pModal === 'show_modal_product_attatchments') {
            this.setState({isRenderModalProductAttachments: true, selectedProductToShow: pProduct})
        }
    }

    async handleCreateVerificationComment(e) {
        if(e.target.name === 'verificationComment'){
            this.setState(prevState => ({
                newVerificationComment: {...prevState.newProductFeature, value: e.target.value}}))
        }
    }

    render() {
        let { products, selectedProductToShow, isRenderModalProductAttachments } = this.state
        const listAllUserProducts = () => {
            if (products) {
                return (
                    <Container className='mt-4 '>
                        <Row className="justify-content-md-center">
                            <Col xs >
                                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                                    <h5 className='mr-5'>Your products</h5>
                                </div>
                                <Table hover className='mt-4'>
                                    <thead>
                                        <tr>
                                            <th>Proyecto</th>
                                            <th>Categoria</th>
                                            <th>Descripcion</th>
                                            <th>Estado</th>
                                            <th>Fecha de inscripcion</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            products.map(product => {
                                                return (
                                                    <tr key={product.productID}>
                                                        <td>{product.product.name}</td>
                                                        <td>{product.product.category.name}</td>
                                                        <td>{product.product.description}</td>
                                                        <td>{
                                                            product.product.status === 'draft' ? <HourglassSplit size={25} color='grey' /> :
                                                            product.product.status === 'verified' ? <CheckCircle size={25} color='#449E48' /> : 
                                                            product.product.status === 'in_blockchain' ? <Server size={25} color='yellow' /> : 
                                                            product.product.status === 'in_equilibrium' ? <Water size={25} color='#449E48' /> : 
                                                            <XCircle size={25} color='#CC0000' />
                                                        }</td>
                                                        <td>{product.createdAt}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </Container>
                )
            }
        }

        const cardTextStyle = {
            textAlign: "justify",
        };

        const scrollable = {
            overflowY: 'scroll',
            height:'150px',
        }

        const listAllUserProductsv2 = () => {
            if (products) {
                return (
                    <Container className='mt-4 '>
                        <Row xs={1} md={2} className="g-4">
                        {
                            products.map(product => {
                                return (
                                    <Col key={product.productID}>
                                        <Card>
                                            <Card.Img variant="top" src="https://picsum.photos/500/160" />
                                            <Card.Body>
                                                <Card.Title><h5>{product.product.name}</h5></Card.Title>
                                                <Row className="my-3 px-3">
                                                    <Badge pill bg="primary">{product.product.category.name}</Badge>
                                                </Row>
                                                <div className="mb-2">
                                                    <div className="fw-bold">Fecha de inscripción:</div>
                                                    { product.createdAt }
                                                </div>
                                                <div className="mb-2">
                                                    <div className="fw-bold">Estado del proyecto:</div>
                                                    {
                                                        product.product.status === 'draft' ? "En espera":
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
                                                    <Button onClick={(e) => this.handleLoadModal(e, product, 'show_modal_product_attatchments')} variant="secondary">Verificables</Button>
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
            if (isRenderModalProductAttachments && selectedProductToShow !== null) {

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
                                {selectedProductToShow.product.name}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <Accordion defaultActiveKey="0">
                            {
                                selectedProductToShow.product.productFeatures.items.filter( productFeature => productFeature.isVerifable == true ).map( pf => {
                                    return (
                                        <Accordion.Item key={pf.featureID} eventKey={pf.featureID}>
                                            <Accordion.Header>{pf.feature.name}</Accordion.Header>
                                            <Accordion.Body>
                                            {
                                                pf.verifications.items.map( v => v.verificationComments.items.sort(function(a,b){
                                                    return new Date(a.createdAt) - new Date(b.createdAt);
                                                  }).map( vc => {
                                                    return (
                                                        <p key={vc.id}>{vc.createdAt} ({ vc.isCommentByVerifier == true ? "Verificador": "Tu"}) {vc.comment}</p>
                                                    )
                                                }))
                                            }
                                            <Stack direction="horizontal" gap={3}>
                                                <Form.Control className="me-auto" placeholder="Escribe un comentario aqui ..." />
                                                <Form.Control
                                                className="me-auto"
                                                type='text'
                                                placeholder='Escribe un comentario aqui ...'
                                                name='verificationComment'
                                                onChange={(e) => this.handleCreateVerificationComment(e)} />
                                                <div className="vr" />
                                                <Button variant="secondary">Enviar comentario</Button>
                                            </Stack>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    )
                                        
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
                    {listAllUserProductsv2()}
                    {modalProductAttachments()}
                </Container>
            </Container>
        )
    }
}
export default ProductsList
