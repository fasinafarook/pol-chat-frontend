// src/components/PollCard.tsx
import React from 'react';

interface Option {
  text: string;
  votes: number;
}

interface PollCardProps {
  pollId: string;
  question: string;
  options: Option[];
  createdAt: string;
  selectedOptionIndex: number | undefined;
  onVote: (pollId: string, optionIndex: number) => void;
}

const PollCard: React.FC<PollCardProps> = ({
  pollId,
  question,
  options,
  createdAt,
  selectedOptionIndex,
  onVote,
}) => {
  return (
    <div style={styles.pollCard}>
      <h3 style={styles.pollQuestion}>{question}</h3>
      <p style={styles.createdAt}>Created on: {new Date(createdAt).toLocaleDateString()}</p>
      <div style={styles.options}>
        {options.map((option, index) => (
          <div
            key={index}
            style={{
              ...styles.optionContainer,
              backgroundColor: selectedOptionIndex === index ? '#d3f9d8' : '#ffffff',
            }}
          >
            <span style={styles.optionText}>
              {option.text} - {option.votes} votes
            </span>
            <button
              style={styles.voteButton}
              onClick={() => onVote(pollId, index)}
            >
              Vote
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  pollCard: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  pollQuestion: {
    fontSize: '18px',
    color: '#1c1e21',
    marginBottom: '10px',
  },
  createdAt: {
    fontSize: '12px',
    color: '#65676b',
    marginBottom: '20px',
  },
  options: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
    marginBottom: '20px',
  },
  optionContainer: {
    display: 'flex',
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    padding: '10px',
    borderRadius: '4px',
    transition: 'background-color 0.3s',
  },
  optionText: {
    fontSize: '14px',
    color: '#1c1e21',
  },
  voteButton: {
    backgroundColor: '#42b72a',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    padding: '5px 10px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default PollCard;
