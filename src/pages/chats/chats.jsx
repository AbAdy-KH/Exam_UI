import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HeaderComponent } from "./../../components/header.jsx";
import { Link } from "react-router-dom";
import axios from "axios";
import "./chats.css";

const API = import.meta.env.VITE_API_URL;


async function getChats(filter = "") {

    try {

        let token = JSON.parse(localStorage.getItem("token"));

        const response = await axios.get(`${API}/api/Message/chats?filter=${encodeURIComponent(filter)}`, {
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


function TopNavItems() {

    return (
        <>
            <Link to={'/find-user?source=friends'} className="nav-friends">
                <span className="nav-icon">👥</span>
            </Link>
        </>
    );
}

export function ChatsPage() {

    const [chats, setChats] = useState([]);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        getChats(filter).then(result => {
            if (result.ok) {
                setChats(result.data);
            }
        });
    }, [filter]);

    const navigate = useNavigate();

    const handleRowClick = (userId) => {
        navigate(`/chat?userId=${userId}`);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <>
        <HeaderComponent rightSection={<TopNavItems />} />

        <main className="chat-page">
            {/* Search Toolbar */}
            <div className="toolbar">
                <input
                    type="text"
                    className="toolbar-input"
                    placeholder="Search messages..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
                <button 
                    className="btn btn-secondary"
                    onClick={null}
                >Search</button>
            </div>

            {/* Chats Table */}
            <table className="chats-table">
            <thead>
                <tr className="chats-table-header">
                <th>Conversation</th>
                <th style={{ textAlign: 'right' }}>Last Activity</th>
                </tr>
            </thead>
            <tbody>
                {chats.map((chat) => (
                <tr
                    key={chat.userId}
                    className="chats-table-row"
                    onClick={() => handleRowClick(chat.userId)}
                >
                    <td data-label="User">
                    <div className="user-info-cell">
                        <div className="avatar-wrapper">
                        <div className="avatar-circle">
                            {chat.userName.charAt(0)}
                        </div>
                        <span className="status-dot"></span>
                        </div>
                        
                        <div className="chat-meta">
                        <span className="user-name-text">{chat.userName}</span>
                        <span className="last-msg-preview">
                            Click to open this conversation
                        </span>
                        </div>
                    </div>
                    </td>
                    
                    <td data-label="Last Message" className="time-cell">
                    {formatDate(chat.lastMessage)}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
            
            {chats.length === 0 && (
            <div style={{ textAlign: 'center', color: '#64748b', marginTop: '40px' }}>
                No conversations found.
            </div>
            )}
        </main>
        </>
    );
}