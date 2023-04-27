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

    // const app = {
    //   app.
    // }

    console.log(appointments)

    res.status(200).send({ code: 200, doctor_id: doctorId, appointments })
  } catch (err) {
    console.log('Encountered error fetching doctor appointments', err)

    res.status(500).send({ code: 500, error: 'server_error' })
  }
}

const fetchDoctors = async (req, res) => {
  try {
    const doctors = await db.fetchAllDoctors()

    if (!doctors) res.status(400).send({ error: 'no_doctors_found' })

    console.log(doctors)

    res.status(200).send({ data: doctors })
  } catch (err) {
    console.log('Encountered error fetching doctor appointments', err)

    res.status(500).send({ code: 500, error: 'server_error' })
  }
}

const checkIfAppointmentFallsWithinSchedule = (appointments, givenAppointment) => {
  console.log('INSIDE CHECK')
  const dateBeforeParse = new Date(givenAppointment)
  const givenScheduleDate = new Date(dateBeforeParse.getFullYear(), dateBeforeParse.getMonth(), dateBeforeParse.getDate(), dateBeforeParse.getHours(), dateBeforeParse.getMinutes(), 0, 0) // Create a new Date object without seconds and milliseconds

  console.log('HEJWAHDKJHAWJKDHAWKJDHKJAWHDjk')
  console.log(givenScheduleDate)
  // givenScheduleDate.setSeconds(0)
  for (let i = 0; i < appointments.length; i++) {
    const appointment = appointments[i]
    if (appointment.schedule_date) {
      // const apptDate = appointment.schedule_date
      const apptDate = new Date(appointment.schedule_date)
      const appointmentScheduleDate = new Date(apptDate.getFullYear(), apptDate.getMonth(), apptDate.getDate(), apptDate.getHours(), apptDate.getMinutes(), 0, 0) // Create a new Date object without seconds and milliseconds
      // appointmentScheduleDate.setSeconds(0)
      console.log(appointmentScheduleDate)

      const duration = appointment.duration * 60000

      console.log('given: ', givenScheduleDate.getTime())
      console.log('compare to : ', appointmentScheduleDate.getTime())
      // if (duration && (givenScheduleDate.getTime() >= appointmentScheduleDate.getTime() || givenScheduleDate.getTime() <= appointmentScheduleDate.getTime() + duration)) {
      //   console.log('FOUND ONE')
      //   console.log('givenScheduleDate')
      //   console.log(givenScheduleDate)
      //   console.log('appointmentScheduleDate')
      //   console.log(appointmentScheduleDate)
      //   console.log(appointment)
      //   return true // Given appointment falls within the schedule date
      // }

      // console.log('given: ', givenScheduleDate.toDateString())
      // console.log('compare to : ', appointmentScheduleDate.toDateString())
      if (givenScheduleDate.getTime() >= appointmentScheduleDate.getTime() && givenScheduleDate.getTime() <= appointmentScheduleDate.getTime() + duration) {
        console.log('FOUND ONE')
        console.log('givenScheduleDate')
        console.log(givenScheduleDate)
        console.log('appointmentScheduleDate')
        console.log(appointmentScheduleDate)
        console.log(appointment)
        return true // Given appointment falls within the schedule date
      }
    }
  }
  return false // Given appointment does not fall within the schedule date
}

const updateAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.appointment_id

    const task = await db.fetchAppointment(appointmentId)

    console.log('INSIDE UPDATEW APPOINTYMENT')

    // TODO: We should different error codes. Right now we throw 500 for everything
    if (task.length === 0) { throw Error(`Unable to find appointment id ${appointmentId}`) }

    // eslint-disable-next-line camelcase
    const { illnesses, schedule_date } = req.body
    console.log('ILLNESS')
    console.log(illnesses)

    console.log('TASKKKKK')
    console.log(task)

    console.log('req.body')
    console.log(req.body)

    const appt = task[0]

    // const duration = req.body.duration

    if (req.body.schedule_date) {
      const doctorApp = await db.fetchDoctorAppointments(appt.doctor_id)
      console.log('DOCTOR APP')
      console.log(doctorApp)

      console.log('APPTTTT')
      console.log(appt)

      const result = checkIfAppointmentFallsWithinSchedule(doctorApp, schedule_date)

      console.log('THIS IS THE RESULT')
      console.log(result)
      if (result === true) {
        return res.status(200).send({ error: 'no valid timeslot' })
      }
    }

    await db.updateTask(appointmentId, { ...req.body, illnesses: illnesses?.join() })

    return res.status(200).send({ success: 'true' })
  } catch (err) {
    console.log('Encountered error updating tasks', err)

    res.status(500).send('server_error')
  }
}

const deleteAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.appointment_id

    const task = await db.fetchAppointment(appointmentId)

    console.log('GOT APPOINTMENTS')
    // TODO: We should different error codes. Right now we throw 500 for everything
    if (task.length === 0) { throw Error(`Unable to find appointment id ${appointmentId}`) }

    console.log('ABOUT TO DELETE ')
    await db.deleteAppointment(appointmentId)

    res.status(200).send()
  } catch (err) {
    console.log('Encountered error updating tasks', err)

    res.status(500).send('server_error')
  }
}

module.exports = {
  registerDoctor,
  fetchDoctorAppointments,
  updateAppointment,
  fetchDoctors,
  deleteAppointment
}
