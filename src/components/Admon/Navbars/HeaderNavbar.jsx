import React, { Component } from 'react'
// Auth
import { Auth } from 'aws-amplify';
// Bootstrap
import { Button, Container, Nav, Navbar } from 'react-bootstrap'
// Import React Bootstrap Icons
import { Filter, InfoCircle } from 'react-bootstrap-icons'
// import { InfoCircle, Rulers, Printer, Filter, Percent, ListTask } from 'react-bootstrap-icons'

// Import images
import LOGO from '../../common/_images/logo.png'

export default class HeaderNavbar extends Component {

    constructor(props) {
        super(props)
        this.state = {
            actualUser: null,
            isActualUserLogged: false
        }
        this.handleChangeNavBar = this.handleChangeNavBar.bind(this)
        this.handleSignOut = this.handleSignOut.bind(this)
    }
    
    async componentDidMount() { 
        const tempActualUser =  await Auth.currentAuthenticatedUser()
        await this.setState({actualUser: tempActualUser})
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevState.actualUser === null) {
            console.log('actualUser: ', this.state.actualUser)
            await this.setState({isActualUserLogged: true})
        }
        
    }

    async handleChangeNavBar(pRequest) {
    }

    async handleSignOut() {
        console.log('handleSignOut')
        try {
            await Auth.signOut()
            this.props.changeHeaderNavBarRequest('admon_profile')
        } catch (error) {
            console.log('error signing out: ', error)
        }
    }

    render() {
        let {isActualUserLogged} = this.state
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
                                <Nav.Link href="#products">
                                    <Button 
                                        variant='outline-primary'
                                        onClick={(e) => this.handleChangeNavBar('products', e)}
                                    ><InfoCircle></InfoCircle>Projects</Button>
                                </Nav.Link>

                                <Nav.Link href="#formulas">
                                    <Button 
                                        variant='outline-primary'
                                        onClick={(e) => this.handleChangeNavBar('formulas', e)}
                                    ><Filter></Filter>Formulas</Button> 
                                </Nav.Link>

                                <Nav.Link href="#results">
                                    <Button 
                                        variant='outline-primary'
                                        onClick={(e) => this.handleChangeNavBar('results', e)}
                                    ><Filter></Filter>Results</Button> 

                                </Nav.Link>
                                <Nav.Link href="#categorys">
                                    <Button 
                                        variant='outline-primary'
                                        onClick={(e) => this.handleChangeNavBar('categorys', e)}
                                    ><Filter></Filter>Categories</Button> 

                                </Nav.Link>

                                <Nav.Link href="#features">
                                    <Button
                                        variant='outline-primary'
                                        onClick={(e) => this.handleChangeNavBar('features', e)}
                                    ><Filter></Filter>Features</Button>
                                </Nav.Link>

                                <Nav.Link href="#uom">
                                    <Button
                                        variant='outline-primary'
                                        onClick={(e) => this.handleChangeNavBar('uom', e)}
                                    ><Filter></Filter>OUM</Button>
                                </Nav.Link>

                                <Nav.Link href="#home">
                                    <Button 
                                        variant='primary'
                                        size='sm' 
                                        onClick={this.handleSignOut}
                                    >SignOut</Button>
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
