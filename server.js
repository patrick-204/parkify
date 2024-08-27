// load .env data into process.env
require('dotenv').config();

// Web server config
const sassMiddleware = require('./lib/sass-middleware');
const express = require('express');
const morgan = require('morgan');
const cookieSession = require("cookie-session");

const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 8080;
const app = express();


// socket.io configuration 
const server = http.createServer(app);
const io = new Server(server);

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

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use('/api/users', userApiRoutes);
app.use('/users', usersRoutes);
app.use('/users', userRegistrationRoutes);
app.use('/login', userLoginRoutes);
app.use('/logout', userLogoutRoutes);
app.use('/api/vehicles', vehicleApiRoutes );
app.use('/vehicles', vehiclesRoutes );
app.use('/api/parking_spaces', parkingSpacesRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/checkout', paymentsRoutes);
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get('/', (req, res) => {
  const isLoggedIn = req.session.userId !== undefined;
  res.render('index', { isLoggedIn });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

