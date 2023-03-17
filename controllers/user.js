const dbService = require('../database/dbService')

const db = dbService.getDbServiceInstance()

const getUser = async (req, res) => {
  const email = req.params.email
  console.log(email)

  if (!email) res.status(400).send({ error: 'invalid_query_parameters' })

  const user = await db.fetchUser(email)
  console.log(user)

  if (!user) res.status(400).send({ error: 'no_user_found' })

  if (user.is_patient === null) res.status(200).send({ status: 200, msg: 'user_is_not_registered' })

  if (user.is_patient) {
    const patientInfo = await db.fetchPatient(email)
    res.status(200).send({ status: 200, is_patient: true, data: patientInfo })
  } else {
    const doctorInfo = await db.fetchDoctor(email)
    console.log(doctorInfo)
    res.status(200).send({ status: 200, is_patient: false, data: doctorInfo })
  }

  res.status(500)
}

module.exports = {
  getUser
}
