import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

function App() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null); // Save socket instance in state

  useEffect(() => {
    // Cleanup socket connection when the component unmounts
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

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

          // Initialize socket connection only after successful login
          const newSocket = io('http://localhost:5000'); // Flask server URL

          // Save the socket instance in state
          setSocket(newSocket);

          newSocket.on('connect', () => {
            console.log('Connected to the server');
          });

          newSocket.on('disconnect', () => {
            console.log('Disconnected from the server');
          });
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
