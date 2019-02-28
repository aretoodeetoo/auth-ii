const router = require('express').Router();
const bcrypt = require('bcryptjs');

const tokenFunctions = require('./tokenFunctions.js');
const Users = require('../users/usersFunctions');

// `/api/auth`
router.post('/signup', (req, res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;

    Users
        .insert(user)
        .then(saved => {
            res.status(201).json(saved);
        })
        .catch(error => 
            res.status(500).json(error)
        );
});

router.post('/login', (req, res) => {
    let { username, password } = req.body;

    Users.findBy({ user })
        .first()
        .then(user => {
            if(user && bcrypt.compareSync(password, user.password)){
                const token = tokenFunctions.createToken(user);
                res.status(200).json({
                    message: `Welcome to The List`,
                    token
                });
            } else {
                res.status(401).json({ message: `You are not welcome here`});
            }
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

module.exports = router;