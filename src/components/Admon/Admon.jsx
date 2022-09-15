import React, { Component } from 'react'
// Bootstrap
import { Container, Row, Col, Alert } from 'react-bootstrap'
// Components
import HeaderNavbar from './Navbars/HeaderNavbar'
import Categorys from './Categorys/Categorys'
import Features from './Features/Features'
import UOM from './UOM/UOM'
import Products from './Products/Products'
import AdmonProfile from './AdmonProfile/AdmonProfile'

// GraphQL
import { API, graphqlOperation } from 'aws-amplify'
import { updateUser } from '../../graphql/mutations'

export default class Admon extends Component {

    constructor(props) {
        super(props)
        this.state = {
            user: {
                id: '',
                name: '',
                dateOfBirth: '',
                isProfileUpdated: false,
                addresss: '',
                latitude: '',
                longitude: '',
                cellphone: '',
            },
            isShowAdmonProfile: false,
            isShowProducts: true,
            isShowCategorys: false,
            isShowFeatures: false,
            isShowNotAuthorize: false,
            isShowUOM: false
        }
        this.changeHeaderNavBarRequest = this.changeHeaderNavBarRequest.bind(this)
        this.setUserGraphQLUser = this.setUserGraphQLUser.bind(this)
        this.handleCUUser = this.handleCUUser.bind(this)
        this.handleOnChangeInputForm = this.handleOnChangeInputForm.bind(this)
        this.setUserIDUsingCognitoSignedUser = this.setUserIDUsingCognitoSignedUser.bind(this)
    }

    async componentDidMount() {
        // if (this.state.user.id === '') {
        //     this.changeHeaderNavBarRequest('admon_profile')
        // }
    }

    async setUserGraphQLUser(pUser) {
        await this.setState({user: pUser})
    }

    async changeHeaderNavBarRequest(pRequest) {
        console.log('changeHeaderNavBarRequest: ', pRequest)

        if (pRequest === 'admon_profile') {
            this.setState({
                isShowProducts: false,
                isShowCategorys: false,
                isShowFeatures: false,
                isShowAdmonProfile: true,
                isShowNotAuthorize: false,
                isShowUOM: false
            })
        }

        if (pRequest === 'user_not_authorize') {
            this.setState({
                isShowProducts: false,
                isShowCategorys: false,
                isShowFeatures: false,
                isShowAdmonProfile: false,
                isShowNotAuthorize: true,
                isShowUOM: false
            })
        }


        if (pRequest === 'products') {
            this.setState({
                isShowProducts: true,
                isShowCategorys: false,
                isShowFeatures: false,
                isShowAdmonProfile: false,
                isShowNotAuthorize: false,
                isShowUOM: false
            })
        }

        if (pRequest === 'categorys') {
            this.setState({
                isShowProducts: false,
                isShowCategorys: true,
                isShowFeatures: false,
                isShowAdmonProfile: false,
                isShowNotAuthorize: false,
                isShowUOM: false
            })
        }
        if (pRequest === 'features') {
            this.setState({
                isShowProducts: false,
                isShowCategorys: false,
                isShowFeatures: true,
                isShowAdmonProfile: false,
                isShowNotAuthorize: false,
                isShowUOM: false
        })
        }
        if (pRequest === 'uom') {
            this.setState({
                isShowProducts: false,
                isShowCategorys: false,
                isShowFeatures: false,
                isShowAdmonProfile: false,
                isShowNotAuthorize: false,
                isShowUOM: true
        })
        }
        
    }

    async handleCUUser(pIsNewUser) {
        let tempUser = this.state.user
        tempUser.isProfileUpdated = true
        // To updates
        if (!pIsNewUser) {
            delete tempUser.ordersClient
            delete tempUser.ordersWiller
            delete tempUser.createdAt
            delete tempUser.updatedAt
            tempUser.dateOfBirth = '2000-10-01'
            await API.graphql(graphqlOperation(updateUser, { input: tempUser }))
        }
        this.setState({isRenderCompleteOrUpdateProfile: false})
    }

    async handleOnChangeInputForm(event) {
        if (event.target.name === 'user.name') {
            let tempUser = this.state.user
            tempUser.name = event.target.value.toUpperCase()
            await this.setState({user: tempUser })
        }
        if (event.target.name === 'user.addresss') {
            let tempUser = this.state.user
            tempUser.addresss = event.target.value.toUpperCase()
            await this.setState({user: tempUser})
        }
        if (event.target.name === 'user.cellphone') {
            let tempUser = this.state.user
            tempUser.cellphone = event.target.value
            await this.setState({user: tempUser})
        }
    }

    async setUserIDUsingCognitoSignedUser(pID) {
        let tempUser = this.state.user
        tempUser.id = pID
        await this.setState({user: tempUser})
    }

    // RENDER
    render() {
        let {isShowProducts,
            isShowCategorys,
            isShowFeatures,
            isShowAdmonProfile,
            isShowNotAuthorize,
            isShowUOM
        } = this.state

        const renderAdmonProfile = () => {
            if (isShowAdmonProfile) {
                return (
                    <AdmonProfile
                        user={this.state.user}
                        setUserIDUsingCognitoSignedUser={this.setUserIDUsingCognitoSignedUser}
                        changeHeaderNavBarRequest={this.changeHeaderNavBarRequest}
                        setUserGraphQLUser={this.setUserGraphQLUser}
                        handleOnChangeInputForm={this.handleOnChangeInputForm}
                        handleCUUser={this.handleCUUser}
                    ></AdmonProfile>
                )
            }
        }

        const renderProducts = () => {
            if (isShowProducts) {
                return (
                    <Products 
                        user={this.state.user}
                        changeHeaderNavBarRequest={this.changeHeaderNavBarRequest}
                    ></Products>
                )
            }
        }

        const renderCategorys = () => {
            if (isShowCategorys) {
                return (
                    <Categorys 
                        user={this.state.user}
                        changeHeaderNavBarRequest={this.changeHeaderNavBarRequest}
                        handleCUUser={this.handleCUUser}
                    ></Categorys>
                )
            }
        }
        const renderFeatures = () => {
            if (isShowFeatures) {
                return (
                    <Features 
                        user={this.state.user}
                        changeHeaderNavBarRequest={this.changeHeaderNavBarRequest}
                        handleCUUser={this.handleCUUser}
                    ></Features>
                )
            }
        }
        const renderOUM = () => {
            if (isShowUOM) {
                return (
                    <UOM 
                        user={this.state.user}
                        changeHeaderNavBarRequest={this.changeHeaderNavBarRequest}
                        handleCUUser={this.handleCUUser}
                    ></UOM>
                )
            }
        }

       
        const renderUserNoAuthorize = () => {
            if (isShowNotAuthorize) {
                return (
                    <Alert key="key_warning" variant="warning">
                        Perfil no autorizado
                    </Alert>
                )
            }
        }

        return (
            <Container fluid style={{paddingTop: 70}}>

                <h4>Admon Dashboard</h4>
                
                <Row>
                    <Col>
                        <HeaderNavbar 
                            changeHeaderNavBarRequest={this.changeHeaderNavBarRequest}
                        ></HeaderNavbar>
                    </Col>
                </Row>

                <Row>
                    {renderProducts()}
                    {renderCategorys()}
                    {renderFeatures()}
                    {renderOUM()}
                    {renderAdmonProfile()}
                    {renderUserNoAuthorize()}
                </Row>

            </Container>
        )
    }
}
