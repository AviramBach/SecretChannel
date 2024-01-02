import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { socketService, SOCKET_EMIT_SEND_MSG, SOCKET_EMIT_TYPING, SOCKET_EMIT_STOP_TYPING, SOCKET_EMIT_TOPIC, SOCKET_EMIT_NEW_MSG, SOCKET_EVENT_TYPING, SOCKET_EVENT_STOP_TYPING, SOCKET_EVENT_ADD_MSG } from '../services/socket.service'
// import { log } from '../../../backend/middlewares/logger.middleware'
import { msgService } from '../services/message.service'
import { utilService } from '../services/util.service'
import { log } from '../../../../backend/middlewares/logger.middleware'

export function ChatBox({ channelId, history }) {

    const parsedChatHistory = history.map(message => JSON.parse(message))
    const [msg, setMsg] = useState('')
    const [msgs, setMsgs] = useState(parsedChatHistory || [])
    const [typingUser, setTypingUser] = useState(null)
    const user = useSelector((storeState) => storeState.userModule.loggedinUser)
    const timeoutId = useRef(null)
    const msgsContainerRef = useRef(null)

    const [from, setUserFrom] = useState('');
    const [colorMap, setColorMap] = useState({})
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [randomFourDigitNumber, setRandomFourDigitNumber] = useState(0);
    
    useEffect(() => {
        setRandomFourDigitNumber(Math.floor(1000 + Math.random() * 9000));
      }, [])

    useEffect(() => {
        // Join room
        socketService.emit(SOCKET_EMIT_TOPIC, channelId)

        // Add listeners
        socketService.on(SOCKET_EVENT_ADD_MSG, addMsg)
        socketService.on(SOCKET_EVENT_TYPING, addTypingUser)
        socketService.on(SOCKET_EVENT_STOP_TYPING, removeTypingUser)

        // Remove on unmount
        return () => {
            socketService.off(SOCKET_EMIT_SEND_MSG, addMsg)
            socketService.off(SOCKET_EMIT_TYPING, addTypingUser)
            socketService.off(SOCKET_EMIT_STOP_TYPING, removeTypingUser)
            clearTimeout(timeoutId.current)
            // socketService.terminate()
        }
    }, [])

    useEffect(() => {
        if (msgsContainerRef.current) {
            msgsContainerRef.current.scrollTop = msgsContainerRef.current.scrollHeight;
        }

    }, [msgs]);



    async function updateChatHistoryInBackend(channelId, newMsg) {
        try {
            // Make an API request to your backend to update chat history

            newMsg.channelId = channelId;
            console.log(newMsg);
            msgService.add(newMsg)

            // Handle response as needed
            // Maybe log success or handle errors
        } catch (error) {
            // Handle error, maybe log it or show a notification to the user
        }
    }

    function addMsg(newMsg) {
        // console.log('new msg', newMsg)
        updateChatHistoryInBackend(channelId, newMsg)

        setMsgs((prevMsgs) => [...prevMsgs, newMsg])

    }

    function addTypingUser(user) {
        setTypingUser(user)
    }

    function removeTypingUser() {
        setTypingUser(null)
    }

    function handleChange(ev) {
        ev.preventDefault()

        setMsg(ev.target.value)

        // If there is no timeout yet - emit typing! - will happen only once!
        if (!timeoutId.current) socketService.emit(SOCKET_EMIT_TYPING, user?.fullname || 'Guest')
        // If there is a timeout - clear it!
        if (timeoutId.current) clearTimeout(timeoutId.current)
        // reactivate the timeout - when calling the CB - stop typing + clear timeoutId
        timeoutId.current = setTimeout(() => {
            socketService.emit(SOCKET_EMIT_STOP_TYPING, user?.fullname || 'Guest')
            timeoutId.current = null
        }, 2000);

        // Or basicly use debounce...........
    }


    function sendMessage(ev) {
        ev.preventDefault()

        if (!msg) return //defense for sending blank txt messages



        //when we stop using prompt we need to cancel this://
        const from = user?.fullname || `Guest${randomFourDigitNumber}`
        
        
        // const from = user?.fullname || 'Guest'

        socketService.emit(SOCKET_EMIT_NEW_MSG, { time: utilService.getCurrentTime(), from, txt: msg })
        socketService.emit(SOCKET_EMIT_STOP_TYPING, from)

        // clear timeout and current!
        clearTimeout(timeoutId.current)
        timeoutId.current = null
        setMsg('')

    }


    ///////////////////////TEST ONLY////////////////////////////
    //when deleting this dont forget line 107

    // useEffect(() => {
    //     if (!from) {
    //         console.log('useEffect triggered for prompting name');
    //         const name = prompt('Please enter your name:');
    //         setUserFrom(name || 'Guest');

    //     }
    // }, []);



    ///////////////////////////////////////////////////

    function getRandomColor() {
        const getRandomComponent = () => {
            const value = Math.floor(Math.random() * 225); // Generating values up to 155 for darker colors
            const hex = value.toString(16);
            return hex.length === 1 ? '0' + hex : hex; // Ensure two digits
        };

        const red = getRandomComponent()
        const green = getRandomComponent()
        const blue = getRandomComponent()

        return `#${red}${green}${blue}`
    }

    useEffect(() => {
        const uniqueFroms = Array.from(new Set(msgs.map(msg => msg.from)))

        // Generating random colors for each unique 'msg.from'
        const updatedColorMap = { ...colorMap }; // Copy current colorMap

        uniqueFroms.forEach(from => {
            if (!updatedColorMap[from]) {
                updatedColorMap[from] = getRandomColor();
            }
        });

        setColorMap(updatedColorMap); // Update colorMap state
    }, [msgs])


    function handleEmojiClick(emoji) {
        setMsg(prevMsg => prevMsg + emoji);
        // setShowEmojiPicker(false);
    }

    function toggleEmojiPicker() {
        setShowEmojiPicker(prevState => !prevState);
    }

    const emojiList = [
        '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗',
        '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟',
        '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶',
        '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧',
        '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈',
        '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽',
        '🙀', '😿', '😾', '👐', '🙌', '👏', '🤝', '👍', '👎', '👊', '✊', '🤛', '🤜', '🤞', '✌️', '🤟', '🤘', '👌',
        '👈', '👉', '👆', '👇', '☝️', '✋', '🤚', '🖐️', '🖖', '👋', '🤙', '💪', '🦾', '🖕', '✍️', '🤳', '💅',
        '🦶', '🦵', '🦿', '🦾', '🦷', '🦴', '👄', '🦻', '👂', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️',
        '👅', '👶', '👦', '👧', '🧑', '👱', '👨', '🧔', '👱‍♂️', '👨‍🦰', '👨‍🦱', '👨‍🦳', '👨‍🦲', '🧔‍♂️', '👩',
        '👱‍♀️', '👩‍🦰', '👩‍🦱', '👩‍🦳', '👩‍🦲', '🧔‍♀️', '👴', '👵', '🙍', '🙍‍♂️', '🙍‍♀️', '🙎', '🙎‍♂️',
        '🙎‍♀️', '🙅', '🙅‍♂️', '🙅‍♀️', '🙆', '🙆‍♂️', '🙆‍♀️', '💁', '💁‍♂️', '💁‍♀️', '🙋', '🙋‍♂️', '🙋‍♀️',
        '🧏', '🧏‍♂️', '🧏‍♀️', '🙇', '🙇‍♂️', '🙇‍♀️', '🤦', '🤦‍♂️', '🤦‍♀️', '🤷', '🤷‍♂️', '🤷‍♀️', '🧑‍⚕️',
        '👨‍⚕️', '👩‍⚕️', '🧑‍🎓', '👨‍🎓', '👩‍🎓', '🧑‍🏫', '👨‍🏫', '👩‍🏫', '🧑‍⚖️', '👨‍⚖️', '👩‍⚖️', '🧑‍🌾',
        '👨‍🌾', '👩‍🌾', '🧑‍🍳', '👨‍🍳', '👩‍🍳', '🧑‍🔧', '👨‍🔧', '👩‍🔧', '🧑‍🏭', '👨‍🏭', '👩‍🏭', '🧑‍💼',
        '👨']

    return (
        <div className="channel-chat-container">
            <ul className="msgs-container" ref={msgsContainerRef}>
                {msgs.map((msg, idx) => (
                    <li key={idx}>
                        {/* <p className="msg-container">
                            {`${msg.time} ${msg.from}: ${msg.txt}`}
                        </p> */}

                        {/* <p dangerouslySetInnerHTML={{
                            __html: `${msg.time} <span style="color:${colorMap[msg.from]}">${msg.from}:</span> ${msg.txt}`
                        }}></p> */}

                        <p
                            className="msg-container"
                            dangerouslySetInnerHTML={{
                                __html: `<span class="msg-time">${msg.time}</span> <span class="msg-from" style="color:${colorMap[msg.from]}">${msg.from}:</span> ${msg.txt}`
                            }}
                        ></p>
                    </li>
                ))}
            </ul>

            <form onSubmit={sendMessage}>
                <input type="text" placeholder="Enter your message here..." value={msg} onChange={handleChange} />
                <button type="button" className='emoji-btn' onClick={toggleEmojiPicker}>😀</button>
                <button className='send-btn'>{'>>'}</button>
                {typingUser && <p className="typing-msg"> {typingUser} is typing...</p>}
            </form>
            {showEmojiPicker && (
                <div className="emoji-picker">
                    {emojiList.map((emoji, index) => (
                        <button key={index} onClick={() => handleEmojiClick(emoji)}>{emoji}</button>
                    ))}
                </div>
            )}
        </div>
    )
}
