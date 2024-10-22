import React, { useState } from 'react';
import { createPoll } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

interface CreatePollProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreatePoll: React.FC<CreatePollProps> = ({ setIsAuthenticated }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() === '' || options.some(option => option.trim() === '')) {
      setMessage('Please provide a question and all options.');
      return;
    }

    try {
      await createPoll({ question, options });
      setMessage('Poll created successfully!');
      setQuestion('');
      setOptions(['', '']);
      
      // Redirect to /your-poll
      navigate('/your-polls'); // Add this line for redirection
    } catch (error) {
      setMessage('Failed to create poll. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex flex-col">
      <Navbar setIsAuthenticated={setIsAuthenticated} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="p-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create a Poll</h2>
            <AnimatePresence>
              {message && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`text-center mb-4 ${
                    message.includes('successfully') ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {message}
                </motion.p>
              )}
            </AnimatePresence>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Enter your question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {options.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ))}
              <button
                type="button"
                onClick={addOption}
                className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Add Option
              </button>
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Create Poll
              </button>
            </form>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default CreatePoll;
