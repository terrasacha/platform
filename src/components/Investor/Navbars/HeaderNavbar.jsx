import React, { Component } from 'react'
// Bootstrap
import {  Container, Nav, Navbar } from 'react-bootstrap'

// Import images
import LOGO from '../../common/_images/SuanLogoName.svg'

export default class HeaderNavbar extends Component {

    constructor(props) {
        super(props)
        this.state = {
            
        }
        this.handleChangeNavBar = this.handleChangeNavBar.bind(this)
        this.handleSignOut = this.handleSignOut.bind(this)
    }
    
    async handleChangeNavBar(pRequest) {
        console.log('handleChangeNavBar: ', pRequest)
        this.props.changeHeaderNavBarRequest(pRequest)
    }

    async handleSignOut() {
        this.props.logOut()
    }

    render() {
        let role = localStorage.getItem('role')
        return (
            <>
                <Navbar style={{backgroundColor: '#fff'}} fixed="top">
                    <Container>
                        <Nav className="me-auto">
                            <Nav.Link href="/">
                                <img src={LOGO}
                                    width="80"
                                    height="auto"
                                    className="d-inline-block align-top"
                                    alt="BBT"/>
                            </Nav.Link>
                            <Nav.Link href="#profile" onClick={(e) => this.props.changeHeaderNavBarRequest('product_documents')}>Product_Documents</Nav.Link>
                            <Nav.Link href="#products" onClick={(e) => this.props.changeHeaderNavBarRequest('users')}>Users</Nav.Link>
                        </Nav>
                        <Nav>
                            <Nav.Link style={{fontWeight: '700', color: '#FE4849'}}>{role? role: ''}</Nav.Link>
                            <button onClick={(e) => this.handleSignOut()}>Sign Out</button>
                        </Nav>
                    </Container>
                </Navbar>
            </>
        )
    }
}
