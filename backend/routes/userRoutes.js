const express = require('express')
const { registerUser, authUser } = require('../controllers/userControllers');
const User = require('../models/userModel');

const router = express.Router()

router.route('/').post(registerUser);
router.post('/login', authUser)


module.exports = router