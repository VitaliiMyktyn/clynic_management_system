// AdminPanel.jsx

import React, { useState, useEffect } from "react";
import { Container, Form, Button, Table } from "react-bootstrap";
import axios from "axios";
import "./AdminPanel.css"; // Import your CSS file

const AdminPanel = () => {
	const [password, setPassword] = useState("");
	const [authenticated, setAuthenticated] = useState(false);
	const [username, setUsername] = useState("");
	const [loginError, setLoginError] = useState("");
	const [newDoctor, setNewDoctor] = useState({
		full_name: "",
		specialization: "",
	});
	const [doctors, setDoctors] = useState([]);
	const [appointments, setAppointments] = useState([]);
	const [selectedDoctor, setSelectedDoctor] = useState("");
	const [allDoctors, setAllDoctors] = useState([]);
	const [selectedAppointments, setSelectedAppointments] = useState([]);
	const [selectedDoctors, setSelectedDoctors] = useState([]);

	const apiUrl = process.env.REACT_APP_API_URL;
	const apiEndpoint = process.env.REACT_APP_API_ENDPOINT;

	const handleLogin = async () => {
		try {
			const response = await axios.post(
				"http://localhost:5000/admin/login",
				{
					username,
					password,
				}
			);

			if (response.data.success) {
				setAuthenticated(true);
			} else {
				setLoginError(response.data.message);
			}
		} catch (error) {
			console.error("Error during admin login:", error);
			setLoginError("Internal Server Error");
		}
	};

	const handleAddDoctor = async () => {
		try {
			const response = await axios.post(
				"http://localhost:5000/admin/doctors",
				newDoctor
			);

			if (response.data.success) {
				alert("Doctor added successfully!");
				setNewDoctor({ full_name: "", specialization: "" });
				fetchDoctors();
			} else {
				alert("Error adding doctor. Please try again.");
			}
		} catch (error) {
			console.error("Error adding doctor:", error);
		}
	};

	const handleSelectAppointment = (appointmentId) => {
		if (selectedAppointments.includes(appointmentId)) {
			// If the appointment is already selected, remove it from the list
			setSelectedAppointments(
				selectedAppointments.filter((id) => id !== appointmentId)
			);
		} else {
			// If the appointment is not selected, add it to the list
			setSelectedAppointments([...selectedAppointments, appointmentId]);
		}
	};

	const handleSelectDoctor = (doctorId) => {
		// Toggle the selected state of the doctor
		setSelectedDoctors((prevSelected) => {
			if (prevSelected.includes(doctorId)) {
				return prevSelected.filter((id) => id !== doctorId);
			} else {
				return [...prevSelected, doctorId];
			}
		});
	};

	const handleDeleteAppointments = async () => {
		try {
			const response = await axios.delete(
				"http://localhost:5000/admin/appointments",
				{
					data: { appointmentIds: selectedAppointments },
				}
			);

			if (response.data.success) {
				alert("Appointments deleted successfully!");
				// Clear the selected appointments and fetch the updated list
				setSelectedAppointments([]);
				fetchAppointments();
			} else {
				alert("Error deleting appointments. Please try again.");
			}
		} catch (error) {
			console.error("Error deleting appointments:", error);
		}
	};

	const handleDeleteSelectedDoctors = async () => {
		try {
			const response = await axios.delete(
				"http://localhost:5000/admin/doctors",
				{
					data: { doctorIds: selectedDoctors },
				}
			);

			if (response.data.success) {
				alert("Selected doctors deleted successfully!");
				fetchDoctors(); // Fetch doctors again after deletion
				setSelectedDoctors([]); // Clear the selected doctors
			} else {
				alert("Error deleting doctors. Please try again.");
			}
		} catch (error) {
			console.error("Error deleting doctors:", error);
		}
	};

	const fetchAllDoctors = async () => {
		try {
			const response = await axios.get(
				"http://localhost:5000/admin/all-doctors"
			);
			setAllDoctors(response.data);
		} catch (error) {
			console.error("Error fetching all doctors:", error);
		}
	};

	const fetchDoctors = async () => {
		try {
			const response = await axios.get(
				"http://localhost:5000/admin/doctors"
			);
			setDoctors(response.data);
		} catch (error) {
			console.error("Error fetching doctors:", error);
		}
	};

	const fetchAppointments = async () => {
		try {
			const response = await axios.get(
				"http://localhost:5000/admin/appointments",
				{
					params: { doctor: selectedDoctor },
				}
			);
			setAppointments(response.data);
		} catch (error) {
			console.error("Error fetching appointments:", error);
		}
	};
	useEffect(() => {
		fetchDoctors();
		fetchAppointments(); // Fetch appointments after fetching doctors
		fetchAllDoctors();
	}, [selectedDoctor]);

	return (
		<Container className="container">
			{authenticated ? (
				<div className="form-container">
					<h2 className="form-header">Add Doctor</h2>
					<Form>
						<Form.Group
							controlId="formFullName"
							className="form-group"
						>
							<Form.Label>Full Name</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter full name"
								value={newDoctor.full_name}
								onChange={(e) =>
									setNewDoctor({
										...newDoctor,
										full_name: e.target.value,
									})
								}
							/>
						</Form.Group>

						<Form.Group
							controlId="formSpecialization"
							className="form-group"
						>
							<Form.Label>Specialization</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter specialization"
								value={newDoctor.specialization}
								onChange={(e) =>
									setNewDoctor({
										...newDoctor,
										specialization: e.target.value,
									})
								}
							/>
						</Form.Group>
						<Button variant="primary" onClick={handleAddDoctor}>
							Add Doctor
						</Button>
					</Form>
					<div className="form-divider"></div>
					<h2 className="form-header">All Doctors</h2>

					<Table striped bordered hover>
						<thead>{/* ... (your table header) */}</thead>
						<tbody>
							{allDoctors.map((doctor) => (
								<tr key={doctor.doctor_id}>
									<td>
										<input
											type="checkbox"
											checked={selectedDoctors.includes(
												doctor.doctor_id
											)}
											onChange={() =>
												handleSelectDoctor(
													doctor.doctor_id
												)
											}
										/>
									</td>
									<td>{doctor.doctor_id}</td>
									<td>{doctor.full_name}</td>
									<td>{doctor.specialization}</td>
								</tr>
							))}
						</tbody>
						<tfoot>
							<tr></tr>
						</tfoot>
					</Table>
					<Button
						variant="danger"
						onClick={handleDeleteSelectedDoctors}
						disabled={selectedDoctors.length === 0}
						className="mx-auto d-block"
					>
						Delete Selected
					</Button>
					<div className="form-divider"></div>
					<h2 className="form-header">Appointments</h2>
					<Form>
						<Form.Group
							controlId="formDoctor"
							className="form-group"
						>
							<Form.Label>Doctor</Form.Label>
							<Form.Control
								as="select"
								value={selectedDoctor}
								onChange={(e) =>
									setSelectedDoctor(e.target.value)
								}
							>
								<option value="">All Doctors</option>
								{doctors.map((doctor) => (
									<option
										key={doctor.doctor_id}
										value={doctor.doctor_id}
									>
										{doctor.full_name} -{" "}
										{doctor.specialization}
									</option>
								))}
							</Form.Control>
						</Form.Group>
					</Form>

					<Table striped bordered hover>
						<thead>
							<tr>
								<th>Select</th>
								<th>Appointment ID</th>
								<th>First Name</th>
								<th>Last Name</th>
								<th>Doctor</th>
								<th>Date</th>
								<th>Time</th>
							</tr>
						</thead>
						<tbody>
							{appointments.map((appointment) => (
								<tr key={appointment.appointment_id}>
									<td>
										<input
											type="checkbox"
											checked={selectedAppointments.includes(
												appointment.appointment_id
											)}
											onChange={() =>
												handleSelectAppointment(
													appointment.appointment_id
												)
											}
										/>
									</td>
									<td>{appointment.appointment_id}</td>
									<td>{appointment.first_name}</td>
									<td>{appointment.last_name}</td>
									<td>{appointment.doctor_full_name}</td>
									<td>
										{new Date(
											appointment.appointment_date
										).toLocaleDateString("en-US")}
									</td>
									<td>{appointment.appointment_time}</td>
								</tr>
							))}
						</tbody>
					</Table>

					{/* Button to delete selected appointments */}
					<Button
						variant="danger"
						onClick={handleDeleteAppointments}
						disabled={selectedAppointments.length === 0}
					>
						Delete Selected
					</Button>
				</div>
			) : (
				<div className="form-container">
					<h2 className="form-header">Admin Panel Login</h2>
					<Form>
						<Form.Group
							controlId="formUsername"
							className="form-group"
						>
							<Form.Label>Username:</Form.Label>
							<Form.Control
								type="text"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
						</Form.Group>
						<Form.Group
							controlId="formPassword"
							className="form-group"
						>
							<Form.Label>Password:</Form.Label>
							<Form.Control
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</Form.Group>
						<Button variant="primary" onClick={handleLogin}>
							Login
						</Button>
					</Form>
					{loginError && <p className="login-error">{loginError}</p>}
				</div>
			)}
		</Container>
	);
};

export default AdminPanel;
