const Joi = require('joi')

const schemas = {
  registerPatient: Joi.object({
    email: Joi.string().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    phone: Joi.string(),
    birthday: Joi.string(),
    ohip_number: Joi.string().required(),
    doctor_id: Joi.string()
  }),
  registerDoctor: Joi.object({
    email: Joi.string().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    phone: Joi.string(),
    birthday: Joi.string(),
    clinic: Joi.object({
      id: Joi.string(),
      name: Joi.string(),
      postal_code: Joi.string(),
      province: Joi.string(),
      city: Joi.string(),
      country: Joi.string(),
      street_number: Joi.number(),
      street_name: Joi.string()
    })
  }),
  createAppointment: Joi.object({
    doctor_id: Joi.string(),
    patient_id: Joi.string(),
    schedule_date: Joi.string(),
    appointment_name: Joi.string(),
    description: Joi.string(),
    illnesses: Joi.string().allow(null),
    is_complete: Joi.boolean()
  })
}

const verifyPatientRegistration = async (req, res, next) => {
  const validation = schemas.registerPatient.validate(req.body)

  console.log(validation)

  if (validation.error) { return res.status(400).send({ code: 400, error: 'invalid_request_error' }) }

  next()
}

const verifyDoctorRegistration = async (req, res, next) => {
  const validation = schemas.registerDoctor.validate(req.body)

  console.log(validation)

  if (validation.error) { return res.status(400).send({ code: 400, error: 'invalid_request_error' }) }

  next()
}

const verifyCreateAppointment = async (req, res, next) => {
  const validation = schemas.createAppointment.validate(req.body)

  console.log(validation)

  if (validation.error) { return res.status(400).send({ code: 400, error: 'invalid_request_error' }) }

  next()
}

module.exports = {
  verifyPatientRegistration,
  verifyDoctorRegistration,
  verifyCreateAppointment
}
