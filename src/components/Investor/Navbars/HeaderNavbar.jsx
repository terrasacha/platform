import React, { Component } from 'react'
// Bootstrap
import { Button, Container, Nav, Navbar } from 'react-bootstrap'
// Import React Bootstrap Icons
import { ListTask } from 'react-bootstrap-icons'

// Import images
import LOGO from '../../common/_images/logo.png'

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
        
        return (
            <>
                <Navbar bg="light" variant="light" fixed="top">
                    <Container>
                        <Nav className="me-auto">
                            <Nav.Link href="#home">
                                <img src={LOGO}
                                    width="100"
                                    height="auto"
                                    className="d-inline-block align-top"
                                    alt="BBT"/>
                            </Nav.Link>
                            <Nav.Link href="#home" onClick={(e) => this.handleChangeNavBar('investor_documents', e)}>
                                Documents
                            </Nav.Link>
                            <Nav.Link href="#home" onClick={(e) => this.handleChangeNavBar('products_buyed', e)}>
                                Products
                            </Nav.Link>
                        </Nav>
                        <Nav>
                            <button onClick={(e) => this.handleSignOut()}>Sign Out</button>
                        </Nav>
                    </Container>
                </Navbar>
            </>
        )
    }
}
