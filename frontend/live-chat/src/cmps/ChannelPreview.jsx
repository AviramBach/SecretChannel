import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { ChannelChat } from "../pages/ChannelChat"

import { Unsplash } from './Unsplash';


export function ChannelPreview({ channel }) {


    return (
        <div className="channel-info">
            {/* <h1>channel 1</h1> */}

            {<h3 className="channel-title-description">{channel.name}</h3>}
            <Link className="channel-title"
                to={{
                    pathname: `/channel/${channel._id}`,
                }}
                >
                {/* to={`/channel/:${channel._id}?channel=${channel}`}> */}
                
                
                <Unsplash channelTheme={channel.theme} />

            </Link>
                <p className="channel-description">{channel.description}</p>



        </div>
    )
}