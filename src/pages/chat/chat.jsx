import React, { useState, useEffect, useRef } from "react";
import { HeaderComponent } from "../../components/header.jsx";
import { get_current_user_id } from "../../utils/user.jsx";
import axios from "axios";
import * as signalR from "@microsoft/signalr";
import "./chat.css";

const API = import.meta.env.VITE_API_URL;

// async function init({messages, token, setConnection}) {

// }


async function getMessages() {
    try {
        let token = JSON.parse(localStorage.getItem("token"));

        const params = new URLSearchParams(window.location.search);
        let userId = params.get("userId");

        const response = await axios.get(`${API}/api/Message/chatMessages?userId=${userId}`, 
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.data}`
            }
        });

        return { ok: true, data: response.data };
    }
    catch (error) {
        console.error("Error fetching chats:", error);
        return { ok: false, error: error.message };
    }
}


export function ChatPage() {

    const currentUserId = get_current_user_id(); 
    const reseiverId = new URLSearchParams(window.location.search).get("userId");
    const token = JSON.parse(localStorage.getItem("token")).data;  

    const connection = useRef(null);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const bottomRef = useRef(null);


    useEffect(() => 
        async function() {

        getMessages().then(result => {
            if (result.ok) {
                setMessages(result.data);
            }
        });
        
    }, [currentUserId]);

    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(API + "/chatHub", {
                accessTokenFactory: () => token
            })
            .withAutomaticReconnect()
            .build();

        connection.current = newConnection;

        newConnection.on("ReceiveMessage", (message, senderId) => {
            setMessages(prev => [
                ...prev,
                {
                    content: message,
                    senderId: senderId,
                    sentAt: new Date().toISOString()
                }
            ]);

            console.log("Received:", message);
        });

        async function start() {
            try {
                if (newConnection.state === signalR.HubConnectionState.Disconnected) {
                    await newConnection.start();
                    console.log("Connected ✅");
                }
            } catch (err) {
                console.error("Connection failed:", err);
            }
        }

        start();

        return () => {
            newConnection.stop();
        };

    }, []); // ✅ EMPTY ARRAY

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    const handleSend = () => {
        if (!inputText.trim()) return;

        connection.current.invoke("sendMessage", reseiverId, inputText);

        setInputText("");
    };

    return (
    <>
        <HeaderComponent />
        
        <main className="chat-page">
            <div className="messages-page">
                
                {/* Chat Body */}
                <div className="messages-container">
                    {messages.map((msg, index) => {
                        const isSentByMe = msg.senderId === currentUserId;
                        
                        return (
                            <div 
                                key={index} 
                                className={`message-wrapper ${isSentByMe ? 'sent' : 'received'}`}
                            >
                                <div className="message-bubble">
                                {msg.content}
                                </div>
                                <span className="message-time">
                                {formatTime(msg.sentAt)}
                                </span>
                            </div>

                            
                        );
                    })}

                    <div ref={bottomRef} />
                </div>

                {/* Input Area */}
                <div className="message-input-area">
                    <input 
                        type="text" 
                        placeholder="Write a message..." 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button className="btn btn-primary" onClick={handleSend}>
                        Send
                    </button>
                </div>
            </div>
        </main>
    </>
    );
}