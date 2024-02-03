// import React, { useState } from 'react'
// import _ from 'lodash' // Import lodash
import { ChannelChat } from '../pages/ChannelChat.jsx'
import { ChannelPreview } from './ChannelPreview.jsx'
import { Route, HashRouter as Router, Routes } from 'react-router-dom'

// export function ChannelList({ channels }) {

//     return (
//         <div className="channel-list-container">
//             { <ul className="channel-list">
//                 {channels.map((channel) => (
//                     <li className="channel-preview" key={channel._id}> 
//                         { <ChannelPreview channel={channel} /> }
//                     </li>
//                 ))}
//             </ul> } 

//             {/*THIS IS FOR WHATSUP LAYOUT LOOK ALIKE - LIEL HELP */}

//             {/* <Routes>
//                 <Route element={<ChannelChat />} path="/channel/:channelId" /> 
//             </Routes> */}
//         </div>
//     )
// }

import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { MdOutlineNavigateNext } from "react-icons/md";
import { MdOutlineNavigateBefore } from "react-icons/md";


export function ChannelList({ channels }) {

    const [sliderIndex, setSliderIndex] = useState(0)
    const sliderRef = useRef(null)

    const [loading, setLoading] = useState(true)
    const [slidesToShow, setSlidesToShow] = useState(2)

    useEffect(() => {
        const updateSlidesToShow = () => {
            // Update slidesToShow based on the viewport width
            setSlidesToShow(window.innerWidth < 765 ? 2 : 3);
        }

        // Add event listener for window resize
        window.addEventListener('resize', updateSlidesToShow);

        // Call the function once to set initial value
        updateSlidesToShow();

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('resize', updateSlidesToShow);
        };
    }, [])


    const settings = {
        dots: true,
        arrows: false,
        infinite: true,
        speed: 500,
        slidesToShow: slidesToShow, // Number of slides to show at a time
        slidesToScroll: slidesToShow,
        vertical: false, // Set vertical sliding
        verticalSwiping: false,
        afterChange: (currentSlide) => {
            setSliderIndex(currentSlide)
        },
    };

    const nextChannel = () => {
        if (sliderRef.current) {
            sliderRef.current.slickNext()
        }
    }

    const prevChannel = () => {
        if (sliderRef.current) {
            sliderRef.current.slickPrev()
        }
    }

    if (!channels) {
        // If channels are not available, display a loading bar
        return <div className="loading-bar">Loading...</div>;
    }

    if (loading) {
        // If channels are available, but still loading, set loading state to false
        setTimeout(() => {
            setLoading(false);
        }, 2000); // Simulating a 2-second loading delay, you can adjust this value
        return <div className="loading-bar">Loading...</div>;
    }

    if (!channels) return <div>Server maintenance</div>

    return (
        <div className='channel-list-container'>
            <Slider className="channel-preview-container" ref={sliderRef} {...settings}>
                {channels.map((channel) => (
                    <div className='channel-card'>
                        <div key={channel._id} className="channel-preview">
                            <ChannelPreview channel={channel} />
                        </div>
                    </div>
                ))}
            </Slider>
            <div className="channel-navigation">
                <button className="slider-nav-btn prev" onClick={prevChannel} disabled={sliderIndex === 0}>
                    <MdOutlineNavigateBefore />
                </button>
                <button className="slider-nav-btn next" onClick={nextChannel} disabled={sliderIndex === channels.length - 2}>
                    <MdOutlineNavigateNext />
                </button>
            </div>
        </div>
    );
}

