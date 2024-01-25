import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react"
import { channelService } from "../services/channel.service.js"
import { ChatBox } from '../cmps/ChatBox'

import { utilService } from "../services/util.service.js"
import { useSelector } from "react-redux"
import { msgService } from "../services/message.service.js"
import { VideoChatBox } from '../cmps/VideoChatBox.jsx';



export function ChannelChat() {
  const [channel, setChannel] = useState(null)
  const { channelId } = useParams()

  const [msg, setMsg] = useState(utilService.getEmptyMsg())
  // const [review, setReview] = useState(utilService.getEmptyReview())
  const navigate = useNavigate()
  const user = useSelector(storeState => storeState.userModule.loggedinUser)
  const [msgs, setMsgs] = useState([])



  useEffect(() => {
    loadChannel()
    // loadMsgs()
  }, [channelId])

  
  async function loadChannel() {
    try {
      const channel = await channelService.getById(channelId)
      setChannel(channel)

    } catch (err) {
      console.log('Had issues in channel chat ', err)
    }
  }

  async function loadMsgs() {
    try {
      // Create a filter object with both aboutToyId and additional filters
      // const filter = { name: 'exampleFilter', sort: 'exampleSort' };

      // Fetch reviews based on aboutToyId and additional filters
      const msgs = await msgService.query({ aboutChannelId: channelId });
      setMsgs(msgs)
    } catch (err) {
      console.log('Had issues loading msgs', err);
      // showErrorMsg('Cannot load reviews');
    }
  }

  // function handleMsgChange(ev) {
  //   const field = ev.target.name
  //   const value = ev.target.value
  //   setMsg((msg) => ({ ...msg, [field]: value }))
  // }

  // async function onSaveMsg(ev) {
  //   ev.preventDefault()
  //   const savedMsg = await msgService.add({ txt: msg.txt, aboutChannelId: channel._id })
  //   // Update the toy's reviews, not the toy's text
  //   setChannel((prevChannel) => ({
  //     ...prevChannel,
  //     msgs: [...(prevChannel.chatHistory || []), savedMsg],
  //   }))
  //   setMsg(utilService.getEmptyMsg())
  //   // showSuccessMsg('Review saved!')
  // }

  // async function onRemoveMsg(msgId) {
  //   const removedMsgId = await msgService.remove(msgId)
  //   // Update the toy's reviews, not the toy's text
  //   setChannel((prevChannel) => ({
  //     ...prevChannel,
  //     msgs: prevChannel.channelHistory.filter((msg) => removedMsgId !== msg.id),
  //   }))


  //   // showSuccessMsg('Review removed!')
  // }


  // const { txtR } = msg

  if (!channel) return <div className="chat-container"></div>
  
  
  return (
    // <div className="chat-container">
    //   <h2>{channel.name}</h2>

    //   <ChatBox channelId={channel._id} history={channel.chatHistory} /> 
      
    // </div>

    <div className="chat-container">
      <h2>{channel.name}</h2>
        {/* <ChatBox channelId={channel._id} history={channel.chatHistory} /> */}
      
        <ChatBox channelId={channel._id} history={channel.chatHistory} />

      {/* {channel.name !== "Video Chat" ? (
        <ChatBox channelId={channel._id} history={channel.chatHistory} />
      ) : (
        <VideoChatBox />
      )} */}
    </div>
  )

}

{/* <h5 className="toy-description-heading">Reviews</h5>
<ul>
  {msgs.map((msg) => (
    <li key={msg._id}>
      By: {user?.fullname}, {msg} 
      <button type="button" onClick={() => onRemoveMsg(msg.id)}>
        ❌
      </button>
    </li>
  ))}
</ul>

<form className="login-form" onSubmit={onSaveMsg}>
  <input
    type="text"
    name="txt"
    value={txtR}
    placeholder="Write a Review"
    onChange={handleMsgChange}
    required
  />
  <button>Submit Review</button>
</form> */}