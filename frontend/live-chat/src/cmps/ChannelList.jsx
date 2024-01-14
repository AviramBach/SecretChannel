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

import React, { useState, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { MdOutlineNavigateNext } from "react-icons/md";
import { MdOutlineNavigateBefore } from "react-icons/md";


export function ChannelList({ channels }) {

    const [sliderIndex, setSliderIndex] = useState(0);
    const sliderRef = useRef(null);

    const settings = {
        dots: true,
        arrows: false,
        infinite: false,
        speed: 500,
        slidesToShow: 2, // Number of slides to show at a time
        slidesToScroll: 2,
        vertical: false, // Set vertical sliding
        verticalSwiping: false,
        afterChange: (currentSlide) => {
            setSliderIndex(currentSlide);
        },
    };

    const nextChannel = () => {
        if (sliderRef.current) {
            sliderRef.current.slickNext();
        }
    };

    const prevChannel = () => {
        if (sliderRef.current) {
            sliderRef.current.slickPrev();
        }
    };


    if (!channels) return <div>Server maintenance</div>
    return (
        <div className='channel-list-container'>
            <Slider className="channel-preview-container" ref={sliderRef} {...settings}>
                {channels.map((channel) => (
                    <div key={channel._id} className="channel-preview">
                        <ChannelPreview channel={channel} />
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

