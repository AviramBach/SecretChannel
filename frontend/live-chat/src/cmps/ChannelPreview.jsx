import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { ChannelChat } from "../pages/ChannelChat"

export function ChannelPreview({ channel }) {

    
    return (
        <div className="channel-info">
            {/* <h1>channel 1</h1> */}

            <Link className="channel-title"
                to={{
                    pathname: `/channel/${channel._id}`,
                }}
            >
             {/* to={`/channel/:${channel._id}?channel=${channel}`}> */}
                {<h4>{channel.name}</h4>}
            </Link>


        </div>
    )
}