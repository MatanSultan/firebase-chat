import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chat from "./Chat";
import "./App.css";

function Header() {
  return (
    <header>
      <h1>Open Chat Room</h1>
      <p>Welcome to the chat room. Please adhere to the following rules:</p>
      <ul>
        <h2>No spamming.</h2>
        <h2>Be respectful to others.</h2>
        <h2>No posting of personal details.</h2>
        {/* Add any other rules as needed */}
      </ul>
    </header>
  );
}

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Chat />} />
        {/* Any other routes */}
      </Routes>
    </Router>
  );
}

export default App;
