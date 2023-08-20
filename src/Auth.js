import React from "react";
import { signInWithPopup } from "firebase/auth";
import { db, auth, googleProvider } from "./firebase";

const Auth = ({ onSignIn }) => {
  const handleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        onSignIn(result.user);
      })
      .catch((error) => {
        console.error("Error during sign-in:", error);
      });
  };

  // Inline styles for the box and button
  const boxStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "300px",
    margin: "0 auto",
    borderRadius: "8px",
    padding: "20px",
  };

  const buttonStyle = {
    backgroundColor: "#4285F4",
    color: "white",
    padding: "10px 15px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  };

  return (
    <div style={boxStyle}>
      <h2>Welcome to the App</h2>
      <p>Please sign in to continue:</p>
      <button style={buttonStyle} onClick={handleSignIn}>
        Sign in with Google
      </button>
    </div>
  );
};

export default Auth;
