const express = require('express');
const router = express.Router();
const db = require('../db/connection'); 

// Fetch all messages between two users
router.get('/messages/:userId1/:userId2', async (req, res) => {
  const { userId1, userId2 } = req.params;
  
  try {
    const messagesQuery = `
      SELECT * FROM messages 
      WHERE (sender_id = $1 AND receiver_id = $2) 
         OR (sender_id = $2 AND receiver_id = $1)
      ORDER BY created_at ASC
    `;

    const result = await db.query(messagesQuery, [userId1, userId2]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'An error occurred while fetching messages.' });
  }
});

//Send a message between two users 
router.post('/messages', async (req, res) => {
  const { sender_id, receiver_id, content } = req.body;

  if (!sender_id || !receiver_id || !content) {
    return res.status(400).json({ error: 'Sender, receiver, and content are required.' });
  }

  try {
    const insertMessageQuery = `
      INSERT INTO messages (sender_id, receiver_id, content)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    const result = await db.query(insertMessageQuery, [sender_id, receiver_id, content]);

    res.status(201).json(result.rows[0]); // Send back the inserted message
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'An error occurred while sending the message.' });
  }
});

module.exports = router;