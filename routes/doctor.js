const express = require('express')

const { registerDoctor, fetchDoctorAppointments, updateAppointment} = require('../controllers/doctors.js')
const { verifyDoctorRegistration } = require('../middleware/verifyRequest')

const router = express.Router()

// POST /api/doctor/register
router.post('/register', verifyDoctorRegistration, registerDoctor)

// GET /api/doctor/{doctor_id}/appointments
router.get('/:doctor_id/appointment', fetchDoctorAppointments)

// PUT /api/doctor/appointment
router.put('/appointment/:appointment_id', updateAppointment)

module.exports = router
