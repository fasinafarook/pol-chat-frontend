import React, { useState, useEffect } from 'react'; 
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/registration';
import UserHome from './pages/UserHome';
import CreatePoll from './pages/CreatePoll';
import UserPolls from './pages/Polls';
import AllPolls from './pages/AllPolls';
import Chat from './pages/Chatt';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check authentication status on initial load and route changes
  useEffect(() => {
    const token = localStorage.getItem('token'); // Adjust this based on how you store the token
    setIsAuthenticated(!!token); // Set authenticated state based on the presence of a token
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/home" replace /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/login" replace /> : <Register setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/home" element={isAuthenticated ? <UserHome setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" replace />} />
        <Route path="/new-polls" element={isAuthenticated ? <CreatePoll setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" replace />} />
        <Route path="/your-polls" element={isAuthenticated ? <UserPolls setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" replace />} />
        <Route path="/all-polls" element={isAuthenticated ? <AllPolls setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" replace />} />
        <Route path="/chat" element={isAuthenticated ? <Chat setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" replace />} />

      </Routes>
    </Router>
  );
};

export default App;
