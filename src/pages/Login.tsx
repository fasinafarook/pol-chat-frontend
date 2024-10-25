import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../src/services/api';
import { setToken } from '../../src/utils/auth';
import toast, { Toaster } from 'react-hot-toast';

interface LoginProps {
  setIsAuthenticated: (value: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const styles = `
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

      :root {
        --primary-color: #3498db; /* Primary button color */
        --background-color: #f0f4f8; /* Light background color */
        --text-color: #333; /* Text color */
        --error-color: #e74c3c; /* Error color */
        --border-color: rgba(0, 0, 0, 0.1); /* Border color */
      }

      body {
        font-family: 'Poppins', sans-serif;
        background-color: var(--background-color);
        color: var(--text-color);
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
      }

      .login-container {
        background: #fff; /* Solid background for the login box */
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        padding: 2rem;
        width: 100%;
        max-width: 400px;
      }

      .login-title {
        text-align: center;
        color: var(--primary-color);
        font-size: 1.8rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
      }

      .input-group {
        margin-bottom: 1.5rem;
      }

      .input-field {
        width: 100%;
        padding: 1rem;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        font-size: 1rem;
        transition: border 0.3s ease;
      }

      .input-field:focus {
        border-color: var(--primary-color);
        outline: none;
      }

      .submit-button {
        background: var(--primary-color);
        color: #fff;
        border: none;
        border-radius: 4px;
        padding: 1rem;
        font-size: 1.1rem;
        cursor: pointer;
        font-weight: 600;
        width: 100%;
        transition: background 0.3s ease;
      }

      .submit-button:hover {
        background: darken(var(--primary-color), 10%);
      }

      .error-message {
        color: var(--error-color);
        text-align: center;
        margin-bottom: 1rem;
        font-size: 0.9rem;
      }

      .field-error {
        color: var(--error-color);
        font-size: 0.85rem;
        margin-top: 0.3rem;
      }

      .text-center {
        text-align: center;
      }
    `;

    const styleElement = document.createElement('style');
    styleElement.innerHTML = styles;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;

    if (!email) {
      setEmailError('Email is required');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (!valid) return;

    try {
      const response = await login(email, password);
      setToken(response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setIsAuthenticated(true);
      navigate('/home');
    } catch (err) {
      setError('Invalid credentials');
      toast.error('Invalid username or password');
    }
  };

  return (
    <>
      <Toaster />
      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h2 className="login-title">Login</h2>
          {error && <p className="error-message">{error}</p>}
          <div className="input-group">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="input-field"
            />
            {emailError && <p className="field-error">{emailError}</p>}
          </div>
          <div className="input-group">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="input-field"
            />
            {passwordError && <p className="field-error">{passwordError}</p>}
          </div>
          <button type="submit" className="submit-button">Login</button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{' '}
          <a href="/register" className="text-indigo-600 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </>
  );
};

export default Login;
