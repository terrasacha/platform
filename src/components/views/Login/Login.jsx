import { Auth, Hub } from 'aws-amplify'
import React, { useEffect, useState } from 'react'

const initialFormState ={
    username: '', password: '', email: '', authCode: '', formType: 'signUp', role: ''
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
    async function signOut(){
        Auth.signOut()
        localStorage.removeItem('role');
        window.location.href="/"
    }
  return (
    <div>
        {
            formType === 'signUp' && (
                <div>
                    <input name='username' onChange={onChange} placeholder='username'/>
                    <input name='password' type='password' onChange={onChange} placeholder='password'/>
                    <input name='email' onChange={onChange} placeholder='email'/>
                    <select name="role" onChange={onChange}>
                        <option value="investor">Investor</option>
                        <option value="admon">Admon</option>
                        <option value="constructor">Constructor</option>
                    </select>
                    <button onClick={signUp}>Sign Up</button>
                    <button onClick={() => updateFormState(() => ({
                        ...formState, formType: 'signIn'
                    }))}>Sign In</button>
                </div>
            )
        }
        {
            formType === 'confirmSignUp' && (
                <div>
                    <input name='authCode' onChange={onChange} placeholder='Confirmation code'/>
                    <button onClick={confirmSignUp}>Confirm Sign Up</button>
                </div>
            )
        }
        {
            formType === 'signIn' && (
                <div>
                    <input name='username' onChange={onChange} placeholder='username'/>
                    <input name='password' type='password' onChange={onChange} placeholder='password'/>

                    <button onClick={signIn}>Sign In</button>
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
