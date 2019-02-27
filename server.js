// imports
const express = require('express');
const helmet = require('helmet');

const usersRouter = require('./users/usersRouter');

// server commands
const server = express();
server.use(express.json());
server.use(helmet());

server.use('/api/users', usersRouter);

server.get('/', async (req, res) => {
    res.send(`It's working!!!`);
})

module.exports = server;