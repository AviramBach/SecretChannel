import { useState } from 'react'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { userService } from '../services/user.service.js'
import { login, signup } from '../store/actions/user.actions.js'
import { useNavigate } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'


export function LoginSignup({ onToggleLandingPage }) {

    const [credentials, setCredentials] = useState({ username: '', password: '', fullname: '' })
    const [isSignupState, setIsSignupState] = useState(false)
    const navigate = useNavigate()
    
    
    
    function handleCredentialsChange(ev) {
        const field = ev.target.name
        const value = ev.target.value
        setCredentials(credentials => ({ ...credentials, [field]: value }))
    }
    
    async function onSubmit(ev) {
        ev.preventDefault()
        
        if (isSignupState) {
            try {
                const user = await signup(credentials)
                showSuccessMsg(`Welcome ${user.fullname}`)
                onToggleLandingPage()
                
            }
            catch (err) {
                showErrorMsg('Cannot signup')

            }
        } else {
            try {
                const user = await login(credentials)
                showSuccessMsg(`Hi again ${user.fullname}`)
                onToggleLandingPage()
            }
            catch (err) {
                showErrorMsg('Cannot login')

            }
        }
    }

    function onToggleSignupState() {
        setIsSignupState(isSignupState => !isSignupState)
    }

    const { username, password, fullname } = credentials
    
    return (
        <div className="login-page">
            <h1 className="landing-page-title">Secret Channel</h1>
            <form className="login-form" onSubmit={onSubmit}>
                <TextField
                    className="login-input"
                    type="text"
                    name="username"
                    variant="outlined"
                    label="User name"
                    value={username}
                    placeholder="Username"
                    onChange={handleCredentialsChange}
                    required
                    autoFocus
                />

                <TextField
                    className="login-input"
                    type="password"
                    name="password"
                    variant="outlined"
                    label="Password"
                    value={password}
                    // placeholder="Password"
                    onChange={handleCredentialsChange}
                    required
                />

                {isSignupState && (
                    <TextField
                        className="login-input"
                        type="text"
                        name="fullname"
                        variant="outlined"
                        label="Full name"
                        value={fullname}
                        // placeholder="Full name"
                        onChange={handleCredentialsChange}
                        required
                    />
                )}
                
                <Button className="login-button"  type="submit" onSubmit={onSubmit} variant="outlined" >
                    {isSignupState ? 'Signup' : 'Login'}
                </Button>
                {/* <button>Login!</button> */}
            </form>

            <div className="btns">
                <a className="toggle-signup-link" href="#" onClick={onToggleSignupState}>
                    {isSignupState ? 'Already a member? Login' : 'New user? Signup here'}
                </a>
            </div>
            <button className="guest-login-btn" onClick={onToggleLandingPage}>Enter as a Guest</button>
        </div>
    )
}