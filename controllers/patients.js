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
    // eslint-disable-next-line camelcase
    const { doctor_id, schedule_date } = req.body
    const doctorApp = await db.fetchDoctorAppointments(doctor_id)
    console.log('DOCTOR APP')
    console.log(doctorApp)

    let valid = false

    const givenScheduleDate = new Date(schedule_date)
    for (let i = 0; i < doctorApp.length; i++) {
      const appointment = doctorApp[i]
      const appointmentScheduleDate = new Date(appointment.schedule_date)
      if (givenScheduleDate === appointmentScheduleDate) {
        valid = true // Given appointment falls within the schedule date
      }
    }

    console.log('IS VALID?>>>>>????')
    console.log(valid)

    await db.createAppointment(req.body)

    res.status(200).send({ code: 200 })
  } catch (err) {
    console.log('Encountered error registering user', err)

    res.status(500).send({ code: 500, error: 'server_error' })
  }
}

const fetchPatientAppointments = async (req, res) => {
  try {
    const patientId = req.params.patient_id

    console.log('Patient ID')
    console.log(patientId)

    if (!patientId) res.status(400).send({ code: 400, error: 'invalid_request' })

    const appointments = await db.fetchPatientAppointments(patientId)

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
