import React, { Component } from 'react'
// Bootstrap
import { Auth } from 'aws-amplify'
import { Accordion, Button, Card, Col, Container, Form, Modal, Row, Table } from 'react-bootstrap'
// Auth css custom
import Bootstrap from "../common/themes"
// Routing
// import { useHistory } from 'react-router-dom'
// GraphQL
import { API, graphqlOperation } from 'aws-amplify'
import { createUser, createWallet, updateUser } from '../../graphql/mutations'
import { getUser } from '../../graphql/queries'
// Components
import wallet from './assets/crypto-digital-wallet-gID_4.jpg'
import Documents from './Documents/Documents'
import HeaderNavbar from './Navbars/HeaderNavbar'
import ProductsBuyed from './ProductsBuyed/ProductsBuyed'

class InvestorAdmon extends Component {

    constructor(props) {
        super(props)
        this.state = {
            user: {
                id: '',
                name: '',
                isProfileUpdated: false,
                walletID: '',
                walletName: ''
            },
            isShowDocuments: false,
            isShowProductsBuyed: false,
            isShowInvestorProfile: true,
            showModalDocument: false,
            isRenderCompleteOrUpdateProfile: false,
            isNewUser: false
        }
        this.changeHeaderNavBarRequest = this.changeHeaderNavBarRequest.bind(this)
        this.setUserGraphQLUser = this.setUserGraphQLUser.bind(this)
        this.handleRenderCompleteOrUpdateProfile = this.handleRenderCompleteOrUpdateProfile.bind(this)
        this.handleHideModalDocument = this.handleHideModalDocument.bind(this)
        this.handleCUUser = this.handleCUUser.bind(this)
        this.handleSignOut = this.handleSignOut.bind(this)
    }

    async componentDidMount() { 
        console.log('componentDidMount')
        const actualUser = await Auth.currentAuthenticatedUser()
        this.loadActualLoggedUser(actualUser)
    }

    async loadActualLoggedUser(actualUser) {
        let tempUser = this.state.user
        if (actualUser !== undefined) {
            // Setting ID user from register cognito User
            const filterByUserID = {
                id: actualUser.attributes.sub
            }
            tempUser.id = actualUser.attributes.sub
            this.setState({user: tempUser})

            const result = await API.graphql(graphqlOperation(getUser, filterByUserID))
            if (result.data.getUser === null) {
                // The user doesn't exists
                await this.setState({isRenderCompleteOrUpdateProfile: true, isNewUser: true, showModalDocument: true})
            } else {
                if (result.data.getUser.isProfileUpdated === null || !result.data.getUser.isProfileUpdated) {
                    // The user exists but the profile is not completed
                    await this.setState({isRenderCompleteOrUpdateProfile: true, isNewUser: false, showModalDocument: true})
                } else {
                    // The user exists and the profile is complete
                    await this.setState({
                        user: result.data.getUser,
                        isRenderCompleteOrUpdateProfile: false,
                        isShowDocuments: false,
                        isNewUser: false
                    })
                    // await this.props.setUserGraphQLUser(result.data.getUser)
                }
            }
        }
    }

    async changeHeaderNavBarRequest(pRequest) {
        console.log('changeHeaderNavBarRequest: ', pRequest)

        if (pRequest === 'investor_profile') {
            this.setState({
                isShowDocuments: false,
                isShowProductsBuyed: false,
                isShowInvestorProfile: true,
                isRenderCompleteOrUpdateProfile: false
            })
        }

        if (pRequest === 'investor_documents') {
            this.setState({
                isShowDocuments: true,
                isShowProductsBuyed: false,
                isShowInvestorProfile: false,
                isRenderCompleteOrUpdateProfile: false,
                isNewUser: false
            })
        }
        if (pRequest === 'products_buyed') {
            this.setState({
                isShowDocuments: false,
                isShowProductsBuyed: true,
                isShowInvestorProfile: false,
                isRenderCompleteOrUpdateProfile: false,
                isNewUser: false
            })
        }
        
    }

    async setUserGraphQLUser(pUser) {
        await this.setState({user: pUser})
    }

    async handleRenderCompleteOrUpdateProfile () {
        this.setState({isRenderCompleteOrUpdateProfile: !this.state.isRenderCompleteOrUpdateProfile})
    }


