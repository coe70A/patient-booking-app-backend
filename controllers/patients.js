const dbService = require('../database/dbService')

const db = dbService.getDbServiceInstance()

const registerUser = async (req, res) => {
  try {
    await db.registerPatient(req.body)

    res.status(200).send({ code: 200 })
  } catch (err) {
    console.log('Encountered error registering user', err)

    res.status(500).send({ code: 500, error: 'server_error' })
  }
}

const createAppointment = async (req, res) => {
  try {
    await db.registerPatient(req.body)

    res.status(200).send({ code: 200 })
  } catch (err) {
    console.log('Encountered error registering user', err)

    res.status(500).send({ code: 500, error: 'server_error' })
  }
}

module.exports = {
  registerUser,
  createAppointment
}
