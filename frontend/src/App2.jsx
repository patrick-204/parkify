import React, { useState, useEffect } from 'react';
import Chat from './components/Chat';
import axios from 'axios';
import './App.css';

function App() {
  const [currentUserId, setCurrentUserId] = useState(1); // Example current user ID
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch the list of users from the backend
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserSelect = (userId) => {
    setSelectedUserId(userId);
  };

  return (
    <div className="App">
      <h1>Parkify Chat</h1>
      <div className="users-list">
        {users.length > 0 ? (
          users.map((user) => (
            <button key={user.id} onClick={() => handleUserSelect(user.id)}>
              Chat with {user.name}
            </button>
          ))
        ) : (
          <p>No users available</p>
        )}
      </div>
      {selectedUserId && (
        <Chat currentUserId={currentUserId} selectedUserId={selectedUserId} />
      )}
    </div>
  );} 