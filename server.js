// load .env data into process.env
require('dotenv').config();

// Web server config
const sassMiddleware = require('./lib/sass-middleware');
const express = require('express');
const morgan = require('morgan');

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
const io = new Server(server);


app.use(cors());

// Set up a connection event for incoming sockets
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for chat message events from clients
  socket.on('chat message', (msg) => {
    console.log('Message received:', msg);

    // Broadcast the message to all connected clients
    io.emit('chat message', msg);
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.set('view engine', 'ejs');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(
  '/styles',
  sassMiddleware({
    source: __dirname + '/styles',
    destination: __dirname + '/public/styles',
    isSass: false, // false => scss, true => sass
  })
);
app.use(express.static('public'));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const userApiRoutes = require('./routes/users-api');
const usersRoutes = require('./routes/users');

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use('/api/users', userApiRoutes);
app.use('/users', usersRoutes);
// Note: mount other resources here, using the same pattern above


// React Implementation 
/* app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});
*/ 


app.get('/api/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items'); // Example SQL query
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});



// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/* app.get('/', (req, res) => {
  res.render('index');
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
*/ 
