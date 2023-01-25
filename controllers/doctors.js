const dbService = require('../database/dbService')

const db = dbService.getDbServiceInstance()

const registerDoctor = async (req, res) => {
  try {
    // Check if clinic exists
    const clinicResp = await db.getClinics(req.body.clinic.name)

    // If clinic doesn't exist we want to register a new clinic
    const clinic = clinicResp.rows.length === 0 ? await db.registerClinic(req.body.clinic) : clinicResp.rows[0]

    await db.registerDoctor(req.body, clinic.id)

    res.status(200).send({ code: 200 })
  } catch (err) {
    console.log('Encountered error registering user', err)

    res.status(500).send({ code: 500, error: 'server_error' })
  }
}

module.exports = {
  registerDoctor
}
