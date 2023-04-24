const express = require('express')

const { registerDoctor, fetchDoctorAppointments, updateAppointment, fetchDoctors, deleteAppointment } = require('../controllers/doctors.js')
const { verifyDoctorRegistration } = require('../middleware/verifyRequest')

const router = express.Router()

// POST /api/doctor/register
router.post('/register', verifyDoctorRegistration, registerDoctor)

// GET /api/doctor/{doctor_id}/appointments
router.get('/:doctor_id/appointment', fetchDoctorAppointments)

// PUT /api/doctor/appointment
router.put('/appointment/:appointment_id', updateAppointment)

// PUT /api/doctor/appointment
router.delete('/appointment/:appointment_id', deleteAppointment)

// GET /api/doctor
router.get('/', fetchDoctors)

module.exports = router
