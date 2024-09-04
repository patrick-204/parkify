// load .env data into process.env
require("dotenv").config();


// Web server config
const sassMiddleware = require('./lib/sass-middleware');
const express = require('express');
const morgan = require('morgan');
const cookieSession = require("cookie-session");

const http = require('http');
const { Server } = require('socket.io');

const cors = require('cors');

const db = require('./db/connection'); // Import the PostgreSQL db

const PORT = process.env.PORT || 8080;
const app = express();

// React implementation 
const path = require('path');
app.use(express.static(path.join(__dirname, 'frontend/build')));



// socket.io configuration
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Your frontend URL
    methods: ["GET", "POST"]
  }
});

app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  methods: ['GET', 'POST']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);
app.use(express.static('public'));

app.use(
  cookieSession({
    name: "session",
    keys: ["secret"],
  })
);

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const userApiRoutes = require('./routes/users-api');
const usersRoutes = require('./routes/users');
const userRegistrationRoutes = require('./routes/user-registration');
const userLoginRoutes = require('./routes/user-login');
const userLogoutRoutes = require('./routes/user-logout');
const parkingSpacesRoutes = require ('./routes/parking_spaces_api');
const vehiclesRoutes = require ('./routes/vehicles');
const vehicleApiRoutes = require ('./routes/vehicles-api');
const reservationsRoutes = require ('./routes/reservations_api');
const paymentsRoutes = require('./routes/checkout');
const messagesRoutes = require('./routes/messages.js'); 

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use('/api/users', userApiRoutes);
app.use('/users', usersRoutes);
app.use('/signup', userRegistrationRoutes);
app.use('/login', userLoginRoutes);
app.use('/logout', userLogoutRoutes);
app.use('/api/vehicles', vehicleApiRoutes );
app.use('/vehicles', vehiclesRoutes );
app.use('/api/parking_spaces', parkingSpacesRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/checkout', paymentsRoutes);
app.use('/messaging', messagesRoutes); 
// Note: mount other resources here, using the same pattern above


// React Implementation 
/* app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});
*/ 


app.get('/api/users', async (req, res) => {
  try {
    // Fetch all users from the database except the current user
    const users = await db.query('SELECT id, name FROM users WHERE id != $1', [currentUserId]); 
    res.json(users.rows); // Send users to the front end
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Server error');
  }
});

// Listen for socket.io connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinRoom', ({ userId, selectedUserId }) => {
    const room = `room-${userId}-${selectedUserId}`;
    socket.join(room);
    console.log(`User ${userId} joined room ${room}`);
  });

  // Listen for a new message from client
  socket.on('send_message', async (data) => {
    const { sender_id, receiver_id, content } = data;
    
    try {
      const insertMessageQuery = `
        INSERT INTO messages (sender_id, receiver_id, content)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;
      const result = await db.query(insertMessageQuery, [sender_id, receiver_id, content]);
      
      // Emit the message to both the sender and receiver
      io.to(receiver_id).emit('receive_message', result.rows[0]);
      io.to(sender_id).emit('receive_message', result.rows[0]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});



// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).


server.listen(PORT, () => {
  console.log('Server is running on http://localhost:8080');
});



/* app.get('/', (req, res) => {
  res.render('index');
app.get('/', (req, res) => {
  const isLoggedIn = req.session.userId !== undefined;
  res.render('index', { isLoggedIn });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
*/ 
