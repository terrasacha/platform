import React, { Component } from 'react'
// Bootstrap
import { Container, Navbar, Nav, Button } from 'react-bootstrap'
// Import React Bootstrap Icons
import { InfoCircle, Filter } from 'react-bootstrap-icons'
// import { InfoCircle, Rulers, Printer, Filter, Percent, ListTask } from 'react-bootstrap-icons'

// Import images
import LOGO from '../../common/_images/logo.png'

export default class HeaderNavbar extends Component {

    constructor(props) {
        super(props)
        this.state = {
            
        }
        this.handleChangeNavBar = this.handleChangeNavBar.bind(this)
    }
    
    async handleChangeNavBar(pRequest) {
        this.props.changeHeaderNavBarRequest(pRequest)
    }

    render() {
        
        return (
            <>
                <Navbar bg="light" variant="light" fixed="top">
                    <Container>
                        <Navbar.Brand href="#"><img src={LOGO} 
                                    width="100"
                                    height="auto"
                                    className="d-inline-block align-top"
                                    alt="ATP"
                        /></Navbar.Brand>
                        <Navbar.Toggle aria-controls="navbarScroll" />
                        <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                        >
                            <Nav.Link href="#categorys">
                                
                                <Button 
                                    variant='outline-primary'
                                    block
                                    onClick={(e) => this.handleChangeNavBar('categorys', e)}
                                ><Filter></Filter>Categories</Button> 

                            </Nav.Link>
                            <Nav.Link href="#features">
                                <Button
                                    variant='outline-primary'
                                    block
                                    onClick={(e) => this.handleChangeNavBar('features', e)}
                                ><Filter></Filter>Features</Button>

                            </Nav.Link>
                            <Nav.Link href="#uom">
                                <Button
                                    variant='outline-primary'
                                    block
                                    onClick={(e) => this.handleChangeNavBar('uom', e)}
                                ><Filter></Filter>OUM</Button>

                            </Nav.Link>
                            <Nav.Link href="#products">
                                
                                <Button 
                                    variant='outline-primary'
                                    block
                                    onClick={(e) => this.handleChangeNavBar('products', e)}
                                ><InfoCircle></InfoCircle>Projects</Button>

                            </Nav.Link>
                           
                        </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>

            </>
        )
    }
}
