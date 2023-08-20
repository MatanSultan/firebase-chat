import React, { useState, useEffect } from "react";
import { ref, push, onValue, update } from "firebase/database";

import { db, auth, googleProvider } from "./firebase";
import { useNavigate } from "react-router-dom";

import { signInWithPopup, signOut } from "firebase/auth";
import MessageList from "./MessageList";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);

  const navigate = useNavigate(); // Initialize the useHistory hook

  // Listen to user's authentication status
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // Fetch messages once user is authenticated
  useEffect(() => {
    if (user) {
      const messagesRef = ref(db, "messages");
      onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        const formattedMessages = data
          ? Object.entries(data).map(([id, message]) => ({ id, ...message }))
          : [];
        setMessages(formattedMessages);
      });
    }
  }, [user]);
  const handleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        setUser(result.user);
      })
      .catch((error) => {
        console.error("Error during sign-in:", error);
      });
  };
  const handleEditStart = (message) => {
    setEditingMessage(message);
    setMessage(message.content); // Sets the content to the textarea for editing
  };

  const handleEditFinish = () => {
    const messagesRef = ref(db, "messages/" + editingMessage.id);
    update(messagesRef, {
      content: message,
    })
      .then(() => {
        setMessage("");
        setEditingMessage(null);
      })
      .catch((error) => {
        console.error("Error updating message:", error);
      });
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);

        navigate("/");
      })
      .catch((error) => {
        console.error("Error during sign-out:", error);
      });
  };

  const sendMessage = () => {
    const messagesRef = ref(db, "messages");

    // If a message is being edited
    if (editingMessage) {
      const specificMessageRef = ref(db, `messages/${editingMessage.id}`);
      update(specificMessageRef, {
        content: message,
        timestamp: Date.now(),
        uid: user.uid,
        photoURL: user.photoURL,
      })
        .then(() => {
          setMessage("");
          setEditingMessage(null); // Reset the editing state
        })
        .catch((error) => {
          console.error("Error updating message:", error);
        });
    }
    // If it's a new message
    else if (message) {
      push(messagesRef, {
        content: message,
        timestamp: Date.now(),
        uid: user.uid,
        photoURL: user.photoURL,
      })
        .then(() => {
          setMessage("");
        })
        .catch((error) => {
          console.error("Error sending message:", error);
        });
    }
  };

  if (!user) {
    return (
      <div className="auth-container">
        <button onClick={handleSignIn}>Sign in with Google</button>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>

      <MessageList
        messages={messages}
        user={user}
        handleEditStart={handleEditStart}
      />

      <div className="input-container">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
        ></textarea>
        <button onClick={sendMessage}>
          {editingMessage ? "Update" : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Chat;
