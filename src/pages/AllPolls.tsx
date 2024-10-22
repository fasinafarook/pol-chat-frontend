import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPolls, votePoll } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PollCard from '../components/PollCard';
import { io } from 'socket.io-client';
const socket = io('http://localhost:5000');

// import socket from '../services/socket';


interface Poll {
  _id: string;
  question: string;
  options: { text: string; votes: number }[];
  createdAt: string;
}

interface CreatePollProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const AllPolls: React.FC<CreatePollProps> = ({ setIsAuthenticated }) => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: number }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<'mostVoted' | 'leastVoted'>('mostVoted'); // State for sorting
  const pollsPerPage = 8; // Set the number of polls per page
  const navigate = useNavigate();



  useEffect(() => {
    socket.connect();  // Ensure socket is connected
    fetchPolls();
    loadSelectedOptions();
  
    // Listen for real-time poll updates
    socket.on('pollUpdated', (updatedPollId) => {
      console.log('Poll updated:', updatedPollId);  // Add this log to verify updates
      fetchPolls(); // Re-fetch polls on update
    });
  
    return () => {
      socket.disconnect();
    };
  }, []);
  
  
  const fetchPolls = async () => {
    try {
      const response = await getPolls();
      setPolls(response.data);
    } catch (error) {
      console.error('Error fetching polls:', error);
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
      fetchPolls();
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  // Calculate the polls to display for the current page
  const indexOfLastPoll = currentPage * pollsPerPage;
  const indexOfFirstPoll = indexOfLastPoll - pollsPerPage;

  // Filter polls based on search term
  const filteredPolls = polls.filter(poll =>
    poll.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort polls based on votes
  const sortedPolls = filteredPolls.sort((a, b) => {
    const totalVotesA = a.options.reduce((sum, option) => sum + option.votes, 0);
    const totalVotesB = b.options.reduce((sum, option) => sum + option.votes, 0);
    return sortOption === 'mostVoted' ? totalVotesB - totalVotesA : totalVotesA - totalVotesB;
  });

  const currentPolls = sortedPolls.slice(indexOfFirstPoll, indexOfLastPoll);
  
  // Calculate total pages
  const totalPages = Math.ceil(sortedPolls.length / pollsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <Navbar setIsAuthenticated={setIsAuthenticated} />
      <div style={styles.pageContainer}>
        <h1 style={styles.header}>All Polls</h1>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search polls by question"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />

        {/* Sorting Options */}
        <div style={styles.sortingContainer}>
          <button
            onClick={() => setSortOption('mostVoted')}
            style={sortOption === 'mostVoted' ? styles.activeButton : styles.button}
          >
            Most Voted
          </button>
          <button
            onClick={() => setSortOption('leastVoted')}
            style={sortOption === 'leastVoted' ? styles.activeButton : styles.button}
          >
            Least Voted
          </button>
        </div>

        <div style={styles.pollsGrid}>
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

        {/* Pagination Controls */}
        <div style={styles.pagination}>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              style={{
                margin: '0 5px',
                padding: '5px 10px',
                backgroundColor: currentPage === index + 1 ? '#1877f2' : '#fff',
                color: currentPage === index + 1 ? '#fff' : '#1877f2',
                border: '1px solid #1877f2',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

const styles = {
  pageContainer: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f0f2f5',
    minHeight: '100vh',
    padding: '40px 20px',
    textAlign: 'center' as const,
  },
  header: {
    fontSize: '36px',
    color: '#1877f2',
    marginBottom: '20px',
  },
  searchInput: {
    margin: '20px 0',
    padding: '10px',
    fontSize: '16px',
    width: '300px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  sortingContainer: {
    marginBottom: '20px',
  },
  button: {
    margin: '0 5px',
    padding: '10px 15px',
    backgroundColor: '#fff',
    color: '#1877f2',
    border: '1px solid #1877f2',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  activeButton: {
    margin: '0 5px',
    padding: '10px 15px',
    backgroundColor: '#1877f2',
    color: '#fff',
    border: '1px solid #1877f2',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  pollsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    padding: '20px',
  },
  pagination: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'center',
  },
};

export default AllPolls;