    async handleOnChangeInputForm (event) {
        if (event.target.name === 'user.name') {
            let tempUser = this.state.user
            tempUser.name = event.target.value.toUpperCase()
            await this.setState({user: tempUser })
        }
        if (event.target.name === 'user.walletID') {
            let tempUser = this.state.user
            tempUser.walletID = event.target.value
            await this.setState({user: tempUser})
        }
        if (event.target.name === 'user.walletName') {
            let tempUser = this.state.user
            tempUser.walletName = event.target.value
            await this.setState({user: tempUser})
        }
        // if (event.target.name === 'user.cellphone') {
        //     let tempUser = this.state.user
        //     tempUser.cellphone = event.target.value
        //     await this.setState({user: tempUser})
        // }
    }

    async handleCUUser() {
        let tempUser = this.state.user
        tempUser.isProfileUpdated = true
        
        if (this.state.isNewUser) {
            const userPayload = {
                id: tempUser.id,
                name: tempUser.name,
                isProfileUpdated: false,
                role: 'investor'
            }
            await API.graphql(graphqlOperation(createUser, { input: userPayload }))
        } else {
            const userPayload = {
                id: tempUser.id,
                name: tempUser.name,
                isProfileUpdated: true,
            }
            tempUser.dateOfBirth = '2000-10-01'
            await API.graphql(graphqlOperation(updateUser, { input: userPayload }))
        }
        // Creating Wallets
        const walletPayload = {
            id: tempUser.walletID,
            name: tempUser.walletName,
            userID: tempUser.id,
            status: 'new'
        }
        await API.graphql(graphqlOperation(createWallet, { input: walletPayload }))
        this.setState({isRenderCompleteOrUpdateProfile: false})
    }
    handleHideModalDocument() {
        this.setState({showModalDocument: !this.state.showModalDocument})
    }

    async handleSignOut() {
        try {
            await Auth.signOut()
            localStorage.removeItem('role');
            this.setState({
                            user: {
                                id: '',
                                name: '',
                                isProfileUpdated: false,
                                walletID: '',
                                walletName: ''
                            },
                            isRenderCompleteOrUpdateProfile: false, 
                        },
                        )
            window.location.href="/"
            // TODO: Check the option with router
            // const history = new useHistory() 
            // history.push('/investor_admon')
            
        } catch (error) {
            console.log('error signing out: ', error)
        }
    }

