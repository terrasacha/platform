import { Auth, Hub } from 'aws-amplify'
import React, { useEffect, useState } from 'react'
import { Alert, Button, Card, Form } from "react-bootstrap"
// GraphQL
import { API, graphqlOperation } from 'aws-amplify'
import { createUser } from '../../../graphql/mutations'
const initialFormState ={
    username: '', password: '',confirmPassword: '', email: '', authCode: '', formType: 'signIn', role: 'investor'
}

export default function LogIn() {
    const [formState, updateFormState] = useState(initialFormState)
    const [user, updateUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    
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
        const { username, email, password, role, confirmPassword } = formState
        if(password === confirmPassword){
            try {
                setError("")
                setLoading(true)
                let response = await Auth.signUp({ username, password, attributes: {
                        email,
                        'custom:role': role  
                    }})
                console.log(response, 'response')
                const userPayload = {
                    id: response.userSub,
                    name: username,
                    isProfileUpdated: true,
                    role: role
                }
                await API.graphql(graphqlOperation(createUser, { input: userPayload }))
                    setLoading(false)
                updateFormState(() => ({...formState, formType: 'confirmSignUp' }))    
            } catch (error) {
                setLoading(false)
                setError('A user for that e-mail address already exists. Please use a different e-mail address')    
            }
        }else{
            setError('passwords does not match')
        }
    }

    async function confirmSignUp(){
        try {
            setError("")
            const { username, authCode } = formState
            setLoading(true)
            await Auth.confirmSignUp( username, authCode )
            setLoading(false)
            updateFormState(() => ({...formState, formType: 'signIn' }))
        } catch (error) {
            setLoading(false)
            updateFormState({...formState, authCode: ''})
            setError('code does not match')
        }
    }

    async function signIn(){
        const { username, password } = formState
        try {
            setError("")
            setLoading(true)
            await Auth.signIn( username, password  )
            updateFormState(() => ({...formState, formType: 'signedIn' }))
            let currentUser = await Auth.currentAuthenticatedUser()
            currentUser = currentUser.attributes['custom:role']
            localStorage.setItem('role', currentUser)    
        } catch (error) {
            setError("Combination of account name and user name does not exist.")
        }
        setLoading(false)
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
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form>
                                <Form.Group>
                                    <Form.Label>User Name</Form.Label>
                                    <Form.Control name='username' onChange={onChange} placeholder='user name' />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type='email'name='email' onChange={onChange} placeholder='example@example.com'/>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control name='password' type='password' onChange={onChange} placeholder='password'/>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Confirm password</Form.Label>
                                    <Form.Control name='confirmPassword' type='password' onChange={onChange} placeholder='confirm password'/>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Role</Form.Label>
                                    <Form.Select name="role" onChange={onChange}>
                                        <option value="investor">Investor</option>
                                        <option value="constructor">Constructor</option>
                                        <option value="validator">Validator</option>
                                    </Form.Select>
                                </Form.Group>
                                <Button onClick={signUp} disabled={loading} className='w-100 mt-4'>{loading?'Loading': 'Sign Up'}</Button>
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
                        <Alert>Verification code send to {formState.email}</Alert>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form>
                        <Form.Group>
                            <Form.Label>Confirmation Code</Form.Label>
                            <Form.Control name='authCode' onChange={onChange}/>
                        </Form.Group>
                        <Button onClick={confirmSignUp} disabled={loading} className="w-100 mt-4">
                            {loading?'Loading': 'Confirm Sign Up'}
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
                     {error && <Alert variant="danger">{error}</Alert>}
                     <Form>
                       <Form.Group>
                         <Form.Label>User Name</Form.Label>
                         <Form.Control name='username' onChange={onChange}/>
                       </Form.Group>
                       <Form.Group>
                         <Form.Label>Password</Form.Label>
                         <Form.Control type="password" name='password' onChange={onChange}/>
                       </Form.Group>
                       <Button className="w-100 mt-4" disabled={loading} onClick={signIn} >
                            {loading?'Loading': 'Log In'}
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
