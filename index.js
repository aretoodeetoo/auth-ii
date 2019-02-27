// require('dotenv').config();
// const server = require('./server');

const express = require('express');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('./data/dbConfig');
const Users = require('./users/usersFunctions');

const secret = 'I like trains';

const server = express();

server.use(express.json());
server.use(helmet());

server.get('/', (req, res) => {
    res.send(`It's working!!! It's working!!!`);
})


server.post('/api/register', (req, res) => {
    let user = req.body;

    const hash = bcrypt.hashSync(user.password, 10);

    user.password = hash;

    Users
        .insert(user)
        .then(saved => {
            res.status(201).json(saved)
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

function createToken(user) {
    const payload = {
        subject: user.id,
        username: user.username,
    };

    const options = {
        expiresIn: '1d'
    };

    return jwt.sign(payload, secret, options)
};

server.post('/api/login', (req, res) => {
    let { username, password } = req.body;

    Users.findBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                const token = createToken(user);
                res.status(200).json({ message: `Welcome to the dark side, ${user.username}`});
            } else {
                res.status(401).json({ message: 'Username or password is incorrect'})
            }
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

function restricted(req, res, next) {
    const token = req.headers.authorization;
    if (token){
        jwt.verify(token, secret, (err, decodedToken) => {
            if (err) {
                res.status(401).json({ message: 'You have meddled with things you should not'});
            } else {
                req.decode = decodedToken;
                next();
            }
        })
    } else {
        res.status(401).json({ message: 'Unauthorized attempt at entry. Area 51 has been notified.' });
    }
}

server.get('/api/users', restricted, (req, res) => {
    Users
        .find()
        .then(users => {
            res.json({ users, decodedToken: req.decode });
        })
        .catch(err => res.send(err));
    }
)

server.get('/users', restricted, async (req, res) => {
    try {
        const users = await Users.find();
        res.json(users);
    } catch(error) {
        res.send(error);
    }
});

const port = process.env.PORT || 5000;

server.listen(port, () => {
    console.log(`Server running on Port ${port}`)
});