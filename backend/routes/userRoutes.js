const express = require('express')
const { registerUser, authUser, allUsers } = require('../controllers/userControllers');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/userModel');

const router = express.Router()

router.route('/').post(registerUser).get(protect, allUsers);
router.post('/login', authUser)


module.exports = router