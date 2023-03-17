/* eslint-disable camelcase */
const PostgresPool = require('pg').Pool
const dotenv = require('dotenv')
const { v4: uuidv4 } = require('uuid')

const { generateUpdateTaskQuery } = require('./utils/utils.js')

dotenv.config()

const instance = null

// TODO: Add these config vars to .env file
// For now it doesn't matter since these creds aren't going to be used in PROD
const connection = new PostgresPool({
  host: 'localhost',
  user: 'postgres',
  password: 'password',
  database: 'capstone',
  port: '5432'
})

// TODO: A lot of repeated logic here. Can probably collapse all of this down into a singular method
class DbService {
  static getDbServiceInstance () {
    return instance || new DbService()
  }

  async registerUser (prop) {
    const { email, first_name, last_name, phone, birthday, is_patient } = prop

    const insertId = await new Promise((resolve, reject) => {
      const query1 = 'INSERT INTO person (email, first_name, last_name, phone, birthday, is_patient) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *'
      connection.query(query1, [email, first_name, last_name, phone, birthday, is_patient], (error, result) => {
        if (error) {
          reject(new Error(error.message))
        } else {
          resolve(result.insertId)
        }
      })
    })
    return insertId
  }

  async registerClinic (prop) {
    console.log('Inside register clinic')
    console.log(prop)
    const { name, postal_code, province, city, country, street_number, street_name } = prop

    try {
      const response = await new Promise((resolve, reject) => {
        const query = 'INSERT INTO clinic (id, name, postal_code, province, city, country, street_number, street_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *'
        connection.query(query, [uuidv4(), name, postal_code, province, city, country, street_number, street_name], (error, result) => {
          if (error) {
            console.log('Error: ', error)
            reject(new Error(error.message))
          } else {
            resolve(result)
          }
        })
      })

      if (response.rows.length === 0) throw Error('Error registering clinic')

      return response.rows[0]
    } catch (error) {
      console.log(error.message)
      throw error
    }
  }

  async getClinics (name) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = 'SELECT * FROM clinic WHERE name = $1 ;'
        connection.query(query, [name], (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(result)
          }
        })
      })
      return response
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async fetchUser (email) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = 'SELECT * FROM person WHERE email = $1 ;'
        connection.query(query, [email], (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(result.rows[0])
          }
        })
      })
      return response
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async registerDoctor (prop, clinicId) {
    const { email } = prop

    try {
      await this.registerUser({ ...prop, is_patient: false })

      const insertId = await new Promise((resolve, reject) => {
        const query = 'INSERT INTO doctor (id, email, clinic_id) VALUES ($1, $2, $3) RETURNING *'
        connection.query(query, [uuidv4(), email, clinicId], (error, result) => {
          if (error) {
            reject(new Error(error.message))
          } else {
            resolve(result.rows[0])
          }
        })
      })
      return insertId
    } catch (error) {
      console.log(error.message)
      throw error
    }
  }

  async fetchDoctorAppointments (doctorId) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = 'SELECT * FROM appointment WHERE doctor_id = $1'
        connection.query(query, [doctorId], (error, result) => {
          if (error) {
            reject(new Error(error.message))
          } else {
            resolve(result.rows)
          }
        })
      })
      return response
    } catch (error) {
      console.log(error.message)
      throw error
    }
  }

  async fetchAppointment (appointmentId) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = 'SELECT * FROM appointment WHERE id = $1'
        connection.query(query, [appointmentId], (error, result) => {
          if (error) {
            reject(new Error(error.message))
          } else {
            resolve(result.rows)
          }
        })
      })
      return response
    } catch (error) {
      console.log(error.message)
      throw error
    }
  }

  async updateTask (id, props) {
    const { query, values } = generateUpdateTaskQuery(id, props)

    try {
      const response = await new Promise((resolve, reject) => {
        connection.query(query, values, (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(result)
          }
        })
      })
      return response
    } catch (error) {
      console.log(error)
    }
  }

  async fetchPatientAppointments (patientId) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = 'SELECT * FROM appointment WHERE patient_id = $1'
        connection.query(query, [patientId], (error, result) => {
          if (error) {
            reject(new Error(error.message))
          } else {
            resolve(result.rows)
          }
        })
      })
      return response
    } catch (error) {
      console.log(error.message)
      throw error
    }
  }

  async fetchDoctor (email) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = 'SELECT d.id as doctor_id, * FROM person p JOIN doctor d on d.email = p.email JOIN clinic c ON c.id = d.clinic_id WHERE p.email = $1;'
        connection.query(query, [email], (error, result) => {
          if (error) {
            reject(new Error(error.message))
          } else {
            resolve(result.rows[0])
          }
        })
      })
      return response
    } catch (error) {
      console.log(error.message)
      throw error
    }
  }

  async fetchAllDoctors () {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = 'SELECT p.*, d.*, c.name as clinic_name, c.postal_code as clinic_postal_code, c.city as clinic_city, c.province as clinic_province, c.country as clinic_country FROM person p JOIN doctor d on d.email = p.email JOIN clinic c ON c.id = d.clinic_id;'
        connection.query(query, (error, result) => {
          if (error) {
            reject(new Error(error.message))
          } else {
            resolve(result.rows[0])
          }
        })
      })
      return response
    } catch (error) {
      console.log(error.message)
      throw error
    }
  }

  async fetchPatient (email) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = 'SELECT * FROM person p JOIN patient pa ON pa.email = p.email WHERE p.email = $1;'
        connection.query(query, [email], (error, result) => {
          if (error) {
            reject(new Error(error.message))
          } else {
            resolve(result.rows[0])
          }
        })
      })
      return response
    } catch (error) {
      console.log(error.message)
      throw error
    }
  }

  async registerPatient (prop) {
    const { ohip_number, email, doctor_id } = prop

    try {
      await this.registerUser({ ...prop, is_patient: true })

      const insertId = await new Promise((resolve, reject) => {
        const query = 'INSERT INTO patient (ohip_number, email, doctor_id) VALUES ($1, $2, $3) RETURNING *'
        connection.query(query, [ohip_number, email, doctor_id], (error, result) => {
          if (error) {
            reject(new Error(error.message))
          } else {
            resolve(result.rows[0])
          }
        })
      })
      return insertId
    } catch (error) {
      console.log(error.message)
      throw error
    }
  }

  async createAppointment (prop) {
    const { doctor_id, patient_id, schedule_date, appointment_name, description } = prop

    try {
      const insertId = await new Promise((resolve, reject) => {
        const query = 'INSERT INTO appointment (id, doctor_id, patient_id, schedule_date, appointment_name, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *'
        connection.query(query, [uuidv4(), doctor_id, patient_id, schedule_date, appointment_name, description], (error, result) => {
          if (error) {
            reject(new Error(error.message))
          } else {
            resolve(result.insertId)
          }
        })
      })
      return insertId
    } catch (error) {
      console.log(error.message)
      throw error
    }
  }
}

module.exports = DbService
