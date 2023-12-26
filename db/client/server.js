require("dotenv").config({
	path: `.env.${process.env.NODE_ENV || "development"}`,
});
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.json());

io.on("connection", (socket) => {
	console.log("Client connected");

	socket.on("doctorUpdate", () => {
		// Broadcast the doctor update to all connected clients
		io.emit("doctorUpdate");
	});

	socket.on("disconnect", () => {
		console.log("Client disconnected");
	});
});

const pool = new Pool({
	user: process.env.DB_USER || "postgres",
	host: process.env.DB_HOST || "localhost",
	database: process.env.DB_NAME || "clinic_management_db",
	password: process.env.DB_PASSWORD || "1321",
	port: process.env.DB_PORT || 5433,
});

module.exports = pool;

app.post("/admin/login", async (req, res) => {
	try {
		const { password } = req.body;

		// Здійснюємо запит до БД для перевірки пароля
		const result = await pool.query(
			"SELECT * FROM admin_user WHERE password = $1",
			[password]
		);

		if (result.rows.length > 0) {
			// Якщо пароль знайдено в БД, повертаємо успіх
			res.json({ success: true });
		} else {
			// Якщо пароль не знайдено в БД, повертаємо невдачу
			res.json({ success: false });
		}
	} catch (error) {
		console.error("Error during login:", error);
		res.status(500).json({
			success: false,
			error: "Internal Server Error",
		});
	}
});

app.get("/admin/doctors", async (req, res) => {
	try {
		const result = await pool.query("SELECT * FROM doctors");
		res.json(result.rows);
	} catch (error) {
		console.error("Error fetching doctors:", error);
		res.status(500).json({
			success: false,
			error: "Internal Server Error",
		});
	}
});

app.post("/admin/doctors", async (req, res) => {
	try {
		const newDoctor = req.body;

		// Перевіряємо, чи не існує лікар з таким же ім'ям в базі
		const existingDoctor = await pool.query(
			"SELECT * FROM doctors WHERE full_name = $1",
			[newDoctor.full_name]
		);

		if (existingDoctor.rows.length > 0) {
			return res.status(400).json({
				success: false,
				error: "Doctor with the same name already exists.",
			});
		}

		// Додаємо нового лікаря
		const result = await pool.query(
			"INSERT INTO doctors (full_name, specialization) VALUES ($1, $2) RETURNING *",
			[newDoctor.full_name, newDoctor.specialization]
		);

		res.json({ success: true, data: result.rows[0] });
	} catch (error) {
		console.error("Error adding doctor:", error);
		res.status(500).json({
			success: false,
			error: "Internal Server Error",
		});
	}
});

app.get("/admin/appointments", async (req, res) => {
	const { doctor } = req.query;
	const query =
		"SELECT appointments.*, doctors.full_name AS doctor_full_name FROM appointments";
	const joinClause =
		" LEFT JOIN doctors ON appointments.doctor_id = doctors.doctor_id";
	let whereClause = "";
	const values = [];

	if (doctor) {
		whereClause = " WHERE";
		whereClause += " doctors.doctor_id = $1";
		values.push(doctor);
	}

	try {
		const result = await pool.query(
			`${query}${joinClause}${whereClause}`,
			values
		);
		res.json(result.rows);
	} catch (error) {
		console.error("Error fetching appointments:", error);
		res.status(500).json({
			success: false,
			error: "Internal Server Error",
		});
	}
});

app.delete("/admin/appointments", async (req, res) => {
	try {
		const { appointmentIds } = req.body;

		// Perform database deletion or any other necessary logic
		// Assuming there's an "appointments" table in your database
		const result = await pool.query(
			"DELETE FROM appointments WHERE appointment_id = ANY($1) RETURNING *",
			[appointmentIds]
		);

		res.json({ success: true, data: result.rows });
	} catch (error) {
		console.error("Error deleting appointments:", error);
		res.status(500).json({
			success: false,
			error: "Internal Server Error",
		});
	}
});

// Додамо функцію для видалення лікарів
app.delete("/admin/doctors", async (req, res) => {
	try {
		const { doctorIds } = req.body;

		// Видаляємо лікарів за списком ідентифікаторів
		const result = await pool.query(
			"DELETE FROM doctors WHERE doctor_id = ANY($1) RETURNING *",
			[doctorIds]
		);

		res.json({ success: true, data: result.rows });
	} catch (error) {
		console.error("Error deleting doctors:", error);
		res.status(500).json({
			success: false,
			error: "Internal Server Error",
		});
	}
});

// Додамо функцію для отримання всіх лікарів
app.get("/admin/all-doctors", async (req, res) => {
	try {
		const result = await pool.query("SELECT * FROM doctors");
		res.json(result.rows);
	} catch (error) {
		console.error("Error fetching all doctors:", error);
		res.status(500).json({
			success: false,
			error: "Internal Server Error",
		});
	}
});

app.get("/api/doctors", async (req, res) => {
	try {
		const result = await pool.query("SELECT * FROM doctors");
		res.json(result.rows);
	} catch (error) {
		console.error("Error executing query", error);
		res.status(500).json({
			success: false,
			error: "Internal Server Error",
		});
	}
});

const appointments = [];

app.get("/api/appointments/availableTimes", async (req, res) => {
	const { doctor_id, date } = req.query;

	try {
		// Fetch the booked times for the selected doctor and date
		const result = await pool.query(
			"SELECT DISTINCT appointment_time FROM appointments WHERE doctor_id = $1 AND appointment_date = $2",
			[doctor_id, date]
		);

		const bookedTimes = result.rows.map(
			(appointment) => appointment.appointment_time
		);
		res.json(bookedTimes);
	} catch (error) {
		console.error("Error fetching available times:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

app.post("/api/appointments", async (req, res) => {
	try {
		const patientData = req.body;
		const result = await pool.query(
			"INSERT INTO appointments (first_name, last_name, middle_name, date_of_birth, email_address, address, insurance_number, phone_number, doctor_id, appointment_date, appointment_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
			[
				patientData.first_name,
				patientData.last_name,
				patientData.middle_name,
				patientData.date_of_birth,
				patientData.email_address,
				patientData.address, // Include address in the query
				patientData.insurance_number,
				patientData.phone_number,
				patientData.doctor_id,
				patientData.appointment_date,
				patientData.appointment_time,
			]
		);
		res.json({ success: true, data: result.rows[0] });
	} catch (error) {
		console.error("Error executing query", error);
		res.status(500).json({
			success: false,
			error: "Internal Server Error",
		});
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
