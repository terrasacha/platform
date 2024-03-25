import React, { Component } from 'react'

import { Auth } from 'aws-amplify'
// GraphQL
import { API, graphqlOperation } from 'aws-amplify'
import { createUser, updateUser } from '../../../graphql/mutations'
import { getUser } from '../../../graphql/queries'
// Bootstrap
import  Button  from './components/ui/Button';
import  Col  from './components/ui/Col';
import  Container  from './components/ui/Container';
import  Form  from './components/ui/Form';
import  Row  from './components/ui/Row';
import  Table  from './components/ui/Table';
// Util
import { v4 as uuidv4 } from 'uuid'

class InvestorProfile extends Component {

    constructor(props) {
        super(props)
        this.state = {
            user: {
                id: uuidv4(),
                name: '',
                dateOfBirth: '',
                isProfileUpdated: false,
                addresss: '',
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
        let tempUser = this.state.user
        if (actualUser !== undefined) {
            // Setting ID user from register cognito User
            const filterByUserID = {
                id: actualUser.attributes.sub
            }
            tempUser.id = actualUser.attributes.sub
            this.setState({user: tempUser})

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
                        user: result.data.getUser,
                        isRenderCompleteOrUpdateProfile: false, 
                        isNewUser: false
                    })
                    await this.props.setUserGraphQLUser(result.data.getUser)
                }
            }
        }
    }

    
    async handleOnChangeInputForm (event) {
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

    async handleCUUser(pIsNewUser) {
        let tempUser = this.state.user
        tempUser.isProfileUpdated = true
        // To create
        if (pIsNewUser) {
            tempUser.dateOfBirth = '2000-10-01'
            tempUser.role = 'investor'
            await API.graphql(graphqlOperation(createUser, { input: tempUser }))
        } else { // To update
            delete tempUser.ordersClient
            delete tempUser.ordersWiller
            delete tempUser.createdAt
            delete tempUser.updatedAt
            await API.graphql(graphqlOperation(updateUser, { input: tempUser }))
        }
        this.setState({isRenderCompleteOrUpdateProfile: false})
    }


    async handleRenderCompleteOrUpdateProfile () {
        this.setState({isRenderCompleteOrUpdateProfile: !this.state.isRenderCompleteOrUpdateProfile})
    }

    // Render
    render() {
        let {user, isRenderCompleteOrUpdateProfile} = this.state

        const renderCompleteProfile = () => {
            if (isRenderCompleteOrUpdateProfile) {
                return (
                    <div classname="container mx-auto container mx-auto sm:px-4">
                        <form>
                        
                        <div className='mb-3'>
                            
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
                                <Form.Label>Celular (Ex. +573102241181)</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='+573102241181'
                                    name='user.cellphone'
                                    value={user.cellphone}
                                    onChange={(e) => this.handleOnChangeInputForm(e)} />
                            </Form.Group>
                            
                        </div>
                        
                        <button
                            variant='primary'
                            size='lg'
                             
                            onClick={this.handleCUUser}
                            >Actualizar</button>
                        </form>
                    </div>
                )
            } else {
                return (
                    <table striped bordered hover>
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
                                    <button 
                                        variant='primary'
                                        size='sm' 
                                         
                                        onClick={(e) => this.handleRenderCompleteOrUpdateProfile(e)}
                                    >Actualizar</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
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

export default InvestorProfile