// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const secretKey = 'eb88b113e05038babf8fb7b2b6702ead5deb77eebd5994496cbd74d912e23657ee0f8d039f3a82e196218c778493edbb9fd61034d27526d4ee02d4109d5b603a'; // Replace with a strong secret key

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secretKey = 'eb88b113e05038babf8fb7b2b6702ead5deb77eebd5994496cbd74d912e23657ee0f8d039f3a82e196218c778493edbb9fd61034d27526d4ee02d4109d5b603a'; // Replace with a strong secret key

// Mock user data
const users = [{
    id: 1,
    username: 'testuser',
    password: bcrypt.hashSync('user12##', 10) // Hashed password
}];

function generateToken(user) {
    return jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

module.exports = { users, generateToken, authenticateToken };