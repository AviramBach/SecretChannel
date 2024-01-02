import { NavLink } from 'react-router-dom'
// import { LoginSignup } from './LoginSignup'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { logout } from '../store/actions/user.actions.js'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'

export function AppHeader({ onReturnToLanding, onHandleReturnToLanding }) {
    const user = useSelector(storeState => storeState.userModule.loggedinUser)

    const [isDarkMode, setIsDarkMode] = useState(false)
    const [showMenu, setShowMenu] = useState(false)

    useEffect(() => {
        const root = document.documentElement
        if (isDarkMode) {
            root.classList.add('dark-mode')
        } else {
            root.classList.remove('dark-mode')
        }
    }, [isDarkMode])

    async function onLogout() {
        try {
            await logout()
            onHandleReturnToLanding()
            showSuccessMsg('Logout successfully')
        }
        catch (err) {
            console.log('err', err)
            showErrorMsg('Cannot logout')

        }
    }

    function toggleDarkMode() {
        setIsDarkMode(!isDarkMode)
    }

    function toggleMenu() {
        setShowMenu(!showMenu)
    }

    return (
        <header className="app-header">
            <h1>Secret Channel</h1>
            <section className="user-info-container">
                {!user && <span className="user-info">
                    {/* <NavLink title='Login' to="/auth/login"><i className="fa-solid fa-user fa-lg"></i></NavLink> */}
                    <p>
                        Guest
                    </p>
                    <button className='logout-btn' title='logout' onClick={onLogout}>Logout</button>
                </span>}
                {user && <span className="user-info">
                    <p>
                        {user.fullname}
                    </p>
                    <button className='logout-btn' title='logout' onClick={onLogout}>Logout</button>
                </span>}
            </section>

            <nav >
                <button className="hamburger-icon" onClick={toggleMenu}>
                    ☰
                </button>

                <div className={`menu ${showMenu ? 'show' : ''}`}>
                    <button className="close-menu" onClick={toggleMenu}>
                        &times; {/* X button */}
                    </button>
                    <button className="custom-navlink" onClick={toggleDarkMode}>
                        {isDarkMode ? '☀️' : '🌙'}
                    </button>
                    <NavLink className="custom-navlink" title='Home' to="/">Home</NavLink>
                    <NavLink className="custom-navlink" title='Help' to="/help">Help</NavLink>
                    <button className="custom-navlink" onClick={onReturnToLanding}>Login/Signup</button>
                </div>
            </nav>
        </header>
    )
}

