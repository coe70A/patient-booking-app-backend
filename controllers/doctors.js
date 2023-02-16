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
    const doctorId = req.params.doctor_id

    console.log('DOCTOR ID')
    console.log(doctorId)

    if (!doctorId) res.status(400).send({ code: 400, error: 'invalid_request' })

    const appointments = await db.fetchDoctorAppointments(doctorId)

    console.log(appointments)

    res.status(200).send({ code: 200, doctor_id: doctorId, appointments })
  } catch (err) {
    console.log('Encountered error fetching doctor appointments', err)

    res.status(500).send({ code: 500, error: 'server_error' })
  }
}

const updateAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.appointment_id

    const task = await db.fetchAppointment(appointmentId)

    // TODO: We should different error codes. Right now we throw 500 for everything
    if (task.length === 0) { throw Error(`Unable to find appointment id ${appointmentId}`) }

    const { illnesses } = req.body

    await db.updateTask(appointmentId, { ...req.body, illnesses: illnesses?.join() })

    res.status(200).send()
  } catch (err) {
    console.log('Encountered error updating tasks', err)

    res.status(500).send('server_error')
  }
}

module.exports = {
  registerDoctor,
  fetchDoctorAppointments,
  updateAppointment
}
