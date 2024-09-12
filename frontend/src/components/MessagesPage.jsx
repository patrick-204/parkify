/*

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:8080');

const MessagesPage = ({ currentUserId, selectedUserId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (selectedUserId) {
      fetchMessages();
      socket.emit('joinRoom', { userId: currentUserId, selectedUserId });

      socket.on('receiveMessage', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }

    return () => {
      socket.off('receiveMessage');
    };
  }, [selectedUserId]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`/api/messages/${currentUserId}/${selectedUserId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = () => {
    const messageData = {
      sender_id: currentUserId,
      receiver_id: selectedUserId,
      content: newMessage,
    };

    socket.emit('sendMessage', messageData);
    setMessages((prevMessages) => [...prevMessages, messageData]);
    setNewMessage('');
  };

  return (
    <div className="chat-container">
      <div className="messages-list">
        {messages.map((msg) => (
          <div key={msg.id} className={msg.sender_id === currentUserId ? 'my-message' : 'their-message'}>
            {msg.content}
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message here..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default MessagesPage;

*/ 