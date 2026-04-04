
import "./chat.css";

export function ChatPage() {


    return (
        <div className="chat-page">

            <div className="chat-container">

                <div className="chat-header">
                    <div className="chat-header-avatar">🧑</div>
                    <div className="chat-header-info">
                        <div className="chat-header-name">Ahmed Al-Rashid</div>
                        <div className="chat-header-status">
                            <span className="status-dot"></span>
                            Online
                        </div>
                    </div>
                    <button className="btn btn-secondary" >View Profile</button>
                </div>

                <div className="chat-messages" id="messages">

                    <div className="chat-date-divider"><span>Monday, March 18</span></div>

                    <div className="msg-row group-start group-end">
                        <div className="msg-avatar">🧑</div>
                        <div className="msg-bubble-wrap">
                            <span className="msg-sender-name">Ahmed</span>
                            <div className="msg-bubble">Hey! Did you get a chance to look at the calculus exam I uploaded?</div>
                        </div>
                    </div>

                    <div className="msg-row me group-start group-end">
                        <div className="msg-avatar">🧑</div>
                        <div className="msg-bubble-wrap">
                            <div className="msg-bubble">The one covering integration by parts?</div>
                            <span className="msg-time">10:32 AM</span>
                        </div>
                    </div>

                </div>

                <div className="chat-input-area">
                    <textarea
                        className="chat-input"
                        id="chat-input"
                        placeholder="Type a message…"
                        rows="1"
                        onInput="autoResize(this)"
                        onKeyDown="handleKey(event)"
                    ></textarea>
                    <button className="btn btn-icon" OnClick="sendMessage()" title="Send">➤</button>
                </div>

            </div>
        </div>
    )
}