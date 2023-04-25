const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')

const patientRoutes = require('./routes/patient')
const doctorRoutes = require('./routes/doctor')
const userRoutes = require('./routes/user')

const app = express()

dotenv.config()

// Middleware
app.use(express.json())
app.use(cors())

// Routes
app.use('/api/patient', patientRoutes)
app.use('/api/doctor', doctorRoutes)
app.use('/api/user', userRoutes)

// const port = 8080;
const port = 5000;
// const HOST = '0.0.0.0';
console.log("Hello There")
app.listen(port, () => console.log('Listening....'))
