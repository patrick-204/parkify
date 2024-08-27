// load .env data into process.env
require('dotenv').config();

// Web server config
const sassMiddleware = require('./lib/sass-middleware');
const express = require('express');
const morgan = require('morgan');
const cookieSession = require("cookie-session");

const PORT = process.env.PORT || 8080;
const app = express();

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


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
