import { Auth, Hub } from 'aws-amplify'
import React, { useEffect, useState } from 'react'
import { Button, Card, Form } from "react-bootstrap"
const initialFormState ={
    username: '', password: '', email: '', authCode: '', formType: 'signIn', role: ''
}

export default function LogIn() {
    const [formState, updateFormState] = useState(initialFormState)
    const [user, updateUser] = useState(null)
    
    useEffect(() => {
        checkUser()
        setAuthListener()
    }, [])
    async function setAuthListener(){
        Hub.listen('auth', (data) => {
            switch (data.payload.event) {
              case 'signOut':
                updateFormState(() => ({...formState, formType: 'signUp' }))
                  break;
                default:
                    break;
            }
          });
    }
    async function checkUser(){
        try {
            const user = await Auth.currentAuthenticatedUser()
            updateUser(user)
            updateFormState(() => ({...formState, formType: 'signedIn' }))
        } catch (err) {
           // updateUser(null)
        }
    }
    function onChange(e){
        e.persist()
        updateFormState(() => ({...formState, [e.target.name]: e.target.value}))

    }
    const { formType } = formState
    async function signUp(){
        const { username, email, password, role } = formState
        await Auth.signUp({ username, password, attributes: {
             email,
             'custom:role': role  
            }})
        updateFormState(() => ({...formState, formType: 'confirmSignUp' }))
    }
    async function confirmSignUp(){
        const { username, authCode } = formState
        await Auth.confirmSignUp( username, authCode )
        updateFormState(() => ({...formState, formType: 'signIn' }))
    }
    async function signIn(){
        const { username, password } = formState
        await Auth.signIn( username, password  )
        updateFormState(() => ({...formState, formType: 'signedIn' }))
        let currentUser = await Auth.currentAuthenticatedUser()
        currentUser = currentUser.attributes['custom:role']
        localStorage.setItem('role', currentUser)
    }
  return (
    <div className='d-flex align-items-center justify-content-center' 
    style={{minHeight: "100vh"}}>
        {
            formType === 'signUp' && (
            
                <div className='w-100' style={{maxWidth: '400px'}}>
                    <Card>
                        <Card.Body>
                            <h2 className='text-center mb-4'>Sign Up</h2>
                            <Form>
                                <Form.Group>
                                    <Form.Label>User Name</Form.Label>
                                    <Form.Control name='username' onChange={onChange} placeholder='user name' />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type='email'name='email' onChange={onChange} placeholder=''/>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control name='password' type='password' onChange={onChange} placeholder='password'/>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Role</Form.Label>
                                    <Form.Select name="role" onChange={onChange}>
                                        <option value="investor">Investor</option>
                                        <option value="admon">Admon</option>
                                        <option value="constructor">Constructor</option>
                                    </Form.Select>
                                </Form.Group>
                                <Button onClick={signUp} className='w-100 mt-4'>Sign Up</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                    <div className='w-100 text-center mt-2'>
                        Already have an account? <span style={{cursor: 'pointer'}}onClick={() => updateFormState(() => ({
                        ...formState, formType: 'signIn'
                    }))}>Log In</span>
                    </div>
                </div>
                
            )
        }
        {
            formType === 'confirmSignUp' && (
                <div className='w-100' style={{maxWidth: '400px'}}>
                    <Card>
                    <Card.Body>
                        <h2 className="text-center mb-4">Confirmation</h2>
                        <Form>
                        <Form.Group>
                            <Form.Label>Confirmation Code</Form.Label>
                            <Form.Control name='authCode' onChange={onChange}/>
                        </Form.Group>
                        <Button onClick={confirmSignUp} className="w-100 mt-4">
                            Confirm Sign Up
                        </Button>
                        </Form>
                    </Card.Body>
                    </Card>
                </div>
            )
        }
        {
            formType === 'signIn' && (
                 <div className='w-100' style={{maxWidth: '400px'}}>
                 <Card>
                   <Card.Body>
                     <h2 className="text-center mb-4">Log In</h2>
                     <Form>
                       <Form.Group>
                         <Form.Label>User Name</Form.Label>
                         <Form.Control name='username' onChange={onChange}/>
                       </Form.Group>
                       <Form.Group>
                         <Form.Label>Password</Form.Label>
                         <Form.Control type="password" name='password' onChange={onChange}/>
                       </Form.Group>
                       <Button className="w-100 mt-4" onClick={signIn} >
                         Log In
                       </Button>
                     </Form>
                   </Card.Body>
                 </Card>
                 <div className="w-100 text-center mt-2">
                   Need an account? <span style={{cursor: 'pointer'}}onClick={() => updateFormState(() => ({
                        ...formState, formType: 'signUp'
                    }))}>Sign Up</span>
                 </div>
               </div>
            )
        }
        {
            formType === 'signedIn' && (
                window.location.href="/"
                )
        }
    </div>
  )
}
