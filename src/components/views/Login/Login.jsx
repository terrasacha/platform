import { Auth, Hub } from 'aws-amplify'
import React, { useEffect, useState } from 'react'
import { Alert, Button, Card, Form } from "react-bootstrap"
// GraphQL
import { API, graphqlOperation } from 'aws-amplify'
import { createUser } from '../../../graphql/mutations'
import s from './Login.module.css'
import LOGO from '../_images/SuanLogoName.svg'
const initialFormState ={
    username: '', password: '',confirmPassword: '', email: '', authCode: '', formType: 'signIn',terms: false, role: 'investor'
}

export default function LogIn() {
    const [formState, updateFormState] = useState(initialFormState)
    const [user, updateUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState({
        username: '', password: '',confirmPassword: '', email: '', authCode: '',terms: false
    })
    
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
        updateFormState(() => ({...formState, [e.target.name]: !formState.terms}))

    }

    const { formType } = formState

    async function signUp(){
        const { username, email, password, role, confirmPassword, terms } = formState
        if(!terms){
            setError({...error, terms: "Debe acertar los términos y condiciones"})
            return
        }
        if(password.length < 8){
            setError({...error, password: "Debe introducir una contraseña"})
            return
        }
        if(username.length < 1){
            setError({...error, username: "Debe introducir un nombre de usuario"})
            return
        }
        if(email.email < 1){
            setError({...error, email: "Debe introducir un mail"})
            return
        }
        if(password === confirmPassword){
            try {
                setError("")
                setLoading(true)
                await Auth.signUp({ username, password, attributes: {
                        email,
                        'custom:role': role  
                    }})
                    setLoading(false)
                updateFormState(() => ({...formState, formType: 'confirmSignUp' }))    
            } catch (error) {
                setLoading(false)
                setError('A user for that e-mail address already exists. Please use a different e-mail address')    
            }
        }else{
            setError('passwords does not match')
        }
        /* if(password === confirmPassword && error.terms !== '' && error.password !== '' && error.username !== ''&& error.email !== ''){
            try {
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
                console.log('A user for that e-mail address already exists. Please use a different e-mail address')    
            }
        }else{
            console.log('debe completar los campos')
        } */
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
    <div className={s.container} >
        <div className={s.firstContainer}>
            <div className={s.info}>
                <h2>Aceleramos la transición hacia un mundo de carbono neutral</h2>
                <p>Somos un motor alternativo para facilitar el desarrollo, financiación e implementación de proyectos de mitigación de cambio climático</p>
            </div>
        </div>
        <div className={s.secondContainer}>
        {
            formType === 'signUp' && (
            
                <div className={s.containerLogin}>
                    <div className={s.containerCard}>
                        <div className={s.containerTitle}>
                            <img src={LOGO} style={{width:'150px'}}/>
                            <h2 className="text-center mb-4">Sign up</h2>
                            
                        </div>
                        <form className={s.inputContainer}>
                            <fieldset>
                                <legend>User Name</legend>
                                <input name='username' onChange={onChange} placeholder='user name' />
                                {error.username? <span style={{color:'red'}}>{error.username}</span>: ''}
                            </fieldset>
                            <fieldset>
                                <legend>Email</legend>
                                <input type='email'name='email' onChange={onChange} placeholder='example@example.com'/>
                                {error.email? <span style={{color:'red'}}>{error.email}</span>: ''}
                            </fieldset>
                            <fieldset>
                                <legend>Password</legend>
                                <input name='password' type='password' onChange={onChange} placeholder='password'/>
                                {error.password? <span style={{color:'red'}}>{error.password}</span>: ''}
                            </fieldset>
                            <fieldset>
                                <legend>Confirm password</legend>
                                <input name='confirmPassword' type='password' onChange={onChange} placeholder='confirm password'/>
                            </fieldset>
                            <fieldset>
                                <legend>Role</legend>
                                <select name="role" onChange={onChange}>
                                    <option value="investor">Investor</option>
                                    <option value="constructor">Constructor</option>
                                    <option value="validator">Validator</option>
                                </select>
                            </fieldset>
                            <fieldset className={s.checkbox}>
                                <input type="checkbox"  name="terms" onChange={onChange}/>
                                <label>Acepto los <a href='/terms_&_conditions' target="_blank">términos y condiciones</a></label>
                                {error.terms? <span style={{color:'red'}}>{error.terms}</span>: ''}
                            </fieldset>
                            <button onClick={signUp} disabled={loading}>{loading?'Loading': 'Sign Up'}</button>
                        </form>
                        <div className={s.needAccount}>
                            Already have an account? <span style={{cursor: 'pointer'}}onClick={() => updateFormState(() => ({
                            ...formState, formType: 'signIn'
                        }))}>Log In</span>
                        </div>
                    </div>
                </div>
                
            )
        }
        {
            formType === 'confirmSignUp' && (
                <div className={s.containerLogin}>
                    <div className={s.containerCard}>
                            <div className={s.containerTitle}>
                                <img src={LOGO} style={{width:'150px'}}/>
                                <h2 className="text-center mb-4">Confirmation</h2>
                            </div>
                            <Alert>Verification code send to {formState.email}</Alert>
                            
                            <form className={s.inputContainer}>
                                <fieldset>
                                    <legend>Confirmation Code</legend>
                                    <input name='authCode' onChange={onChange}/>
                                </fieldset>
                                <button onClick={confirmSignUp} disabled={loading}>
                                    {loading?'Loading': 'Confirm Sign Up'}
                                </button>
                            </form>
                    </div>
                </div>
            )
        }
        {
            formType === 'signIn' && (
            <div className={s.containerLogin}>
                <div className={s.containerCard}>
                    <div className={s.containerTitle}>
                        <img src={LOGO} style={{width:'150px'}}/>
                        <h2 className="text-center mb-4">Log In</h2>
                        
                    </div>
                    <form className={s.inputContainer}>
                        <fieldset>
                            <legend>User Name</legend>
                            <input name='username' onChange={onChange}/>
                        </fieldset>
                        <fieldset>
                            <legend>Password</legend>
                            <input type="password" name='password' onChange={onChange}/>
                        </fieldset>
                        <button disabled={loading} onClick={signIn} >
                            {loading?'Loading': 'Log In'}
                        </button>
                    </form>
                    <div className={s.needAccount}>
                        Need an account? <span style={{cursor: 'pointer'}}onClick={() => updateFormState(() => ({
                            ...formState, formType: 'signUp'
                        }))}>Sign Up</span>
                    </div>
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
        
    </div>
  )
}
