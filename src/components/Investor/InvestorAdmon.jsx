import React, { Component } from 'react'
// Bootstrap
import { Container, Row, Col } from 'react-bootstrap'
// Components
import HeaderNavbar from './Navbars/HeaderNavbar'
import Documents from './Documents/Documents'
import InvestorProfile from './Profile/InvestorProfile'

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
                cellphone: '',
            },
            isShowDocuments: false,
            isShowInvestorProfile: true
        }
        this.changeHeaderNavBarRequest = this.changeHeaderNavBarRequest.bind(this)
        this.setUserGraphQLUser = this.setUserGraphQLUser.bind(this)
    }

    async componentDidMount() { 
        if (this.state.user.id === '') {
            this.changeHeaderNavBarRequest('investor_profile')
        }
    }

    async changeHeaderNavBarRequest(pRequest) {
        console.log('changeHeaderNavBarRequest: ', pRequest)

        if (pRequest === 'investor_profile') {
            this.setState({
                isShowDocuments: false,
                isShowInvestorProfile: true,
            })
        }

        if (pRequest === 'investor_documents') {
            this.setState({
                isShowDocuments: true,
                isShowInvestorProfile: false,
            })
        }

    }

    async setUserGraphQLUser(pUser) {
        await this.setState({user: pUser})
    }

    render() {
        let {isShowInvestorProfile, isShowDocuments} = this.state

        const renderInvestorProfile = () => {
            if (isShowInvestorProfile) {
                return (
                    <InvestorProfile
                        changeHeaderNavBarRequest={this.changeHeaderNavBarRequest}
                        setUserGraphQLUser={this.setUserGraphQLUser}
                    ></InvestorProfile>
                )
            }
        }

        const renderOrders = () => {
            if (isShowDocuments) {
                return (
                    <Documents
                        user={this.state.user}
                        changeHeaderNavBarRequest={this.changeHeaderNavBarRequest}
                    ></Documents>
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
                        ></HeaderNavbar>
                    </Col>
                </Row>

                <Row>
                    {renderOrders()}
                    {renderInvestorProfile()}
                </Row>

            </Container>
        )
    }
}
