// Chat.tsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { initSocket, getSocket, disconnectSocket } from '../services/socket'; // Import your socket service
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getChatMessages } from '../services/api';

interface Message {
  username: string;
  message: string;
  timestamp: Date;
}

interface ChatProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Chat({ setIsAuthenticated }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isConnected, setIsConnected] = useState(false);
  const storedUser = localStorage.getItem('user');
  const username = storedUser ? JSON.parse(storedUser).username : 'Anonymous';

  useEffect(() => {
    initSocket(); // Initialize socket connection
    const socket = getSocket(); // Get socket instance

    setIsConnected(socket.connected);

    const fetchMessages = async () => {
        const response = await getChatMessages(); // Use the getChatMessages function
        setMessages(response.data);
    };

    fetchMessages();

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));
    socket.on('receiveMessage', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('userTyping', (username: string) => {
      setTypingUser(username);
    });

    socket.on('userStopTyping', () => {
      setTypingUser(null);
    });

    return () => {
      disconnectSocket(); // Clean up socket connection
      socket.off('receiveMessage');
      socket.off('userTyping');
      socket.off('userStopTyping');
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const socket = getSocket(); // Get socket instance
      socket.emit('sendMessage', { username, message: newMessage });
      setNewMessage('');
    }
  };

  const handleTyping = () => {
    const socket = getSocket(); // Get socket instance
    socket.emit('typing', username);
  };

  const stopTyping = () => {
    const socket = getSocket(); // Get socket instance
    socket.emit('stopTyping');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar setIsAuthenticated={setIsAuthenticated} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
          <div className="bg-blue-600 text-white p-4 rounded-t-lg">
            <h2 className="text-xl font-semibold">Chat Room</h2>
            <p className="text-sm">{isConnected ? 'Connected' : 'Disconnected'}</p>
            {typingUser && (
              <div className="text-center text-sm text-white italic p-2">
                {typingUser} is typing...
              </div>
            )}
          </div>
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.username === username ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs rounded-lg p-3 transition-transform transform ${
                    msg.username === username ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-100 text-black'
                  } hover:scale-105`}
                >
                  <p className={`text-xs ${msg.username === username ? 'text-blue-200' : 'text-gray-500'}`}>
                    {msg.username === username ? 'You' : msg.username}
                  </p>
                  <p className="text-sm mt-1 break-words">{msg.message}</p>
                  <p className="text-xs text-right mt-1 opacity-70">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={sendMessage} className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleTyping}
                onKeyUp={stopTyping}
                placeholder="Type a message..."
                className="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
