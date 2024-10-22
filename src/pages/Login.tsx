import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { login } from '../../src/services/api';
import { setToken } from '../../src/utils/auth';

interface LoginProps {
  setIsAuthenticated: (value: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Add styles inside useEffect within the component
  useEffect(() => {
    const styles = `
      :root {
        --primary-color: #3498db;
        --secondary-color: #2980b9;
        --background-color: #f0f4f8;
        --text-color: #333;
        --error-color: #e74c3c;
        --glass-color: rgba(255, 255, 255, 0.8);
        --border-color: rgba(255, 255, 255, 0.4);
      }

      body {
        font-family: 'Arial', sans-serif;
        background: linear-gradient(135deg, #74b9ff, #81ecec);
        color: var(--text-color);
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
      }

      .login-container {
        background: var(--glass-color);
        backdrop-filter: blur(12px);
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        padding: 3rem;
        width: 100%;
        max-width: 450px;
        border: 1px solid var(--border-color);
        animation: slideIn 0.6s ease-in-out;
      }

      .login-form {
        display: flex;
        flex-direction: column;
      }

      .login-title {
        text-align: center;
        color: var(--primary-color);
        margin-bottom: 2rem;
        font-size: 2rem;
        letter-spacing: 1px;
        font-weight: bold;
      }

      .input-group {
        position: relative;
        margin-bottom: 2rem;
      }

      .input-field {
        width: 100%;
        padding: 1.2rem;
        border: none;
        border-radius: 6px;
        font-size: 1rem;
        background: rgba(255, 255, 255, 0.2);
        color: var(--text-color);
        transition: all 0.3s ease-in-out;
      }

      .input-field:focus {
        outline: none;
        box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
        background: rgba(255, 255, 255, 0.5);
      }

      .input-label {
        position: absolute;
        left: 1rem;
        top: 1.2rem;
        color: #777;
        pointer-events: none;
        transition: 0.3s ease all;
        font-size: 1rem;
        background-color: transparent;
      }

      .input-field:focus ~ .input-label,
      .input-field:not(:placeholder-shown) ~ .input-label {
        top: -0.6rem;
        left: 0.9rem;
        font-size: 0.8rem;
        color: var(--primary-color);
        padding: 0 0.3rem;
        background-color: white;
        border-radius: 4px;
      }

      .submit-button {
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        color: white;
        border: none;
        border-radius: 6px;
        padding: 1rem;
        font-size: 1.1rem;
        cursor: pointer;
        transition: background 0.3s, transform 0.2s;
      }

      .submit-button:hover {
        background: linear-gradient(135deg, var(--secondary-color), var(--primary-color));
        transform: scale(1.05);
      }

      .error-message {
        color: var(--error-color);
        text-align: center;
        margin-bottom: 1.2rem;
        animation: fadeIn 0.5s;
      }

      @keyframes fadeIn {
        0% { opacity: 0; transform: translateY(-20px); }
        100% { opacity: 1; transform: translateY(0); }
      }

      @keyframes slideIn {
        0% { transform: translateY(100px); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
      }
    `;

    const styleElement = document.createElement('style');
    styleElement.innerHTML = styles;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Update the handleSubmit function in Login.tsx
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      setToken(response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user)); // Store user info
      console.log('data',response.data.user);
      
      setIsAuthenticated(true);
      navigate('/home');
    } catch (err) {
      setError('Invalid credentials');
    }
  };
  

  return (
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
            required
            placeholder=" "
            className="input-field"
          />
          <label htmlFor="email" className="input-label">Email</label>
        </div>
        <div className="input-group">
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder=" "
            className="input-field"
          />
          <label htmlFor="password" className="input-label">Password</label>
        </div>
        <button type="submit" className="submit-button">Login</button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-4">
          Do not have an account?{' '}
          <a href="/register" className="text-indigo-600 hover:underline">
            SignUp
          </a>
        </p>
    </div>
  );
};

export default Login;
