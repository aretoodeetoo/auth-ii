// imports
const express = require('express');
const applyGlobalMiddleware = require('./globalMiddleware');

// Route Imports
const usersRouter = require('../routes/users/usersRouter');
const authRouter = require('../routes/auth/authRouter');
const secrets = require('../config/secrets.js');

// server commands
const server = express();

applyGlobalMiddleware(server);

// Use Routes
server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
    res.send(`It's working!!!`);
})

module.exports = server;