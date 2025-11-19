


import React, { useState, useEffect } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Board from "./components/Board";
// import { User } from "./types"; // Ye file create karna hoga
import "./styles/App.scss";

interface User {
  id: string;
  email: string;
  name: string;
}

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (email: string, password: string) => {
    console.log("Login attempt:", email, password);
    const user: User = {
      id: "1",
      email: email, 
      name: email.split("@")[0],
    };
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleSignup = (name: string, email: string, password: string) => {
    console.log("Signup attempt:", name, email, password);
    const user: User = {
      id: "1",
      email: email,
      name: name,
    };
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

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
    </div>
  );
};  

export default App;