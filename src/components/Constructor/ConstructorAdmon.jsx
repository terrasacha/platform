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
import profile from './assets/PngItem_4042710.png'
import Documents from './Documents/Documents'
import s from './ConstructorAdmon.module.css'
import HeaderNavbar from './Navbar/HeaderNavbar'
import ProductsBuyed from './ProductsBuyed/ProductsBuyed'
import NewProduct from './NewProduct/NewProduct'

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
            uploadNewProduct:false,
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
                isRenderCompleteOrUpdateProfile: false,
                uploadNewProduct: false,
            })
        }

        if (pRequest === 'investor_documents') {
            this.setState({
                isShowDocuments: true,
                isShowProductsBuyed: false,
                isShowInvestorProfile: false,
                isRenderCompleteOrUpdateProfile: false,
                uploadNewProduct: false,
                isNewUser: false
            })
        }
        if (pRequest === 'products_buyed') {
            this.setState({
                isShowDocuments: false,
                isShowProductsBuyed: true,
                isShowInvestorProfile: false,
                isRenderCompleteOrUpdateProfile: false,
                uploadNewProduct: false,
                isNewUser: false
            })
        }
        if (pRequest === 'upload_product') {
            this.setState({
                isShowDocuments: false,
                isShowProductsBuyed: false,
                isShowInvestorProfile: false,
                isRenderCompleteOrUpdateProfile: false,
                uploadNewProduct: true,
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
        let {isShowDocuments, user, isRenderCompleteOrUpdateProfile, isShowProductsBuyed, uploadNewProduct} = this.state

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
        const renderNewProduct = () => {
            if (uploadNewProduct) {
                return (
                    <NewProduct />
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

        return (
            <Container fluid style={{paddingTop: 60, minHeight: '100vh'}}>

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
                    {renderNewProduct()}
                </Row>

            </Container>
        )
    }
}


export default InvestorAdmon