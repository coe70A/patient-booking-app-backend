const express = require('express')

const { registerUser, createAppointment, fetchPatientAppointments } = require('../controllers/patients.js')
const { verifyPatientRegistration, verifyCreateAppointment } = require('../middleware/verifyRequest')

const router = express.Router()

// POST /api/patient/register
router.post('/register', verifyPatientRegistration, registerUser)

// POST /api/patient/appointment
router.post('/appointment', verifyCreateAppointment, createAppointment)

// GET /api/patient/appointment
router.post('/{patient_id/appointment', verifyCreateAppointment, createAppointment)

// GET /api/doctor/{doctor_id}/appointments
router.get('/:patient_id/appointment', fetchPatientAppointments)

module.exports = router
