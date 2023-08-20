import React from "react";

function MessageList({ messages, user, handleEditStart }) {
  // Add handleEditStart to props
  return (
    <div className="messages-list">
      {messages &&
        user &&
        messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.uid === user.uid ? "outgoing" : "incoming"
            }`}
          >
            <img
              src={msg.photoURL}
              alt="User profile"
              className="message-profile-pic"
            />
            <span className="message-content">{msg.content}</span>
            {msg.uid === user.uid && (
              <button onClick={() => handleEditStart(msg)}>🖌</button>
            )}
          </div>
        ))}
    </div>
  );
}

export default MessageList;
