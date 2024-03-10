import React, { Component } from 'react'
// Bootstrap
import { Auth } from 'aws-amplify'
import  Accordion  from '../ui/Accordion';
import  Button  from '../ui/Button';
import  Card  from '../ui/Card';
import  Col  from '../ui/Col';
import  Container  from '../ui/Container';
import  Form  from '../ui/Form';
import  Modal  from '../ui/Modal';
import  Row  from '../ui/Row';

// GraphQL
import { API, graphqlOperation } from 'aws-amplify'
import { createUser, createWallet, updateUser } from '../../graphql/mutations'
import { getUser, getProduct } from '../../graphql/queries'
// Components
import wallet from './assets/crypto-digital-wallet-gID_4.jpg'
import profile from './assets/PngItem_4042710.png'
import Documents from './Documents/Documents'
import s from './InvestorAdmon.module.css'
import HeaderNavbar2 from './Navbars/HeaderNavbar2'
import ProductsBuyed from './ProductsBuyed/ProductsBuyed'
import InfoInvestor from './infoInvestor/InfoInvestor'
import { queryUserStatus } from './querys.js'
import ValidationError from '../validationError/ValidationError'

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
            checkUserStatus: null,
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
        let idUser = actualUser.attributes.sub
        const variables = {
            id: 'PRODUCT_USER_VALIDATION',
            /* featureID: `${idUser}_VALIDATION` */
            featureID: `0b803098-3834-4b1a-a326-db2fde4db615_VALIDATION`
        }
        const result = await API.graphql(graphqlOperation(queryUserStatus, variables))
        let checkUserStatusValue = this.checkUser(result.data)
        this.setState({checkUserStatus: checkUserStatusValue})
        this.loadActualLoggedUser(actualUser)
    }
    checkUser(data){
        console.log(data)
        if(data.getProduct.productFeatures.items.length > 0){
            if(data.getProduct.productFeatures.items[0].value === undefined) return false
            if(data.getProduct.productFeatures.items[0].value !== 'verified') return false
            if(data.getProduct.productFeatures.items[0].value === 'verified') return true
        }else{
            return false
        }
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
                isProfileUpdated: true,
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
                        
                        <button
                            variant='primary'
                            size='lg'
                            onClick={() => this.handleCUUser()}
                            >Actualizar</button>
                        </Form>
                    </Container>
                )
            } else {
                return (
                    <div style={{width: '100%', height: '20%',display: 'flex', justifyContent:'center'}}>
                    <div className={s.container_profile}>
                        <div className={s.profile_image_container}>
                            <img src={profile} alt='profile' className={s.profile_image} />
                        </div>
                        <div className={s.profile_info_container}>
                            <div className={s.profile_info}>
                                <h4>{user.name}</h4>
                                <h6>Wallets</h6>
                                {renderUserWallets(user)}
                            </div>
                            <button className={s.button_update_profile} onClick={(e) => this.handleRenderCompleteOrUpdateProfile(e)}>Update info</button>
                        </div>
                    </div>
                    </div>
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
                        <div className="border border-gray-300">
                        <img
                            src={wallet}
                            className="w-full h-auto"
                            alt="Wallet"
                        />
                        <div className="p-6">
                            <h2 className="text-2xl font-semibold mb-4">Paso para crear billetera en Cardano</h2>

                            <div id="accordion-collapse" data-accordion="collapse">
                            <h2 id="accordion-collapse-heading-1">
                                <button
                                type="button"
                                className="flex items-center justify-between w-full p-5 font-medium text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3"
                                data-accordion-target="#accordion-collapse-body-1"
                                aria-expanded="true"
                                aria-controls="accordion-collapse-body-1"
                                >
                                <span>Paso 1: Obtener billetera</span>
                                <svg
                                    data-accordion-icon
                                    className="w-3 h-3 rotate-180 shrink-0"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 10 6"
                                >
                                    <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 5 5 1 1 5"
                                    />
                                </svg>
                                </button>
                            </h2>
                            <div
                                id="accordion-collapse-body-1"
                                className="hidden"
                                aria-labelledby="accordion-collapse-heading-1"
                            >
                                <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
                                <p className="mb-2 text-gray-500 dark:text-gray-400">
                                    Su billetera en Cardano es la herramienta principal utilizada para
                                    interactuar con la Blockchain. En ella, lo más importante son las
                                    llaves privadas, que en el caso de la mayoría de billeteras están
                                    representadas por una combinación de palabras ó frase de recuperación
                                    las cuales deben ser guardadas fuera de línea en un sitio seguro. Ver
                                    más acerca de la seguridad en Cardano y cómo guardar de forma segura
                                    unas llaves privadas. Las billeteras más populares en Cardano son:
                                    <a
                                    href="https://eternl.io/"
                                    className="text-blue-600 dark:text-blue-500 hover:underline"
                                    >
                                    https://eternl.io/
                                    </a>
                                    ,
                                    <a
                                    href="https://gerowallet.io"
                                    className="text-blue-600 dark:text-blue-500 hover:underline"
                                    >
                                    https://gerowallet.io
                                    </a>
                                    ,
                                    <a
                                    href="https://namiwallet.io"
                                    className="text-blue-600 dark:text-blue-500 hover:underline"
                                    >
                                    https://namiwallet.io
                                    </a>
                                    ,
                                    <a
                                    href="https://yoroi-wallet.com"
                                    className="text-blue-600 dark:text-blue-500 hover:underline"
                                    >
                                    https://yoroi-wallet.com
                                    </a>
                                    .
                                </p>
                                </div>
                            </div>

                            {/* Repite la misma estructura para los siguientes pasos del acordeón */}
                            </div>
                        </div>
                        </div>

                        </Modal.Body>
                    </Modal>
                )
            }
        }
        if(this.state.checkUserStatus === null){
            return(
                <Container fluid style={{paddingTop: 50, minHeight: '100vh'}}>
                    <Row>
                        <Col>
                            <HeaderNavbar2 
                                changeHeaderNavBarRequest={this.changeHeaderNavBarRequest}
                                handleSignOut={this.handleSignOut}
                            ></HeaderNavbar2>
                        </Col>
                    </Row>
                    <div style={{marginTop: '1%'}}>Cargando...</div>
                </Container>
            )
        }
        if(this.state.checkUserStatus){
            return (
                <Container fluid style={{paddingTop: 50, minHeight: '100vh'}}>
    
                    
                    <Row>
                        <Col>
                            <HeaderNavbar2 
                                changeHeaderNavBarRequest={this.changeHeaderNavBarRequest}
                                handleSignOut={this.handleSignOut}
                            ></HeaderNavbar2>
                        </Col>
                    </Row>
    
                    <Row>
    {/*                     {renderCompleteProfile()}
                        {renderOrders()}
                        {renderProductsBuyed()}
                        {renderModalWallet()} */}
                        <InfoInvestor />
                    </Row>
    
                </Container>
            )
        }else{
            console.log('null')
            return(
                <Container fluid style={{paddingTop: 50, minHeight: '100vh'}}>                
                    <Row>
                        <Col>
                            <HeaderNavbar2 
                                changeHeaderNavBarRequest={this.changeHeaderNavBarRequest}
                                handleSignOut={this.handleSignOut}
                            ></HeaderNavbar2>   
                        </Col>
                    </Row>
    
                    <Row>
                        <ValidationError />
                    </Row>
    
                </Container>
            )
        }
        
    }
}


export default InvestorAdmon