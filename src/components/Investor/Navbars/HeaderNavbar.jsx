import React, { Component } from 'react'
// Bootstrap
import { Container, Navbar, Nav, Button } from 'react-bootstrap'
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
                                
                                <img src={LOGO} className='Logo'alt='test'/>

                            </Nav.Link>

                            <Nav.Link href="#home">
                                
                                <Button 
                                    variant='outline-primary'
                                     
                                    onClick={(e) => this.handleChangeNavBar('investor_documents', e)}
                                ><ListTask></ListTask>Documents</Button> 

                            </Nav.Link>

                            <Nav.Link href="#home" style={{color:'#0D6EFD'}} onClick={(e) => this.handleSignOut()}>
                                    SignOut
                            </Nav.Link>

                        </Nav>
                    </Container>
                </Navbar>
            </>
        )
    }
}
