const dbService = require('../database/dbService')

const db = dbService.getDbServiceInstance()

const getUser = async (req, res) => {
  const email = req.params.email
  console.log(email)

  if (!email) return res.status(400).send({ error: 'invalid_query_parameters' })

  const user = await db.fetchUser(email)
  console.log(user)

  if (!user) return res.status(400).send({ error: 'no_user_found' })

  if (user?.is_patient === null) return res.status(200).send({ status: 200, msg: 'user_is_not_registered' })
  // if (user?.is_patient === undefined) res.status(200).send({ status: 200, msg: 'user_is_not_registered' })

  if (user?.is_patient) {
    const patientInfo = await db.fetchPatient(email)
    return res.status(200).send({ status: 200, is_patient: true, data: patientInfo })
  } else {
    const doctorInfo = await db.fetchDoctor(email)
    console.log(doctorInfo)
    return res.status(200).send({ status: 200, is_patient: false, data: doctorInfo })
  }

  // returnres.status(500)
}

module.exports = {
  getUser
}
