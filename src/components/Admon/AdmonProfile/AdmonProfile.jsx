import { withAuthenticator } from '@aws-amplify/ui-react'
import React, { Component } from 'react'
// Amplify
import { Auth } from 'aws-amplify'
// GraphQL
import { API, graphqlOperation } from 'aws-amplify'
import { getUser } from '../../../graphql/queries'
// Auth css custom
import Bootstrap from "../../common/themes"
// Bootstrap
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap'
// Util
import { v4 as uuidv4 } from 'uuid'

class AdmonProfile extends Component {

    constructor(props) {
        super(props)
        this.state = {
            user: {
                id: uuidv4(),
                name: '',
                dateOfBirth: '',
                isProfileUpdated: false,
                addresss: '',
                latitude: '',
                longitude: '',
                cellphone: '',
            },
            isRenderCompleteOrUpdateProfile: false,
            isNewUser: false,
        }
        this.handleOnChangeInputForm = this.handleOnChangeInputForm.bind(this)
        this.handleCUUser = this.handleCUUser.bind(this)
        this.handleRenderCompleteOrUpdateProfile = this.handleRenderCompleteOrUpdateProfile.bind(this)
    }

    async componentDidMount() { 
        await this.loadActualLoggedUser()  
    }

    async loadActualLoggedUser() {
        const actualUser = await Auth.currentAuthenticatedUser()
        if (actualUser !== undefined) {
            // Setting ID user from register cognito User
            this.props.setUserIDUsingCognitoSignedUser(actualUser.attributes.sub) 
            const filterByUserID = {
                id: actualUser.attributes.sub
            }
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
                        isRenderCompleteOrUpdateProfile: false, 
                        isNewUser: false
                    })
                    await this.props.setUserGraphQLUser(result.data.getUser)
                }
            }
        }
    }
    
    async handleOnChangeInputForm (event) {
        this.props.handleOnChangeInputForm(event)
    }

    async handleCUUser(pIsNewUser) {
        this.props.handleCUUser(this.state.isNewUser)
        this.setState({isRenderCompleteOrUpdateProfile: false})
    }


    async handleRenderCompleteOrUpdateProfile () {
        this.setState({isRenderCompleteOrUpdateProfile: !this.state.isRenderCompleteOrUpdateProfile})
    }

    // Render
    render() {
        let {isRenderCompleteOrUpdateProfile} = this.state
        let {user} = this.props

        const renderCompleteProfile = () => {
            if (isRenderCompleteOrUpdateProfile) {
                return (
                    <Container>
                        <Form>
                        
                        <Row className='mb-3'>
                            
                            <Form.Group as={Col} controlId='formGridUserContactName'>
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Nombre Contacto'
                                    name='user.name'
                                    value={user.name}
                                    onChange={(e) => this.handleOnChangeInputForm(e)} />
                            </Form.Group>

                            <Form.Group as={Col} controlId='formGridUserCellphone'>
                                <Form.Label>Celular</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='573102231282'
                                    name='user.cellphone'
                                    value={user.cellphone}
                                    onChange={(e) => this.handleOnChangeInputForm(e)} />
                            </Form.Group>
                            
                        </Row>
                        
                        <Button
                            variant='primary'
                            size='lg'
                             
                            onClick={this.handleCUUser}
                            >Actualizar</Button>
                        </Form>
                    </Container>
                )
            } else {
                return (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Celular</th>
                                <th>Dirección</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr key={user.id}>
                                <td>
                                    {user.name}
                                </td>
                                <td>
                                    {user.cellphone}
                                </td>
                                <td>
                                    {user.addresss}
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

        return  (
            <>
                {renderCompleteProfile()}
            </>
        )
  }

}

export default withAuthenticator(AdmonProfile, {
    theme: Bootstrap,
    includeGreetings: true,
    signUpConfig: {
        hiddenDefaults: ['phone_number'],
        signUpFields: [
        { label: 'Name', key: 'name', required: true, type: 'string' }
    ]
}})