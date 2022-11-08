import React, { Component } from 'react'
// Bootstrap
import { Button, Container, Nav, Navbar } from 'react-bootstrap'
// Import React Bootstrap Icons
/* import { Filter, InfoCircle } from 'react-bootstrap-icons' */
// import { InfoCircle, Rulers, Printer, Filter, Percent, ListTask } from 'react-bootstrap-icons'

// Import images
import LOGO from '../../common/_images/logo.png'

export default class HeaderNavbar extends Component {

    constructor(props) {
        super(props)
        this.state = {}
        this.changeHeaderNavBarRequest = this.props.changeHeaderNavBarRequest.bind(this)
        this.handleSignOut = this.props.handleSignOut.bind(this)
        this.handleChangeObjectElement = this.handleChangeObjectElement.bind(this)
    }
    
    async handleChangeObjectElement() {
        console.log('handleChangeObjectElement: ')
        this.props.handleSignOut()
    }
    
    handleOnChangeInputForm = async(event) => {
        if (event.target.name === 'desiredSubscriptionTopic') {
            await this.setState({desiredSubscriptionTopic: event.target.value})
        }
        if (event.target.name === 'desiredPublishTopic') {
            await this.setState({desiredPublishTopic: event.target.value})
        }
    }
    // RENDER
    render() {
        let {isActualUserLogged} = this.props
        const renderNavBar = () => {
            if (isActualUserLogged) {
                return (
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
                                <Nav.Link href="#products" onClick={(e) => this.changeHeaderNavBarRequest('products', e)}>
                                    Projects
                                </Nav.Link>

                                <Nav.Link href="#documents"onClick={(e) => this.changeHeaderNavBarRequest('documents', e)}>
                                    Documents
                                </Nav.Link>

                                <Nav.Link href="#formulas" onClick={(e) => this.changeHeaderNavBarRequest('formulas', e)}>
                                    Formulas
                                </Nav.Link>

                                <Nav.Link href="#results" onClick={(e) => this.changeHeaderNavBarRequest('results', e)}>
                                    Results
                                </Nav.Link>
                                <Nav.Link href="#categorys" onClick={(e) => this.changeHeaderNavBarRequest('categorys', e)}>
                                    Categories
                                </Nav.Link>

                                <Nav.Link href="#features" onClick={(e) => this.changeHeaderNavBarRequest('features', e)}>
                                    Features
                                </Nav.Link>

                                <Nav.Link href="#uom" onClick={(e) => this.changeHeaderNavBarRequest('uom', e)}>
                                    OUM
                                </Nav.Link>

                                <Nav.Link href="#home" style={{color:'#0D6EFD'}} onClick={(e) => this.handleChangeObjectElement()}>
                                    SignOut
                                </Nav.Link>
                            
                            </Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>
                )
            }
        }

        // RENDER        
        return (
            <>
                {renderNavBar()}   
            </>
        )
    }
}
