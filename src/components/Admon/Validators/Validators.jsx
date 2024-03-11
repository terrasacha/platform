import React, { Component } from 'react';
import  Button  from '../../ui/Button';
import  Col  from '../../ui/Col';
import  Container  from '../../ui/Container';
import  Form  from '../../ui/Form';
import  Row  from '../../ui/Row';
import  Table  from '../../ui/Table';
import  Modal  from '../../ui/Modal';

import { API, graphqlOperation, Auth } from 'aws-amplify'
import { onCreateUser, onUpdateUser, onDeleteUser } from '../../../graphql/subscriptions';
import { createUser, updateUser, deleteUser, deleteUserProduct} from '../../../graphql/mutations';
import { listUserProducts } from '../../../graphql/queries';
import { v4 as uuidv4 } from 'uuid'
const listUserValidators = `
query ListUsers(
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
) {
  listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      email
      isProfileUpdated
      role
      subrole
      status
      createdAt
    }
    nextToken
  }
}
`
class Validators extends Component {

    constructor(props) {
        super(props)
        this.state = {
            validators:[],
            newUser:{
                id: '',
                username: '',
                email: '',
                role: 'validator',
                subRole: 'financial'
            },
            showModal: false, 
            showModalCreate: false, 
            userToDelete: {id: null, username: null},
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
        this.deleteValidatorListener = API.graphql(graphqlOperation(onDeleteUser))
        .subscribe({
            next: deleteUser => {
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
    handleDeleteUser = async (id) => { 
        const input = { id }
        let promises = []
        API.graphql(graphqlOperation(listUserProducts, {filter: {userID: {eq: id}}})).then((result) => {
            if(result.data.listUserProducts.items.length > 0){
                result.data.listUserProducts.items.map((mapUserProducts) => {
                    promises.push(API.graphql(graphqlOperation(deleteUserProduct, {input: {id: mapUserProducts.id}})))
                })
            }
        })
        promises.push(API.graphql(graphqlOperation(deleteUser, {input: input})))
        await Promise.all(promises).then((result) => {
            console.log('información eliminada exitosamente')
        }).catch((error) => {  
            console.log(error)
        })  
    }
    showModalCreate() {
        this.setState({
            showModalCreate: true,
        });
    }
    showModalDelete(user) {
        // Set the user to delete and show the modal
        this.setState({
            userToDelete: user,
            showModal: true,
        });
    }

    async confirmCreateUser() {
        const { newUser } = this.state;
        if (newUser) {
            await this.handleCRUDUser()
            this.cleanUserOnCreate()
        }
    }

    confirmDeleteUser() {
        const { userToDelete } = this.state;
        if (userToDelete) {
            this.handleDeleteUser(userToDelete.id);
            this.setState({
                userToDelete: {id: null, username: null},
                showModal: false, // Hide the modal after confirmation
            });
        }
    }
    async loadValidatorUsers() {
        let filter = {
            role: {
                eq: 'validator'
            }
          }
        const listUsersResult = await API.graphql({ query: listUserValidators, variables: { filter: filter}})
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
        if (event.target.name === 'newUser.subRole') {
            tempNewUser.subRole = event.target.value
        }
        
        this.setState({newUser: tempNewUser})      
    }
    async handleCRUDUser() {
        let tempNewUser = this.state.newUser
        await this.signUp(tempNewUser.username, tempNewUser.email, tempNewUser.role)
    }
    handleHideModal() {
        this.setState({showModal: !this.state.showModal})
    }
    handleHideModalCreate() {
        this.setState({showModalCreate: !this.state.showModalCreate})
    }
    cleanUserOnCreate(){
        this.setState({
            newUser:{
                id: '',
                username: '',
                email: '',
                role: 'validator',
                subRole: 'financial'
            },
            showModalCreate: false
        })
    }
    async signUp(){
        const { username, email, role, subRole } = this.state.newUser
        if(username !== '' && email !== ''){
            try {
                
                const userPayload = {
                    id: uuidv4().split('-')[4],
                    name: username,
                    email: email,
                    isProfileUpdated: false,
                    role: `${role}_${subRole}`
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
        let { validators, newUser } = this.state;
    
        const renderValidators = () => {
          if (validators.length > 0) {
            return (
              <div className='container'>
                <h4>List Validators</h4>
                <table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Subrole</th>
                      <th>Created at</th>
                      <th>Confirmation</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {validators.map((validator) => (
                      <tr key={validator.id}>
                        <td>{validator.name}</td>
                        <td>{validator.email}</td>
                        <td>{validator.subrole}</td>
                        <td>
                          {validator.createdAt.split('T')[0].split('-')[2] +
                            '-' +
                            validator.createdAt.split('T')[0].split('-')[1] +
                            '-' +
                            validator.createdAt.split('T')[0].split('-')[0]}
                        </td>
                        <td>{validator.isProfileUpdated ? 'Confirmed' : 'Pendiente'}</td>
                        <td>
                          <button
                            variant='danger'
                            size='sm'
                            disabled={!validator.isProfileUpdated}
                            onClick={() => this.showModalDelete({ id: validator.id, username: validator.name })}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
        };
    
        return (
          <div className='container mx-auto' style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="container mx-auto">
              <h4>Create new validator</h4>
              <form>
                <div className='mb-2'>
                  <div>
                    <label>username</label>
                    <input
                      type='text'
                      placeholder='Username'
                      name='newUser.username'
                      value={newUser.username}
                      onChange={(e) => this.handleOnChangeInputForm(e)}
                    />
                  </div>
                  <div>
                    <label>email</label>
                    <input
                      type='text'
                      placeholder='Email'
                      name='newUser.email'
                      value={newUser.email}
                      onChange={(e) => this.handleOnChangeInputForm(e)}
                    />
                  </div>
                  <div>
                    <label>Validator type</label>
                    <select name='newUser.subRole' value={newUser.subRole} onChange={(e) => this.handleOnChangeInputForm(e)}>
                      <option value='financial'>Financiero</option>
                      <option value='technical'>Técnico</option>
                    </select>
                  </div>
                </div>
    
                <div className='mb-1'>
                  <button variant='primary' size='sm' onClick={() => this.showModalCreate()}>
                    Crear
                  </button>
                </div>
              </form>
            </div>
            {renderValidators()}
            <Modal show={this.state.showModal} onHide={() => this.setState({ showModal: false })}>
              <Modal.Header closeButton>
                <Modal.Title>Confirmar eliminación</Modal.Title>
              </Modal.Header>
              <Modal.Body>{`¿Estás seguro que quieres borrar el usuario ${this.state.userToDelete.username}?`}</Modal.Body>
              <Modal.Footer>
                <button variant='secondary' onClick={() => this.setState({ showModal: false })}>
                  Cancel
                </button>
                <button variant='danger' onClick={() => this.confirmDeleteUser()}>
                  Delete
                </button>
              </Modal.Footer>
            </Modal>
            <Modal show={this.state.showModalCreate} onHide={() => this.setState({ showModalCreate: false })}>
              <Modal.Header closeButton>
                <Modal.Title>Confirmar datos de nuevo usuario</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Sub role</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{this.state.newUser.username}</td>
                      <td>{this.state.newUser.email}</td>
                      <td>{this.state.newUser.role}</td>
                      <td>{this.state.newUser.subRole}</td>
                    </tr>
                  </tbody>
                </table>
              </Modal.Body>
              <Modal.Footer>
                <button variant='secondary' onClick={() => this.setState({ showModalCreate: false })}>
                  Cancel
                </button>
                <button variant='success' onClick={() => this.confirmCreateUser()}>
                  Confirmar
                </button>
              </Modal.Footer>
            </Modal>
          </div>
        );
      }
    }
    
export default Validators