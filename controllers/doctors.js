const dbService = require('../database/dbService')

const db = dbService.getDbServiceInstance()

const registerDoctor = async (req, res) => {
  try {
    console.log('INSIDE REGISTER DOCTRO')
    // Check if clinic exists
    const clinicResp = await db.getClinics(req.body.clinic.name)

    // If clinic doesn't exist we want to register a new clinic
    const clinic = clinicResp.rows.length === 0 ? await db.registerClinic(req.body.clinic) : clinicResp.rows[0]

    const doctor = await db.registerDoctor(req.body, clinic.id)

    console.log(doctor)

    res.status(200).send({ code: 200, doctor_id: doctor.id })
  } catch (err) {
    console.log('Encountered error registering user', err)

    res.status(500).send({ code: 500, error: 'server_error' })
  }
}

const fetchDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.query.doctor_id

    if (!doctorId) res.status(400).send({ code: 400, error: 'invalid_request' })

    const appointments = await db.fetchDoctorAppointments(doctorId)

    console.log(appointments)

    res.status(200).send({ code: 200, doctor_id: doctorId, appointments })
  } catch (err) {
    console.log('Encountered error fetching doctor appointments', err)

    res.status(500).send({ code: 500, error: 'server_error' })
  }
}

module.exports = {
  registerDoctor,
  fetchDoctorAppointments
}
