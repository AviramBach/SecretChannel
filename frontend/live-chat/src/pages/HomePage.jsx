// import logoUrl from '../assets/img/logo.png'
import { ChannelList } from '../cmps/ChannelList.jsx'
import { loadChannels } from '../store/actions/channel.action.js'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'


export function HomePage() {
    const { channels } = useSelector(storeState => storeState.channelModule)
    // const filterBy = useSelector(storeState => storeState.toyModule.filterBy)

    useEffect(() => {
        try {
            loadChannels()

        } catch (err) {
            console.log('err:', err)
            showErrorMsg('Cannot load channels')
        }
    }, [])
    // }, [filterBy])

    return (
        <section className='home-section'>
            <h2>Channels</h2>
            {/* <img src={logoUrl} alt='App Logo' /> */}
            
            <ChannelList 
            channels = {channels}
            />
        </section >
    )
}