    render() {
        let {isShowDocuments, user, isRenderCompleteOrUpdateProfile, isShowProductsBuyed} = this.state

        const renderUserWallets = (user) => {
            if (user.wallets !== undefined && user.wallets.items !== undefined) {
                if (user.wallets.items.length > 0) {
                    return (
                        <Row xs={1} md={2} lg={3}>
                            {user.wallets.items.map(wallet => (
                                <Col key={wallet.id}>
                                    {wallet.name} / {wallet.id}
                                </Col>
                            ))}
                        </Row>
                    )
                    
                }
            }
        }

        const renderOrders = () => {
            if (isShowDocuments) {
                return (
                    <Documents />
                )
            }
        }
        const renderProductsBuyed = () => {
            if (isShowProductsBuyed) {
                return (
                    <ProductsBuyed />
                )
            }
        }

        const renderCompleteProfile = () => {
            if (isRenderCompleteOrUpdateProfile) {
                return (
                    <Container>
                        <Form>
                        
                        <Row className='mb-3'>
                            
                            <Form.Group as={Col} controlId='formGridUserContactName'>
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Nombre Contacto'
                                    name='user.name'
                                    value={user.name}
                                    onChange={(e) => this.handleOnChangeInputForm(e)} />
                            </Form.Group>

                            <Form.Group as={Col} controlId='formGridUserWalletName'>
                                <Form.Label>Wallet Name</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder=''
                                    name='user.walletName'
                                    value={user.walletName}
                                    onChange={(e) => this.handleOnChangeInputForm(e)} />
                            </Form.Group>

                            <Form.Group as={Col} controlId='formGridUserWalletID'>
                                <Form.Label>Wallet Address</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder=''
                                    name='user.walletID'
                                    value={user.walletID}
                                    onChange={(e) => this.handleOnChangeInputForm(e)} />
                            </Form.Group>

                        </Row>
                        
                        <Button
                            variant='primary'
                            size='lg'
                            onClick={() => this.handleCUUser()}
                            >Actualizar</Button>
                        </Form>
                    </Container>
                )
            } else {
                return (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Wallets</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr key={user.id}>
                                <td>
                                    {user.name}
                                </td>
                                <td>
                                    {renderUserWallets(user)}
                                </td>
                                <td>
                                    <Button 
                                        variant='primary'
                                        size='sm' 
                                        onClick={(e) => this.handleRenderCompleteOrUpdateProfile(e)}
                                    >Actualizar</Button>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                )
            }
        }
        const renderModalWallet = () => {
            if (isRenderCompleteOrUpdateProfile) {
                return (
                    <Modal
                        show={this.state.showModalDocument}
                        onHide={(e) => this.handleHideModalDocument()}
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                        >
                        <Modal.Body>
                            <Card border="light">
                                <Card.Img variant="top" src={wallet} />
                                <Card.Body>
                                    <Card.Title as="h2">Para continuar es obligatorio crear tu Billetera de Cardano,para que tengas tus tokens</Card.Title>
                                    <Accordion flush alwaysOpen>
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header>Paso 1: Descargar el monedero MetaMask</Accordion.Header>
                                        <Accordion.Body>
                                        Lo primero que debes hacer es entrar en <a href='https://metamask.io/'>metamask</a> y haz clic en "Descargar".

                                        Elige tu navegador o aplicación móvil preferida e instala la extensión de MetaMask.

                                        El wallet MetaMask es compatible con las apps nativas de iOS y Android, así como con las extensiones

                                        del navegador Chrome, Firefox, Brave y Edge.
                                        
                                        Si el proceso te parece muy complejo, siempre puedes consultar un gestor de criptomonedas.
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="1">
                                        <Accordion.Header>Paso 2: Instalación del monedero MetaMask</Accordion.Header>
                                        <Accordion.Body>
                                        Haz clic en la extensiön MetaMask y haz clic en "Get Started".
                                        Puedes importar un monedero ya existente utilizando la frase de inicio o crear uno nuevo.
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="2">
                                        <Accordion.Header>Paso 3: Cómo crear una nueva cartera MetaMask</Accordion.Header>
                                        <Accordion.Body>
                                        Haz clic en "Crear una cartera" y en la siguiente ventana haz clic en "Estoy de acuerdo" si quieres ayudar
                                        a mejorar MetaMask o haz clic en "No gracias" para continuar.
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="3">
                                        <Accordion.Header>Paso 4: Crea una contraseña segura para tu wallet.</Accordion.Header>
                                        <Accordion.Body>
                                        Haz clic en la extensiön MetaMask y haz clic en "Get Started".
                                        Puedes importar un monedero ya existente utilizando la frase de inicio o crear uno nuevo.
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="4">
                                        <Accordion.Header>Paso 5: Almacenar de forma segura la frase de recuperación para tu monedero</Accordion.Header>
                                        <Accordion.Body>
                                        Haz clic en "Clic aquí para revelar las palabras secretas" para mostrar la frase.
                                        MetaMask requiere que guardes tu frase en un lugar seguro.
                                        Es la única manera de recuperar tus fondos en caso de que tu dispositivo se estropee o tu navegador se
                                        reinicie.
                                        Te recomendamos que la escribas. El método más común es escribir tu frase de 12 palabras en un papel
                                        y guardarla en un lugar seguro al que sólo tú tengas acceso.
                                        Nota: si pierdes tu frase, MetaMask no podrá ayudarte a recuperar tu monedero y tus fondos se perderán
                                        para siempre.
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="5">
                                        <Accordion.Header>Paso 6: Confirmación de la frase secreta</Accordion.Header>
                                        <Accordion.Body>
                                        Confirma tu frase secreta de recuperación haciendo clic en cada palabra en el orden en que se
                                        presentaron las palabras en la pantalla anterior.
                                        Hz clic en "Confirmar" para continuar.
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="6">
                                        <Accordion.Header>¡Enhorabuena! Tu monedero MetaMask ha sido configurado con éxito.</Accordion.Header>
                                        <Accordion.Body>
                                        Ahora puedes acceder a tu monedero haciendo clic en el icono de MetaMask en la esquina superior
                                        derecha de tu navegador preferido.
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                                </Card.Body>
                            </Card>
                        </Modal.Body>
                    </Modal>
                )
            }
        }

        return (
            <Container fluid style={{paddingTop: 80}}>

                <h4>Investor Dashboard</h4>
                
                <Row>
                    <Col>
                        <HeaderNavbar 
                            changeHeaderNavBarRequest={this.changeHeaderNavBarRequest}
                            handleSignOut={this.handleSignOut}
                        ></HeaderNavbar>
                    </Col>
                </Row>

                <Row>
                    {renderCompleteProfile()}
                    {renderOrders()}
                    {renderProductsBuyed()}
                    {renderModalWallet()}
                </Row>

            </Container>
        )
    }
}


export default InvestorAdmon