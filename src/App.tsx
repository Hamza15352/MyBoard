import React, { useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Board from "./components/Board";
// import { User } from "./types";
import "./styles/App.scss";
import Button from "./components/Button";

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = (email: string, password: string) => {
    console.log("Login attempt:", email, password);
    const user: User = {
      id: "1",
      email: email,
      name: email.split("@")[0],
    };
    setCurrentUser(user);
  };

  const handleSignup = (name: string, email: string, password: string) => {
    console.log("Signup attempt:", name, email, password);
    const user: User = {
      id: "1",
      email: email,
      name: name,
    };
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return isLogin ? (
      <Login onLogin={handleLogin} onSwitchToSignup={() => setIsLogin(false)} />
    ) : (
      <Signup
        onSignup={handleSignup}
        onSwitchToLogin={() => setIsLogin(true)}
      />
    );
  }
  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-content">
          <h2>Kanban Board</h2>
          <div className="user-section">
            <span className="welcome-text">Welcome, {currentUser.name}!</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </nav>
      <Board />
      {/* <div>

      </div> */}
    </div>
  );
};

export default App;