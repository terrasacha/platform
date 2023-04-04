import React, { Component } from 'react';
import { Button, Col, Container, Form, Row, Table, Modal } from 'react-bootstrap';

import { Auth, Hub } from 'aws-amplify'
import { API, graphqlOperation } from 'aws-amplify'
import { onCreateUser, onUpdateUser } from '../../../graphql/subscriptions';
import { createUser, updateUser } from '../../../graphql/mutations';
import { listUsers } from '../../../graphql/queries';

class Validators extends Component {

    constructor(props) {
        super(props)
        this.state = {
            validators:[],
            newUser:{
                id: '',
                username: '',
                password: '',
                email: '',
                role: 'validator'
            },
            showModal: false,
            confirmationCode: '',
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
                let isOnCreateList = false;
                this.state.validators.map((mapvalidators) => {
                    if (createdUser.value.data.onCreateUser.id === mapvalidators.id) {
                        isOnCreateList = true;
                    } 
                    return mapvalidators
                })
                let tempvalidators = this.state.validators
                let temponCreateUser = createdUser.value.data.onCreateUser
                if (!isOnCreateList) {
                    tempvalidators.push(temponCreateUser)
                }
                this.setState({validators: tempvalidators})
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
        if (event.target.name === 'newUser.password') {
            tempNewUser.password = event.target.value
        }
        if (event.target.name === 'confirmationCode') {
            this.setState({confirmationCode: event.target.value})
        }
        
        this.setState({newUser: tempNewUser})      
    }
    async handleCRUDUser() {
        let tempNewUser = this.state.newUser
        await this.signUp(tempNewUser.username, tempNewUser.email, tempNewUser.password, tempNewUser.role)
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
                password: '',
                email: '',
                role: 'validator'
            },
            showModal: false,
            confirmationCode: '',
            userToConfirm: ''
        })
    }
    async signUp(){
        const { username, email, password, role } = this.state.newUser
        if(password !== '' && username !== '' && email !== ''){
            try {
                let response = await Auth.signUp({ username, password, attributes: {
                        email,
                        'custom:role': role  
                    }})
                console.log(response, 'response')
                const userPayload = {
                    id: response.userSub,
                    name: username,
                    isProfileUpdated: false,
                    role: role
                }
                await API.graphql(graphqlOperation(createUser, { input: userPayload }))   
            } catch (error) {
                console.log('A user for that e-mail address already exists. Please use a different e-mail address')    
            }
        }else{
            console.log('passwords does not match')
        }
    }
    async confirmSignUp(newUser, authCode){
        try {
            await Auth.confirmSignUp( newUser.username, authCode )
            let tempUser = {
                id: newUser.id,
                isProfileUpdated:true
            }
            await API.graphql(graphqlOperation(updateUser, { input: tempUser }))
            this.cleanUserOnCreate()
        } catch (error) {
            console.log('code does not match')
        }
    }
    handleLoadUser(validator){
        let tempNewUser = {
            id: validator.id,
            username: validator.name,
            password: '',
            email: '',
            role: 'validator'
        }

        this.setState({newUser: tempNewUser, showModal:true})
    }
    render() {
        let { validators, newUser, confirmationCode, showModal } = this.state
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
                                        {validator.isProfileUpdated? 'Confirmed' : <Button onClick={() => this.handleLoadUser(validator)}>Confirmar</Button>}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </Container>
                )
            }
        
        }
        const modalValidation = () => {

            if (showModal) {
            return (
                <Modal
                    show={showModal}
                    onHide={(e) => this.handleHideModal()}
                    size="sm"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Confirmation code
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className='mb-3'>
                            <Form.Group >
                                <Form.Control
                                type='number'
                                placeholder='confirmation code'
                                name='confirmationCode'
                                onChange={(e) => this.handleOnChangeInputForm(e)}
                                />
                            </Form.Group>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button disabled={confirmationCode.length === 0?true:false} onClick={(e) => this.confirmSignUp(this.state.newUser, this.state.confirmationCode)}>Confirm</Button>
                    </Modal.Footer>
                </Modal>
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
                            <Form.Group as={Col}>
                                <Form.Label>password</Form.Label>
                                <Form.Control
                                    type='password'
                                    placeholder='Password'
                                    name='newUser.password'
                                    value={newUser.password}
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
                {modalValidation()}
            </Container>
        
        )
    }
}

export default Validators