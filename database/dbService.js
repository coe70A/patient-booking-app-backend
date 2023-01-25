/* eslint-disable camelcase */
const PostgresPool = require('pg').Pool
const dotenv = require('dotenv')
const { v4: uuidv4 } = require('uuid')

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
    const { email, first_name, last_name, phone, birthday } = prop

    const insertId = await new Promise((resolve, reject) => {
      const query1 = 'INSERT INTO person (email, first_name, last_name, phone, birthday) VALUES ($1, $2, $3, $4, $5) RETURNING *'
      connection.query(query1, [email, first_name, last_name, phone, birthday], (error, result) => {
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

  async registerDoctor (prop, clinicId) {
    const { email } = prop

    try {
      await this.registerUser(prop)

      const insertId = await new Promise((resolve, reject) => {
        const query = 'INSERT INTO doctor (id, email, clinic_id) VALUES ($1, $2, $3) RETURNING *'
        connection.query(query, [uuidv4(), email, clinicId], (error, result) => {
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

  async registerPatient (prop) {
    const { ohip_number, email, doctor_id } = prop

    try {
      await this.registerUser(prop)

      const insertId = await new Promise((resolve, reject) => {
        const query = 'INSERT INTO patient (ohip_number, doctor_id) VALUES ($1, $2) RETURNING *'
        connection.query(query, [ohip_number, email, doctor_id], (error, result) => {
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

  async createAppointment (prop) {
    const { doctor_id, patient_id, schedule_date, creation_date, appointment_name, description } = prop

    try {
      await this.registerUser(prop)

      const insertId = await new Promise((resolve, reject) => {
        const query = 'INSERT INTO appointment (doctor_id, patient_id, schedule_date, creation_date, appointment_name, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *'
        connection.query(query, [doctor_id, patient_id, schedule_date, creation_date, appointment_name, description], (error, result) => {
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