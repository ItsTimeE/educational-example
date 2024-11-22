import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useLocation } from 'react-router-dom';

function Home() {
  const location = useLocation();
  const userName = location.state?.userName || 'Guest';
  const [connectedUsers, setConnectedUsers] = useState([]);

  useEffect(() => {
    const socket = io('http://localhost:5000');  // Connect to the backend

    socket.on('user_connected', (data) => {
      // Add user to the list of connected users
      setConnectedUsers((prevUsers) => [...prevUsers, data.name]);
    });

    socket.on('user_disconnected', (data) => {
      // Remove user from the list of connected users
      setConnectedUsers((prevUsers) => prevUsers.filter((user) => user !== data.name));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Home Page</h1>
      <p>Logged in as: {userName}</p>
      <h2>Connected Users:</h2>
      <div>
        {connectedUsers.length > 0 ? (
          connectedUsers.map((user, index) => (
            <p key={index}>{user}</p>
          ))
        ) : (
          <p>No users connected.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
