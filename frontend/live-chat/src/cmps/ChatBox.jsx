import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { socketService, SOCKET_EMIT_SEND_MSG, SOCKET_EMIT_TYPING, SOCKET_EMIT_STOP_TYPING, SOCKET_EMIT_TOPIC, SOCKET_EMIT_NEW_MSG, SOCKET_EVENT_TYPING, SOCKET_EVENT_STOP_TYPING, SOCKET_EVENT_ADD_MSG } from '../services/socket.service'
// import { log } from '../../../backend/middlewares/logger.middleware'
import { msgService } from '../services/message.service'
import { utilService } from '../services/util.service'
import { log } from '../../../../backend/middlewares/logger.middleware'

import { MdSearch } from 'react-icons/md'
import { MdArrowCircleDown } from 'react-icons/md'
import { MdArrowCircleUp } from 'react-icons/md'
import { IoMicOffCircle } from "react-icons/io5";
import { IoMicCircleSharp } from "react-icons/io5";
import { TbMessageCircleSearch } from "react-icons/tb";
import { GrSend } from "react-icons/gr";
import { FaRegSmileWink } from "react-icons/fa";

export function ChatBox({ channelId, history }) {

    const parsedChatHistory = history.map(message => JSON.parse(message))
    const [msg, setMsg] = useState('')
    const [msgs, setMsgs] = useState(parsedChatHistory || [])
    const [typingUser, setTypingUser] = useState(null)
    const user = useSelector((storeState) => storeState.userModule.loggedinUser)
    const timeoutId = useRef(null)
    const msgsContainerRef = useRef(null)

    const [from, setUserFrom] = useState('')
    const [colorMap, setColorMap] = useState({})
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [randomFourDigitNumber, setRandomFourDigitNumber] = useState(0)


    const [searchTerm, setSearchTerm] = useState('')
    const [highlightedMessages, setHighlightedMessages] = useState([])
    const [showSearchInput, setShowSearchInput] = useState(false)

    const [highlightedIndex, setHighlightedIndex] = useState(-1)
    const [isHighlightedMsg, setIsHighlightedMsg] = useState(false)

    const [transcript, setTranscript] = useState('')
    const [listening, setListening] = useState(false)
    const [recognition, setRecognition] = useState(null)


    useEffect(() => {
        const recognitionInstance = new window.webkitSpeechRecognition()

        recognitionInstance.continuous = true
        recognitionInstance.interimResults = true

        recognitionInstance.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript
            setTranscript(transcript)
        }

        setRecognition(recognitionInstance)

        return () => {
            if (recognitionInstance) {
                recognitionInstance.stop()
            }
        }
    }, [])

    const toggleListening = () => {
        if (recognition) {
            if (!listening) {
                recognition.start()
                setListening(true)
                console.log("Listening started")
            } else {
                recognition.stop()
                setListening(false)
                console.log("Listening stopped")
            }
        } else {
            console.log("Recognition not available")
        }
    }


    useEffect(() => {
        if (transcript) {
            setMsg(transcript)
        }
    }, [transcript])

    useEffect(() => {
        setRandomFourDigitNumber(Math.floor(1000 + Math.random() * 9000))
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
            msgsContainerRef.current.scrollTop = msgsContainerRef.current.scrollHeight
        }
    }, [msgs])

    const handleSearch = () => {
        const foundMessages = msgs.filter(
            (message) => message.txt.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setHighlightedMessages(foundMessages)
        setHighlightedIndex(foundMessages.length > 0 ? 0 : -1)
    }


    function handleKeyDown(e){
        if (highlightedMessages.length > 0) {
            if (e.key === 'ArrowUp') {
                e.preventDefault()
                setHighlightedIndex((prevIndex) =>
                    prevIndex <= 0 ? highlightedMessages.length - 1 : prevIndex - 1
                )
            } else if (e.key === 'ArrowDown') {
                e.preventDefault()
                setHighlightedIndex((prevIndex) =>
                    prevIndex >= highlightedMessages.length - 1 ? 0 : prevIndex + 1
                )
            }
        }
    }

    const scrollToHighlightedMessage = () => {
        if (highlightedMessages.length > 0 && msgsContainerRef.current) {
            const highlightedMsg = msgsContainerRef.current.querySelector('.highlighted-msg')
            if (highlightedMsg) {
                let scrollPosition = highlightedMsg.offsetTop - msgsContainerRef.current.offsetTop
                console.log('Scroll Position:', scrollPosition)

                msgsContainerRef.current.scrollTo({
                    top: scrollPosition,
                    behavior: 'smooth'
                })
            }
        }
    }

    const handlePrevious = () => {
        setHighlightedIndex((prevIndex) =>
            // prevIndex <= 0 ? highlightedMessages.length - 1 : prevIndex - 1
            prevIndex <= 0 ? highlightedMessages.length - 1 : prevIndex - 1
        )
        console.log('Previous Index:', highlightedIndex)
        scrollToHighlightedMessage()
    }

    const handleNext = () => {
        setHighlightedIndex((prevIndex) =>
            prevIndex >= highlightedMessages.length - 1 ? 0 : prevIndex + 1
        )
        console.log('Next Index:', highlightedIndex)
        scrollToHighlightedMessage()
    }

   
    useEffect(() => {
        if (msgsContainerRef.current) {
            msgsContainerRef.current.scrollTop = msgsContainerRef.current.scrollHeight
        }
    }, [msgs])

    useEffect(() => {
        if (highlightedMessages.length > 0 && msgsContainerRef.current) {
            const highlightedMsg = msgsContainerRef.current.querySelector('.highlighted-msg')
            if (highlightedMsg) {
                msgsContainerRef.current.scrollTop = highlightedMsg.offsetTop - msgsContainerRef.current.offsetTop
            }
        }
    }, [highlightedMessages, highlightedIndex])

    async function updateChatHistoryInBackend(channelId, newMsg) {
        try {
            newMsg.channelId = channelId;
            console.log(newMsg);
            msgService.add(newMsg)

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
        }, 2000)
    }


    function sendMessage(ev) {
        ev.preventDefault()

        if (!msg) return //defense for sending blank txt messages
        if (recognition) {
            recognition.stop()
            setListening(false)
            console.log("Listening stopped")
        }


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

    function getRandomColor() {
        const getRandomComponent = () => {
            const value = Math.floor(Math.random() * 185) // Generating values up to 155 for darker colors
            const hex = value.toString(16)
            return hex.length === 1 ? '0' + hex : hex; // Ensure two digits
        }

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
                updatedColorMap[from] = getRandomColor()
            }
        })

        setColorMap(updatedColorMap) // Update colorMap state
    }, [msgs])


    function handleEmojiClick(emoji) {
        setMsg(prevMsg => prevMsg + emoji)
        // setShowEmojiPicker(false);
    }

    function toggleEmojiPicker() {
        setShowEmojiPicker(prevState => !prevState)
    }

    function toggleSearchInput() {
        setShowSearchInput(prevState => !prevState)
        setSearchTerm('')
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

            {showSearchInput && <div className="search-container">
                <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                {/* <button className="search-btn" onClick={handleSearch}>Search</button> */}

                <button className="start-search-btn" onClick={handleSearch}>
                    <TbMessageCircleSearch />
                </button>
                <button type="button" className='arrow-btn' onClick={handlePrevious}>
                    <MdArrowCircleUp />
                </button>
                <button type="button" className='arrow-btn' onClick={handleNext}>
                    <MdArrowCircleDown />
                </button>

            </div>}

            <button type="button" className='search-btn' onClick={toggleSearchInput}>
                <MdSearch />
            </button>

            <ul className="msgs-container" ref={msgsContainerRef}>
                {msgs.map((msg, idx) => (
                    <li className="card-msg-container" key={idx}>
                        {/* <p className="msg-container">
                            {`${msg.time} ${msg.from}: ${msg.txt}`}
                        </p> */}

                        {/* <p dangerouslySetInnerHTML={{
                            __html: `${msg.time} <span style="color:${colorMap[msg.from]}">${msg.from}:</span> ${msg.txt}`
                        }}></p> */}

                        {/* <p
                            className="msg-container"
                            dangerouslySetInnerHTML={{
                                __html: `<span class="msg-time">${msg.time}</span>
                                 <span class="msg-from" style="color:${colorMap[msg.from]}">${msg.from}:</span> ${msg.txt}`
                            }}
                        ></p> */}

                        {/* <p
                            className="msg-container"
                            dangerouslySetInnerHTML={{
                                __html: `<span class="msg-time">${msg.time}</span> <span class="msg-from" style="color:${colorMap[msg.from]}">${msg.from}:</span> ${highlightedMessages.includes(msg) ? msg.txt.replace(
                                    new RegExp(`(${searchTerm})`, 'gi'),
                                    '<span class="highlighted">$1</span>'
                                ) : msg.txt
                                    }`
                            }}
                        ></p> */}

                        <p
                            className={`${highlightedMessages.includes(msg) && idx === highlightedIndex
                                ? 'highlighted-msg' : ''} ${msg.from === user?.fullname || msg.from == `Guest${randomFourDigitNumber}` ? 'user-msg' : 'no-user-msg'}`}
                            dangerouslySetInnerHTML={{
                                __html: `<span class="msg-time">${msg.time}</span> <span class="msg-from" style="color:${colorMap[msg.from]}">${msg.from}:</span> 
                                ${highlightedMessages.includes(msg) ? msg.txt.replace(
                                    new RegExp(`(${searchTerm})`, 'gi'), '<span class="highlighted">$1</span>') : msg.txt}`
                            }}
                        ></p>
                    </li>
                ))}
            </ul>

                {showEmojiPicker && (
                    <div className="emoji-picker">
                        {emojiList.map((emoji, index) => (
                            <button key={index} onClick={() => handleEmojiClick(emoji)}>{emoji}</button>
                        ))}
                    </div>
                )}
                
            <form onSubmit={sendMessage}>
                <input type="text" placeholder="Enter your message here..." value={msg} onChange={handleChange} />
                <button type="button" className='emoji-btn' onClick={toggleEmojiPicker}>
                    <FaRegSmileWink />
                </button>
                <button className="listening-btn" type="button" onClick={toggleListening}>
                    {listening ? <IoMicOffCircle /> : <IoMicCircleSharp />}
                </button>
                <button className='send-btn'>
                    <GrSend />
                </button>
            </form>
            {typingUser && <p className="typing-msg"> {typingUser} is typing...</p>}
            {/* <p className="typing-msg"> {typingUser} is typing...</p> */}

        </div>
    )
}
