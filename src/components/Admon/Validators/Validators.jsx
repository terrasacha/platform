import React, { Component } from 'react';
import { Button, Col, Container, Form, Row, Table, Modal } from 'react-bootstrap';

import { Auth } from 'aws-amplify'
import { API, graphqlOperation } from 'aws-amplify'
import { onCreateUser, onUpdateUser } from '../../../graphql/subscriptions';
import { createUser, updateUser } from '../../../graphql/mutations';
import { listUsers } from '../../../graphql/queries';
import { v4 as uuidv4 } from 'uuid'

class Validators extends Component {

    constructor(props) {
        super(props)
        this.state = {
            validators:[],
            newUser:{
                id: '',
                username: '',
                email: '',
                role: 'validator'
            },
            userToConfirm: ''
        }
        this.handleCRUDUser = this.handleCRUDUser.bind(this)
    }

    componentDidMount = async () => {
            // OnCreate User
        await this.loadValidatorUsers()
        this.createValidatorListener = API.graphql(graphqlOperation(onCreateUser))
        .subscribe({
            next: createdUser => {
                this.loadValidatorUsers()
            }
        })
        this.updateUserListener = API.graphql(graphqlOperation(onUpdateUser))
        .subscribe({
            next: updatedUserData => {
                let tempValidators = this.state.validators.map((mapValidators) => {
                    if (updatedUserData.value.data.onUpdateUser.id === mapValidators.id) {
                        return updatedUserData.value.data.onUpdateUser
                    } else {
                        return mapValidators
                    }
                })
                this.setState({validators: tempValidators})
            }
        })
    }
    componentWillUnmount() {
      }
    async loadValidatorUsers() {
        let filter = {
            role: {
                eq: 'validator'
            }
          }
        const listUsersResult = await API.graphql({ query: listUsers, variables: { filter: filter}})
        this.setState({validators: listUsersResult.data.listUsers.items})
    }
    handleOnChangeInputForm = async(event) => {
        let tempNewUser = this.state.newUser
        if (event.target.name === 'newUser.username') {
            tempNewUser.username = event.target.value
        }
        if (event.target.name === 'newUser.email') {
            tempNewUser.email = event.target.value
        }
        
        this.setState({newUser: tempNewUser})      
    }
    async handleCRUDUser() {
        let tempNewUser = this.state.newUser
        await this.signUp(tempNewUser.username, tempNewUser.email, tempNewUser.role)
        this.cleanUserOnCreate()
    }
    handleHideModal() {
        this.setState({showModal: !this.state.showModal})
    }
    cleanUserOnCreate(){
        this.setState({
            newUser:{
                id: '',
                username: '',
                email: '',
                role: 'validator'
            },
            userToConfirm: ''
        })
    }
    async signUp(){
        const { username, email, role } = this.state.newUser
        if(username !== '' && email !== ''){
            try {
                
                const userPayload = {
                    id: uuidv4().split('-')[4],
                    name: username,
                    email: email,
                    isProfileUpdated: false,
                    role: role
                }
                await API.graphql(graphqlOperation(createUser, { input: userPayload }))   
            } catch (error) {
                console.log('A user for that e-mail address already exists. Please use a different e-mail address')    
            }
        }else{
            console.log('Agregar usuario e email')
        }
    }
    render() {
        let { validators, newUser } = this.state
        const renderValidators = () => {
            if (validators.length > 0) {
                return (
                    <Container>
                        <h4>List Validators
                        </h4>
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Role</th>
                                <th>Created at</th>
                                <th>Confirmation</th>
                            </tr>
                            </thead>
                            <tbody>
                            {validators.map(validator => (
                                <tr key={validator.id}>
                                    <td>
                                        {validator.name}
                                    </td>
                                    <td>
                                        {validator.role}
                                    </td>
                                    <td>
                                        {validator.createdAt}
                                    </td>
                                    <td>
                                        {validator.isProfileUpdated? 'Confirmed' : 'Pendiente'}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </Container>
                )
            }
        
        }
        return (
            <Container style={{display: 'flex', flexDirection: 'column'}}>
                <Container>
                    <h4>Create new validator</h4>
                    <Form>
                        <Row className='mb-2'>
                            <Form.Group as={Col}>
                                <Form.Label>username</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Username'
                                    name='newUser.username'
                                    value={newUser.username}
                                    onChange={(e) => this.handleOnChangeInputForm(e)} />
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>email</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Email'
                                    name='newUser.email'
                                    value={newUser.email}
                                    onChange={(e) => this.handleOnChangeInputForm(e)} />
                            </Form.Group>
                        </Row>

                        <Row className='mb-1'>
                            <Button
                            variant='primary'
                            size='sm'
                            onClick={this.handleCRUDUser}
                            >crear</Button>
                        </Row>
                    </Form>
                </Container>
                {renderValidators()}
            </Container>
        
        )
    }
}

export default Validators