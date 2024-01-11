// import React, { useState } from 'react'
// import _ from 'lodash' // Import lodash
import { ChannelPreview } from './ChannelPreview.jsx'

export function ChannelList({ channels }) {

    return (
        <div>
            { <ul className="channel-list">
                {channels.map((channel) => (
                    <li className="channel-preview" key={channel._id}> 
                        { <ChannelPreview channel={channel} /> }
                    </li>
                ))}
            </ul> }  
        </div>
    )
}

// import React from 'react';
// import Slider from 'react-slick';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';



// export function ChannelList({ channels }) {
//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 3, // Number of slides to show at a time
//     slidesToScroll: 1,
//     vertical: true, // Set vertical sliding
//     verticalSwiping: true,
//   };

//   return (
//     <div>
//       <Slider {...settings}>
//         {channels.map((channel) => (
//           <div key={channel._id} className="channel-preview">
//             <ChannelPreview channel={channel} />
//           </div>
//         ))}
//       </Slider>
//     </div>
//   );
// }