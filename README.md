# patient-booking-app-backend

# Routes
|                |Route                       |
|----------------|-------------------------------|
|Register Patient|`POST /api/patient/register`|
|Register Doctor          |`POST /api/doctor/register`|
|Create Appointment     |`POST /api/patient/appointment`|

###  Example Request Body: POST /api/doctor/register
```
{
    "email": "jeffepst123123@joe.com",
    "first_name": "jeff",
    "last_name": "epst",
    "phone": "123123123",
    "birthday": "09/01/2023",
    "clinic": {
      "name": "Jeff's 4th Clinic",
      "postal_code": "abcabc",
      "province": "ON",
      "city": "Toronto",
      "country": "CA",
      "street_number": "123",
      "street_name": "Street Joe"
    }
}
```

###  Example Request Body: POST /api/patient/register
```
{
    "email": "joefresh123@joe.com",
    "first_name": "joe",
    "last_name": "fresh",
    "phone": "123123123",
    "birthday": "09/01/2023",
    "ohip_number": "123123123123",
    "doctor_id": "e6f2f99c-9265-4421-bf31-9555128b9072"
}
```

# Database Setup

Download Postgres Version 15.1 here: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

Name the database: "capstone"

###  Create tables
```
CREATE TABLE person (
	birthday DATE,
    email VARCHAR(100) NULL,
    phone VARCHAR(100),
    first_name VARCHAR(100) NULL,
    last_name VARCHAR(100) NULL,
    PRIMARY KEY (email)
);

CREATE TABLE clinic(
	id VARCHAR(100) NOT NULL PRIMARY KEY,
	name VARCHAR(100),
    postal_code VARCHAR(100),
    province VARCHAR(100),
    city VARCHAR(100),
    country VARCHAR(100),
    street_number INT,
    street_name VARCHAR(100)
);

CREATE TABLE doctor(
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    email VARCHAR(100) not NULL,
    clinic_id VARCHAR(100),
    FOREIGN KEY(email) REFERENCES person(email) ON DELETE SET NULL,
    FOREIGN KEY(clinic_id) REFERENCES clinic(id) ON DELETE SET NULL
);


CREATE TABLE patient(
    ohip_number VARCHAR(100) NOT NULL PRIMARY KEY,
    email VARCHAR(100),
    doctor_id VARCHAR(100),
    FOREIGN KEY(email) REFERENCES person(email) ON DELETE CASCADE,
    FOREIGN KEY(doctor_id) REFERENCES doctor(id) ON DELETE SET NULL
);

CREATE TABLE appointment(
	id VARCHAR(100) NOT NULL PRIMARY KEY,
	doctor_id VARCHAR(100),
    patient_id VARCHAR(100),
    schedule_date VARCHAR(100) null,
    appointment_name VARCHAR(100),
    description TEXT null,
    illnesses TEXT null,
    is_complete boolean null,
    created VARCHAR(100) null,
    FOREIGN KEY(patient_id) REFERENCES patient(ohip_number) ON DELETE SET NULL,
    FOREIGN KEY(doctor_id) REFERENCES doctor(id) ON DELETE SET NULL
);
```
