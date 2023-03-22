import { Auth, Hub } from 'aws-amplify'
import React, { useEffect, useState } from 'react'
import { Alert, Button, Card, Form } from "react-bootstrap"
// GraphQL
import { API, graphqlOperation } from 'aws-amplify'
import { createUser } from '../../../graphql/mutations'
import s from './Login.module.css'
import LOGO from '../_images/SuanLogoName.svg'
const initialFormState ={
    username: '', password: '',confirmPassword: '', email: '', authCode: '', formType: 'signUp',terms: false,privacy_policy:false, role: 'investor'
}

export default function LogIn() {
    const [formState, updateFormState] = useState(initialFormState)
    const [user, updateUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [explain, setExplain] = useState('Como inversionista, usted podrá adquirir activos en nuestro marketplace')
    
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
        if(e.target.value === 'investor') setExplain('Como inversionista, usted podrá adquirir activos en nuestro marketplace')
        if(e.target.value === 'constructor') setExplain('Como propietario, usted podrá crear proyectos y ver su evolución')
    }

    const { formType } = formState

    async function signUp(){
        const { username, email, password, role, confirmPassword, terms, privacy_policy } = formState
        if(!terms) setError('Debe aceptar términos y condiciones')
        if(!privacy_policy) setError('Debe aceptar la politica de privacidad')
        if(username.length < 1) setError('Debe ingresar un nombre de usuario')
        if(email.length < 1) setError('Debe ingresar un email')
        if(password === confirmPassword && password.length > 2 && confirmPassword.length > 2){
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
                setExplain('Como inversionista, usted podrá adquirir activos en nuestro marketplace')
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
                            {error && <Alert variant="danger">{error}</Alert>}
                        </div>
                        <form className={s.inputContainer}>
                            <fieldset>
                                <legend>User Name</legend>
                                <input name='username' onChange={onChange} placeholder='user name' />
                            </fieldset>
                            <fieldset>
                                <legend>Email</legend>
                                <input type='email'name='email' onChange={onChange} placeholder='example@example.com'/>
                            </fieldset>
                            <fieldset>
                                <legend>Password</legend>
                                <input name='password' type='password' onChange={onChange} placeholder='password'/>
                            </fieldset>
                            <fieldset>
                                <legend>Confirm password</legend>
                                <input name='confirmPassword' type='password' onChange={onChange} placeholder='confirm password'/>
                            </fieldset>
                            <fieldset>
                                <legend>Role</legend>
                                <select name="role" onChange={onChange}>
                                    <option value="investor">Inversionista</option>
                                    <option value="constructor">Propietario</option>
                                </select>
                            </fieldset>
                            {<p style={{color: '#797979', fontSize:'.8em'}}>{explain}</p>}
                            <fieldset className={s.checkbox}>
                                <input type="checkbox"  name="terms" onChange={() => updateFormState(() => ({...formState, terms: !formState.terms}))}/>
                                <label>Acepto los <a href='/use_terms' target="_blank">términos de uso</a></label>
                            </fieldset>
                            <fieldset className={s.checkbox}>
                                <input type="checkbox"  name="privacy_policy" onChange={() => updateFormState(() => ({...formState, privacy_policy: !formState.privacy_policy}))}/>
                                <label>Acepto la <a href='/privacy_policy' target="_blank">Politica de privacidad</a></label>
                            </fieldset>
                            <button onClick={signUp} disabled={loading || !formState.terms || !formState.privacy_policy}>{loading?'Loading': 'Sign Up'}</button>
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
                            {error && <Alert variant="danger">{error}</Alert>}
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
                        {error && <Alert variant="danger">{error}</Alert>}
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
