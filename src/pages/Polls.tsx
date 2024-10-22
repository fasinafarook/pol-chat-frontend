import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserPolls ,votePoll} from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PollCard from '../components/PollCard'; // Import the new PollCard component
import { io } from 'socket.io-client';
const socket = io('http://localhost:5000');


interface Poll {
  _id: string;
  question: string;
  options: { text: string; votes: number }[];
  createdAt: string; // Add this line to include createdAt

}

interface YourPollsProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const YourPolls: React.FC<YourPollsProps> = ({ setIsAuthenticated }) => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: number }>({});

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pollsPerPage] = useState(6);
  const [sortOrder, setSortOrder] = useState<'mostVoted' | 'leastVoted'>('mostVoted');
  const navigate = useNavigate();

  useEffect(() => {
    socket.connect();  // Ensure socket is connected
    fetchUserPolls();
    loadSelectedOptions();
  
    // Listen for real-time poll updates
    socket.on('pollUpdated', (updatedPollId) => {
      console.log('Poll updated:', updatedPollId);  // Add this log to verify updates
      fetchUserPolls(); // Re-fetch polls on update
    });
  
    return () => {
      socket.disconnect();
    };
  }, []);
  
  const fetchUserPolls = async () => {
    try {
      const response = await getUserPolls();
      setPolls(response.data);
    } catch (error) {
      console.error('Error fetching user polls:', error);
    }
  };

  const handleCreatePoll = () => {
    navigate('/new-polls');
  };

  const calculateTotalVotes = (poll: Poll) => {
    return poll.options.reduce((total, option) => total + option.votes, 0);
  };

  const sortedPolls = polls.sort((a, b) => {
    const aVotes = calculateTotalVotes(a);
    const bVotes = calculateTotalVotes(b);
    return sortOrder === 'mostVoted' ? bVotes - aVotes : aVotes - bVotes;
  });

  const indexOfLastPoll = currentPage * pollsPerPage;
  const indexOfFirstPoll = indexOfLastPoll - pollsPerPage;
  const currentPolls = sortedPolls
    .filter(poll => poll.question.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(indexOfFirstPoll, indexOfLastPoll);

  const totalPages = Math.ceil(sortedPolls.filter(poll => poll.question.toLowerCase().includes(searchQuery.toLowerCase())).length / pollsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const loadSelectedOptions = () => {
    const savedOptions = localStorage.getItem('selectedOptions');
    if (savedOptions) {
      setSelectedOptions(JSON.parse(savedOptions));
    }
  };
  const handleVote = async (pollId: string, optionIndex: number) => {
    try {
      await votePoll(pollId, optionIndex);
      socket.emit('vote', pollId); // Emit vote event to server
      const updatedOptions = {
        ...selectedOptions,
        [pollId]: optionIndex,
      };
      setSelectedOptions(updatedOptions);
      localStorage.setItem('selectedOptions', JSON.stringify(updatedOptions));
      fetchUserPolls();
    } catch (error) {
      console.error('Error voting:', error);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <Navbar setIsAuthenticated={setIsAuthenticated} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-indigo-800 mb-8 text-center"
        >
          Your Polls
        </motion.h1>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search polls by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full"
          />
        </div>

        <div className="flex justify-center mb-4">
          <button
            onClick={() => setSortOrder('mostVoted')}
            className={`mx-2 px-4 py-2 rounded-md ${sortOrder === 'mostVoted' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 border border-indigo-600'}`}
          >
            Most Voted
          </button>
          <button
            onClick={() => setSortOrder('leastVoted')}
            className={`mx-2 px-4 py-2 rounded-md ${sortOrder === 'leastVoted' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 border border-indigo-600'}`}
          >
            Least Voted
          </button>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCreatePoll}
          className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 ease-in-out mb-8 mx-auto block"
        >
          Create New Poll
        </motion.button>

        <AnimatePresence>
          {currentPolls.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-gray-600 text-lg"
            >
              No polls found.
            </motion.p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentPolls.map((poll) => (
                <PollCard
                  key={poll._id}
                  pollId={poll._id}
                  question={poll.question}
                  options={poll.options}
                  createdAt={poll.createdAt}
                  selectedOptionIndex={selectedOptions[poll._id]}
                  onVote={handleVote}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          <button onClick={prevPage} disabled={currentPage === 1} className="disabled:opacity-50">Previous</button>
          <button onClick={nextPage} disabled={currentPage === totalPages} className="disabled:opacity-50">Next</button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default YourPolls;
