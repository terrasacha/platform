import React, { Component } from 'react'
// Bootstrap
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap'
// Amplify
import { withAuthenticator } from '@aws-amplify/ui-react'
import { Auth } from 'aws-amplify'
// Auth css custom
import Bootstrap from "../common/themes"
// Routing
// import { useHistory } from 'react-router-dom'
// GraphQL
import { API, graphqlOperation } from 'aws-amplify'
import { createUser, createWallet, updateUser } from '../../graphql/mutations'
import { getUser } from '../../graphql/queries'
// Components
import Documents from '../Admon/Documents/Documents'
import HeaderNavbar from './Navbars/HeaderNavbar'

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
            isShowInvestorProfile: true,
            isRenderCompleteOrUpdateProfile: false,
            isNewUser: false
        }
        this.changeHeaderNavBarRequest = this.changeHeaderNavBarRequest.bind(this)
        this.setUserGraphQLUser = this.setUserGraphQLUser.bind(this)
        this.handleRenderCompleteOrUpdateProfile = this.handleRenderCompleteOrUpdateProfile.bind(this)
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
                await this.setState({isRenderCompleteOrUpdateProfile: true, isNewUser: true})
            } else {
                if (result.data.getUser.isProfileUpdated === null || !result.data.getUser.isProfileUpdated) {
                    // The user exists but the profile is not completed
                    await this.setState({isRenderCompleteOrUpdateProfile: true, isNewUser: false})
                } else {
                    // The user exists and the profile is complete
                    await this.setState({
                        user: result.data.getUser,
                        isRenderCompleteOrUpdateProfile: false,
                        isShowDocuments: true,
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
                isShowInvestorProfile: true,
                isRenderCompleteOrUpdateProfile: false
            })
        }

        if (pRequest === 'investor_documents') {
            console.log('isShowDocuments true')
            this.setState({
                isShowDocuments: true,
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

    async handleSignOut() {
        console.log('handleSignOut')
        try {
            await Auth.signOut()
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
            window.location.href="/investor_admon"
            // TODO: Check the option with router
            // const history = new useHistory() 
            // history.push('/investor_admon')
            
        } catch (error) {
            console.log('error signing out: ', error)
        }
    }

    render() {
        let {isShowDocuments, user, isRenderCompleteOrUpdateProfile} = this.state

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
                </Row>

            </Container>
        )
    }
}


export default withAuthenticator(InvestorAdmon, {
    theme: Bootstrap,
    includeGreetings: true,
    signUpConfig: {
        hiddenDefaults: ['phone_number'],
        signUpFields: [
        { label: 'Name', key: 'name', required: true, type: 'string' }
    ]
}})