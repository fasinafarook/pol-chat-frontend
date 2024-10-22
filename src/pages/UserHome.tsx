import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { removeToken } from '../utils/auth'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'


interface User {
    username: string;
    email: string;
  }
  
  interface UserHomeProps {
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>; // Correct type
  }
  
  const UserHome: React.FC<UserHomeProps> = ({ setIsAuthenticated }) => {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();
  
    useEffect(() => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }, []);
  
    const handleLogout = () => {
      removeToken();
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      navigate('/login');
    };
  
    return (
        <>
                <Navbar setIsAuthenticated={setIsAuthenticated} />

      <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white">
        <main className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white bg-opacity-10 rounded-lg shadow-lg p-8 backdrop-blur-md"
          >
            <h1 className="text-4xl font-bold mb-4">Welcome, {user?.username || 'User'}!</h1>
            <p className="text-xl mb-8">You're now logged in. Explore and connect.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <NavButton onClick={() => navigate('/chat')} icon="💬">
                Chat
              </NavButton>
              <NavButton onClick={() => navigate('/all-polls')} icon="📊">
                All Polls
              </NavButton>
              <NavButton onClick={() => navigate('/your-polls')} icon="📝">
                Your Polls
              </NavButton>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              Logout
            </motion.button>
          </motion.div>
        </main>
      </div>
    <Footer />
    </>
    );
  };

const NavButton: React.FC<{ onClick: () => void; icon: string; children: React.ReactNode }> = ({
  onClick,
  icon,
  children,
}) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-md text-white font-bold py-4 px-6 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 flex items-center justify-center"
  >
    <span className="text-2xl mr-2">{icon}</span>
    {children}
  </motion.button>
)



export default UserHome