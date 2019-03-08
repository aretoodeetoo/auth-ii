const router = require('express').Router();

const Users = require('./usersFunctions');
const restricted = require('../auth/middleware');

router.get('/', restricted, (req, res) => {
    Users
        .find()
        .then(users => {
        res.json({ users, decode: req.decodedJot });
    })
        .catch(err => res.send(err));
});

// user endpoints 

module.exports = router;