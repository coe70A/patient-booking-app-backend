const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')

const patientRoutes = require('./routes/patient')
const doctorRoutes = require('./routes/doctor')

const app = express()

dotenv.config()

// Middleware
app.use(express.json())
app.use(cors())

// Routes
app.use('/api/patient', patientRoutes)
app.use('/api/doctor', doctorRoutes)

const port = 5000

app.listen(port, () => console.log('Listening....'))
