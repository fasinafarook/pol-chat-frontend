import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPolls, votePoll } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PollCard from '../components/PollCard';
import { initSocket, getSocket, disconnectSocket } from '../services/socket';

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
  const [sortOption, setSortOption] = useState<'mostVoted' | 'leastVoted'>('mostVoted');
  const pollsPerPage = 8;
  const navigate = useNavigate();

  useEffect(() => {
    initSocket();
    const socket = getSocket();
    fetchPolls();
    loadSelectedOptions();

    socket.on('pollUpdated', (updatedPollId) => {
      fetchPolls();
    });

    return () => {
      disconnectSocket();
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
      const socket = getSocket();
      socket.emit('vote', pollId);

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

  const indexOfLastPoll = currentPage * pollsPerPage;
  const indexOfFirstPoll = indexOfLastPoll - pollsPerPage;

  const filteredPolls = polls.filter((poll) =>
    poll.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedPolls = filteredPolls.sort((a, b) => {
    const totalVotesA = a.options.reduce((sum, option) => sum + option.votes, 0);
    const totalVotesB = b.options.reduce((sum, option) => sum + option.votes, 0);
    return sortOption === 'mostVoted' ? totalVotesB - totalVotesA : totalVotesA - totalVotesB;
  });

  const currentPolls = sortedPolls.slice(indexOfFirstPoll, indexOfLastPoll);
  const totalPages = Math.ceil(sortedPolls.length / pollsPerPage);

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
                ...styles.pageButton,
                backgroundColor: currentPage === index + 1 ? '#3498db' : '#fff',
                color: currentPage === index + 1 ? '#fff' : '#3498db',
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
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
    padding: '40px 20px',
    textAlign: 'center' as const,
  },
  header: {
    fontSize: '36px',
    color: '#3498db',
    marginBottom: '20px',
    fontWeight: '600',
  },
  searchInput: {
    margin: '20px 0',
    padding: '12px',
    fontSize: '16px',
    width: '320px',
    border: '2px solid #3498db',
    borderRadius: '5px',
    outline: 'none',
    transition: 'border-color 0.3s',
    '&:focus': {
      borderColor: '#2980b9',
    },
  },
  sortingContainer: {
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
  },
  button: {
    padding: '12px 20px',
    backgroundColor: '#fff',
    color: '#3498db',
    border: '2px solid #3498db',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s, color 0.3s',
    '&:hover': {
      backgroundColor: '#3498db',
      color: '#fff',
    },
  },
  activeButton: {
    padding: '12px 20px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: '2px solid #3498db',
    borderRadius: '5px',
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
  pageButton: {
    margin: '0 5px',
    padding: '10px 15px',
    border: '1px solid #3498db',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s, color 0.3s',
  },
};

export default AllPolls;
