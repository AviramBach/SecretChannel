import React, { useState, useRef, useEffect } from 'react';
import { socketService } from '../services/socket.service';



export function VideoChatBox() {
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const localVideoRef = useRef();
    const remoteVideoRef = useRef();
    const peerConnection = useRef(null);
    
    socketService.setup()

    const startStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);
            localVideoRef.current.srcObject = stream;
        } catch (err) {
            console.error('Error accessing media devices:', err);
        }
    };

    useEffect(() => {
        const handleSignaling = async(data) => {
            if (data.offer) {
                // Received an offer from remote peer
                peerConnection.current.setRemoteDescription(data.offer);
                const answer = await peerConnection.current.createAnswer();
                await peerConnection.current.setLocalDescription(answer);
    
                // Send the answer to the remote peer via socket
                socketService.emit('answer', { answer });
            } else if (data.answer) {
                // Received an answer from remote peer
                peerConnection.current.setRemoteDescription(data.answer);
            } else if (data.candidate) {
                // Received an ICE candidate from remote peer
                peerConnection.current.addIceCandidate(data.candidate);
            }
        };
    
        socketService.on('signalingMessage', handleSignaling);
    
        return () => {
            socketService.off('signalingMessage', handleSignaling);
        };
    }, []);

    useEffect(() => {
        // Function to start video streaming
        startStream();
        // Clean-up function to stop local stream when unmounting
        return () => {
            if (localStream) {
                localStream.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    // Function to create RTCPeerConnection
    const createPeerConnection = () => {
        peerConnection.current = new RTCPeerConnection();

        // Add local stream to peer connection
        if (localStream) {
            localStream.getTracks().forEach((track) => {
                peerConnection.current.addTrack(track, localStream);
            });
        }

        // Event handler when remote stream received
        peerConnection.current.ontrack = (event) => {
            if (!remoteVideoRef.current.srcObject) {
                setRemoteStream(event.streams[0]);
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };
    };

    // Function to initiate the call
    const startCall = async () => {
        // Ensure you have a valid socket connection and access to it
        if (!socketService.socket) return;
    
        startStream();
        createPeerConnection();
        try {
            const offer = await peerConnection.current.createOffer();
            await peerConnection.current.setLocalDescription(offer);
    
            // Send the offer to the remote peer via socket
            socketService.emit('offer', { offer });
        } catch (error) {
            console.error('Error creating offer:', error);
        }
    };

    const endCall = () => {
        // Close peer connection
        if (peerConnection.current) {
            peerConnection.current.close();
        }

        // Stop local stream
        if (localStream) {
            localStream.getTracks().forEach((track) => track.stop());
        }

        // Reset state
        setLocalStream(null);
        setRemoteStream(null);
    };


    return (
        <div className='video-container'>
            <video ref={localVideoRef} autoPlay playsInline muted style={{ width: 200, height: 150 }}></video>
            <video ref={remoteVideoRef} autoPlay playsInline style={{ width: 200, height: 150 }}></video>
            <button onClick={startCall}>Start Call</button>
            <button onClick={endCall}>End Call</button>

        </div>
    );


}
