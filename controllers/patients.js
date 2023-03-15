const dbService = require('../database/dbService')

const db = dbService.getDbServiceInstance()

const registerUser = async (req, res) => {
  try {
    const patient = await db.registerPatient(req.body)

    res.status(200).send({ code: 200, data: patient })
  } catch (err) {
    console.log('Encountered error registering user', err)

    res.status(500).send({ code: 500, error: 'server_error' })
  }
}

const createAppointment = async (req, res) => {
  try {
    console.log('before create appointmnet')
    await db.createAppointment(req.body)

    res.status(200).send({ code: 200 })
  } catch (err) {
    console.log('Encountered error registering user', err)

    res.status(500).send({ code: 500, error: 'server_error' })
  }
}

const fetchPatientAppointments = async (req, res) => {
  try {
    const patientId = req.query.patient_id

    if (!patientId) res.status(400).send({ code: 400, error: 'invalid_request' })

    const appointments = await db.fetchDoctorAppointments(patientId)

    console.log(appointments)

    res.status(200).send({ code: 200, patient_id: patientId, appointments })
  } catch (err) {
    console.log('Encountered error fetching patient appointments', err)

    res.status(500).send({ code: 500, error: 'server_error' })
  }
}

module.exports = {
  registerUser,
  createAppointment,
  fetchPatientAppointments
}
