const express = require('express');

const app = express();

// Built in middleware
app.use(express.static(`${__dirname}/../public`));
app.use(express.json());
app.use(require('cookie-parser')());

// App routes
app.use('/api/v1/auth', require('./controllers/auth'));
app.use('/api/v1/gweets', require('./controllers/gweets'));
app.use('/api/v1/users', require('./controllers/users'));

// Error handling & 404 middleware for when
// a request doesn't match any app routes
app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
