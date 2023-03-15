const express = require('express')

const { getUser } = require('../controllers/user.js')

const router = express.Router()

// GET /api/user/{email}
router.get('/:email', getUser)

module.exports = router
