import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';

function App() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const data = { name, password };

    axios
      .post('http://127.0.0.1:5000/login', data)
      .then((response) => {
        if (response.data.message === 'Login successful') {
          const token = response.data.token;
          localStorage.setItem('token', token);

          // Establish socket connection
          const socket = io('http://localhost:5000');

          // After successful connection, emit user_connected with the name
          socket.emit('user_connected', { name });

          // Redirect to home page after successful login
          navigate('/home');
        } else {
          setMessage(response.data.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        if (error.response) {
          setMessage(error.response.data.message);
        } else {
          setMessage('An error occurred during login.');
        }
      });
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
