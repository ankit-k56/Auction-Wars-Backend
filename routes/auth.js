const express = require('express')
const router = express.Router()
const {login , register,getUser} = require('../controllers/auth')
const authenticate = require('../middleware/authentication')

router.post('/login', login)
router.post('/register', register)
router.get('/', authenticate,getUser)
module.exports = router