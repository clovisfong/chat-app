const jwt = require('jsonwebtoken')

const SECRET = process.env.JWT_SECRET || 'chatnow'

const generateToken = (id) => {
    return jwt.sign({ id }, SECRET, { expiresIn: "30d" })
}

module.exports = generateToken