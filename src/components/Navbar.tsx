import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { removeToken } from '../utils/auth';

interface NavbarProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Navbar({ setIsAuthenticated }: NavbarProps) {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    removeToken();
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/login');
  };
  
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/home" className="flex-shrink-0 flex items-center">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="ml-2 text-xl font-semibold text-gray-900">PollChat</span>
            </Link>
          </div>
          <div className="flex items-center">
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink to="/home">Home</NavLink>
              <NavLink to="/all-polls">Polls</NavLink>
              <NavLink to="/your-polls">Create</NavLink>
              <NavLink to="/chat">ChatBox</NavLink>
            </div>
            <div className="ml-6 flex items-center">
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600"
    >
      {children}
    </Link>
  );
}