// src/components/Navbar.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { removeToken } from '../utils/auth';

interface NavbarProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    removeToken();
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/login');
  };
  
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <motion.svg
              whileHover={{ rotate: 180 }}
              className="h-8 w-8 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </motion.svg>
            <span className="ml-2 text-2xl font-semibold text-gray-800">Poll App</span>
          </div>
          <div className="flex items-center">
            <Link to="/home" className="text-gray-800 text-sm font-semibold hover:text-indigo-600 mr-4">Home</Link>
            <Link to="/all-polls" className="text-gray-800 text-sm font-semibold hover:text-indigo-600 mr-4">Polls</Link>
            <Link to="/your-polls" className="text-gray-800 text-sm font-semibold hover:text-indigo-600 mr-4">Create</Link>
            <Link to="/chat" className="text-gray-800 text-sm font-semibold hover:text-indigo-600 mr-4">ChatBox</Link>

            <button
              onClick={handleLogout}
              className="text-gray-800 text-sm font-semibold hover:text-indigo-600 focus:outline-none"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
