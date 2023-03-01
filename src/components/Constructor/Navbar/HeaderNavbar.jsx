import React, { Component } from 'react'
// Bootstrap
import { Button, Container, Nav, Navbar } from 'react-bootstrap'
// Import React Bootstrap Icons
import { ListTask } from 'react-bootstrap-icons'

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
        this.props.handleSignOut()
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
                            <Nav.Link href="#profile" onClick={(e) => this.props.changeHeaderNavBarRequest('investor_profile')}>Profile</Nav.Link>
                            <Nav.Link href="#documents" onClick={(e) => this.props.changeHeaderNavBarRequest('investor_documents')}>Documents</Nav.Link>
                            <Nav.Link href="#products" onClick={(e) => this.props.changeHeaderNavBarRequest('products_buyed')}>Products</Nav.Link>
                            <Nav.Link href="#upload_product" onClick={(e) => this.props.changeHeaderNavBarRequest('upload_product')}>Upload new Product</Nav.Link>
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
