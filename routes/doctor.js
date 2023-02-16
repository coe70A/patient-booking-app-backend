const express = require('express')

const { registerDoctor } = require('../controllers/doctors.js')
const { verifyDoctorRegistration } = require('../middleware/verifyRequest')

const router = express.Router()

// POST /api/doctor/register
router.post('/register', verifyDoctorRegistration, registerDoctor)

// GET /api/doctor/{doctor_id}/appointments
router.get('/{doctor_id/appointment', verifyDoctorRegistration, registerDoctor)

module.exports = router
