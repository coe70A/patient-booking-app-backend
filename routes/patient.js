const express = require('express')

const { registerUser, createAppointment } = require('../controllers/patients.js')
const { verifyPatientRegistration, verifyCreateAppointment } = require('../middleware/verifyRequest')

const router = express.Router()

// POST /api/patient/register
router.post('/register', verifyPatientRegistration, registerUser)

// POST /api/patient/appointment
router.post('/appointment', verifyCreateAppointment, createAppointment)

module.exports = router
