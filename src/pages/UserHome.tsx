import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { removeToken } from '../utils/auth';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface User {
  username: string;
  email: string;
}

interface UserHomeProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
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

  return (
    <>
      <Navbar setIsAuthenticated={setIsAuthenticated} />

      <div className="min-h-screen bg-gray-100 text-white">
        <main className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-700 rounded-lg shadow-lg p-8 mb-12"
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
          </motion.div>

          {/* Features Section */}
          <section className="bg-white py-20">
            <div className="max-w-6xl mx-auto px-8">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                Why Choose PollChat?
              </h2>
              <div className="grid md:grid-cols-3 gap-12">
                {[
                  {
                    title: "Real-time Results",
                    description:
                      "Watch poll results update instantly as participants respond.",
                  },
                  {
                    title: "Customizable Polls",
                    description:
                      "Create polls that fit your unique needs with our flexible options.",
                  },
                  {
                    title: "Engaging Discussions",
                    description:
                      "Foster meaningful conversations around your poll topics.",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="text-center bg-gray-100 rounded-lg shadow-lg p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 * index, duration: 0.6 }}
                  >
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
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
    className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-4 px-6 rounded-lg transition duration-300 ease-in-out flex items-center justify-center"
  >
    <span className="text-2xl mr-2">{icon}</span>
    {children}
  </motion.button>
);

export default UserHome;
