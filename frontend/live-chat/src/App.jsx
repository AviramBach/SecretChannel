import { useState, useEffect } from 'react'
import { Route, HashRouter as Router, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { AppHeader } from './cmps/AppHeader'
import { HomePage } from './pages/HomePage'
import { HelpPage } from './pages/HelpPage'
import { ChannelChat } from './pages/ChannelChat'
import { LoginSignup } from './cmps/LoginSignup'


import './assets/style/main.scss'

// import { ToyIndex } from './pages/ToyIndex'
// import { UserMsg } from './cmps/UserMsg'
// import { DashboardPage } from './pages/DashboardPage'
// import { AboutPage } from './pages/AboutPage'
// import { LoginSignup } from './cmps/LoginSignup'
// import { ReviewExplore } from './pages/ReviewExplore'

// import './assets/style/App.css'
// import './assets/style/index.css'




export default function App() {

    const [isLandingPage, setIsLandingPage] = useState(true)

    const toggleLandingPage = () => {
        setIsLandingPage(!isLandingPage)
    }

    const handleReturnToLanding = () => {
        setIsLandingPage(true)
    }


    return (
        <Provider store={store}>
            <Router>
            <section className= "main-layout app">
                    {/* <UserMsg /> */}
                    {/* <section className='user-box'>
                        <LoginSignup />
                    </section> */}

                    {isLandingPage ? (
                        <section className="landing-content">
                            <LoginSignup onToggleLandingPage={toggleLandingPage} />
                        </section>
                    ) : (
                        <>
                            <AppHeader onReturnToLanding={handleReturnToLanding} onHandleReturnToLanding={handleReturnToLanding}/>
                            <Routes>
                                <Route element={<HomePage />} path="/" />
                                <Route element={<HelpPage />} path="/help" />
                                <Route element={<ChannelChat />} path="/channel/:channelId" />
                                
                            </Routes>
                            {/* <AppFooter /> */}
                        </>
                     )} 
                </section>
            </Router>
        </Provider>

    )
}


