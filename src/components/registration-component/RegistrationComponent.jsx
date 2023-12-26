import React, { useState, useEffect, useCallback } from "react";
import { Form, Button, Row, Col, Modal, Alert } from "react-bootstrap";
import axios from "axios";
import "./RegistrationComponent.css";

const RegistrationComponent = ({ onRegistration }) => {
	const [patientData, setPatientData] = useState({
		first_name: "",
		last_name: "",
		middle_name: "",
		date_of_birth: "",
		address: "",
		email_address: "",
		insurance_number: "",
		phone_number: "",
		doctor_id: "",
		appointment_date: "",
		appointment_time: "",
	});

	const [doctors, setDoctors] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [loadingDoctors, setLoadingDoctors] = useState(true);
	const [loadingSubmit, setLoadingSubmit] = useState(false);
	const [errorSubmit, setErrorSubmit] = useState(null);
	const [successMessage, setSuccessMessage] = useState(null);
	const [selectedDoctor, setSelectedDoctor] = useState("");
	const [availableTimes, setAvailableTimes] = useState([]);
	const [formErrors, setFormErrors] = useState({
		first_name: "",
		last_name: "",
		date_of_birth: "",
		address: "",
		email_address: "",
		insurance_number: "",
		phone_number: "",
		doctor_id: "",
		appointment_date: "",
		appointment_time: "",
	});

	const apiUrl = process.env.REACT_APP_API_URL;
	const apiEndpoint = process.env.REACT_APP_API_ENDPOINT;

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setPatientData((prevData) => ({
			...prevData,
			[name]: value,
		}));
		// Clear the error when the user starts typing in the email field
		setFormErrors((prevErrors) => ({
			...prevErrors,
			email: "",
		}));
	};

	const getMinDateOfBirth = () => {
		const minAllowedDate = new Date("2010-01-01");
		return minAllowedDate.toISOString().split("T")[0];
	};

	const getMaxDateOfBirth = () => {
		const maxAllowedDate = new Date("1920-12-31");
		return maxAllowedDate.toISOString().split("T")[0];
	};

	const handleTimeSelect = (e) => {
		const appointmentTime = e.target.value;
		setPatientData((prevData) => ({
			...prevData,
			appointment_time: appointmentTime,
		}));
	};

	const handleDoctorSelect = (e) => {
		const doctorId = e.target.value;
		setSelectedDoctor(doctorId); // Remember the selected doctor
		setPatientData((prevData) => ({ ...prevData, doctor_id: doctorId }));
	};

	const handleDateSelect = async (e) => {
		const selectedDate = e.target.value;
		const dayOfWeek = new Date(selectedDate).getDay();

		if (dayOfWeek === 0 || dayOfWeek === 6) {
			alert("Weekends are not available for appointments.");
			return;
		}

		setPatientData((prevData) => ({
			...prevData,
			appointment_date: selectedDate,
		}));

		// Get available times for the selected doctor and date
		try {
			const response = await axios.get(
				`http://localhost:5000/api/appointments/availableTimes?doctor_id=${selectedDoctor}&date=${selectedDate}`
			);
			const availableTimes = response.data;
			setPatientData((prevData) => ({
				...prevData,
				appointment_time: availableTimes[0] || "",
			}));
		} catch (error) {
			console.error("Error fetching available times:", error);
		}
	};

	const handleRegistration = () => {
		if (!validateForm()) {
			return;
		}

		setLoadingSubmit(true);

		axios
			.post("http://localhost:5000/api/appointments", patientData, {
				headers: {
					"Content-Type": "application/json",
				},
			})
			.then((response) => {
				const data = response.data;
				if (data.success) {
					setSuccessMessage("Appointment registration successful!");
					setShowModal(false);
					// Additional actions on successful registration
				} else {
					setErrorSubmit(data.error);
				}
			})
			.catch((error) => {
				console.error("Error:", error);
				setErrorSubmit("An error occurred during registration.");
			})
			.finally(() => {
				setLoadingSubmit(false);
			});
	};

	const fetchDoctors = () => {
		setLoadingDoctors(true);
		axios
			.get("http://localhost:5000/api/doctors")
			.then((response) => {
				setDoctors(response.data);
			})
			.catch((error) => {
				console.error("Error fetching doctors:", error);
			})
			.finally(() => {
				setLoadingDoctors(false);
			});
	};

	useEffect(() => {
		fetchDoctors();
	}, []);

	const generateTimes = (startTime, endTime, interval) => {
		const times = [];
		let currentTime = new Date(`1970-01-01T${startTime}Z`);

		const endTimeUTC = new Date(`1970-01-01T${endTime}Z`);

		while (currentTime <= endTimeUTC) {
			const hours = currentTime.getUTCHours().toString().padStart(2, "0");
			const minutes = currentTime
				.getUTCMinutes()
				.toString()
				.padStart(2, "0");
			const seconds = currentTime
				.getUTCSeconds()
				.toString()
				.padStart(2, "0");

			times.push(`${hours}:${minutes}:${seconds}`);
			currentTime.setUTCMinutes(currentTime.getUTCMinutes() + interval);
		}

		return times;
	};

	const fetchAvailableTimes = useCallback(async () => {
		if (selectedDoctor && patientData.appointment_date) {
			try {
				const response = await axios.get(
					`http://localhost:5000/api/appointments/availableTimes?doctor_id=${selectedDoctor}&date=${patientData.appointment_date}`
				);
				const bookedTimes = response.data;
				const allTimes = generateTimes("09:00:00", "17:30:00", 30);
				const availableTimes = allTimes.filter(
					(time) => !bookedTimes.includes(time)
				);
				setAvailableTimes(availableTimes);
			} catch (error) {
				console.error("Error fetching available times:", error);
			}
		}
	}, [selectedDoctor, patientData.appointment_date]);

	useEffect(() => {
		const fetchData = async () => {
			await fetchAvailableTimes();
		};

		fetchData();
	}, [fetchAvailableTimes, selectedDoctor, patientData.appointment_date]);

	useEffect(() => {
		fetchAvailableTimes(); // Initial fetch
	}, [fetchAvailableTimes, selectedDoctor, patientData.appointment_date]);

	const getMinDate = () => {
		const today = new Date();
		let daysToAdd = 1;
		if (today.getDay() === 0) {
			daysToAdd = daysToAdd + 1;
		}
		while (today.getDay() === 6 || today.getDay() === 0) {
			today.setDate(today.getDate() + 1);
		}
		today.setDate(today.getDate() + daysToAdd);
		return today.toISOString().split("T")[0];
	};

	const getMaxDate = () => {
		const today = new Date();
		let daysToAdd = 1;
		if (today.getDay() === 0) {
			daysToAdd = daysToAdd + 1;
		}
		while (today.getDay() === 6 || today.getDay() === 0) {
			today.setDate(today.getDate() + 1);
		}
		daysToAdd = daysToAdd + (12 - today.getDay());
		today.setDate(today.getDate() + daysToAdd);
		return today.toISOString().split("T")[0];
	};

	const validateForm = () => {
		const errors = {};

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (
			!patientData.email_address ||
			!emailRegex.test(patientData.email_address)
		) {
			errors.email = "Please enter a valid email address.";
		}

		// Validate date of birth

		if (!patientData.address) {
			errors.address = "Address is required.";
		}

		// Validate other fields
		for (const key in patientData) {
			if (
				patientData[key] === "" &&
				key !== "middle_name" &&
				key !== "email"
			) {
				errors[key] = `${key.replace("_", " ")} is required.`;
			}
		}

		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	};

	return (
		<div className="registration-container">
			<h2 className="registration-title">NEW PATIENT REGISTRATION</h2>
			{loadingDoctors ? (
				<p>Loading doctors...</p>
			) : (
				<Form className="registration-form">
					<Row>
						<Col md={6}>
							<Form.Group controlId="formFirstName">
								<Form.Label>First Name:</Form.Label>
								<Form.Control
									type="text"
									name="first_name"
									value={patientData.first_name}
									onChange={handleInputChange}
									placeholder="Enter your first name"
									isInvalid={!!formErrors.first_name}
								/>
								<Form.Control.Feedback type="invalid">
									{formErrors.first_name}
								</Form.Control.Feedback>
							</Form.Group>
						</Col>

						<Col md={6}>
							<Form.Group controlId="formLastName">
								<Form.Label>Last Name:</Form.Label>
								<Form.Control
									type="text"
									name="last_name"
									value={patientData.last_name}
									onChange={handleInputChange}
									placeholder="Enter your last name"
									isInvalid={!!formErrors.last_name}
								/>
								<Form.Control.Feedback type="invalid">
									{formErrors.last_name}
								</Form.Control.Feedback>
							</Form.Group>
						</Col>
					</Row>

					<Row>
						<Col md={6}>
							<Form.Group controlId="formMiddleName">
								<Form.Label>Middle Name:</Form.Label>
								<Form.Control
									type="text"
									name="middle_name"
									value={patientData.middle_name}
									onChange={handleInputChange}
									placeholder="Enter your middle name"
								/>
							</Form.Group>
						</Col>

						<Col md={6}>
							<Form.Group controlId="formDateOfBirth">
								<Form.Label>Date of Birth:</Form.Label>
								<Form.Control
									type="date"
									name="date_of_birth"
									value={patientData.date_of_birth}
									onChange={handleInputChange}
									min={getMaxDateOfBirth()} // Set the minimum date allowed
									max={getMinDateOfBirth()}
									isInvalid={!!formErrors.date_of_birth}
									placeholder="Select your date of birth"
								/>
								<Form.Control.Feedback type="invalid">
									{formErrors.date_of_birth}
								</Form.Control.Feedback>
							</Form.Group>
						</Col>
					</Row>

					<Row>
						<Col md={6}>
							<Form.Group controlId="formEmail">
								<Form.Label>Email:</Form.Label>
								<Form.Control
									type="email"
									name="email_address"
									value={patientData.email_address}
									onChange={handleInputChange}
									placeholder="Enter your email address"
									isInvalid={!!formErrors.email}
								/>
								<Form.Control.Feedback type="invalid">
									{formErrors.email}
								</Form.Control.Feedback>
							</Form.Group>
						</Col>

						<Col md={6}>
							<Form.Group controlId="formPhoneNumber">
								<Form.Label>Phone Number:</Form.Label>
								<Form.Control
									type="text"
									name="phone_number"
									value={patientData.phone_number}
									onChange={handleInputChange}
									isInvalid={!!formErrors.phone_number}
									placeholder="Enter your phone number"
								/>
								<Form.Control.Feedback type="invalid">
									{formErrors.phone_number}
								</Form.Control.Feedback>
							</Form.Group>
						</Col>
					</Row>
					<Row>
						<Col md={6}>
							<Form.Group controlId="formInsuranceNumber">
								<Form.Label>Insurance Number:</Form.Label>
								<Form.Control
									type="text"
									name="insurance_number"
									value={patientData.insurance_number}
									onChange={handleInputChange}
									isInvalid={!!formErrors.insurance_number}
									placeholder="Enter your insurence number"
								/>
								<Form.Control.Feedback type="invalid">
									{formErrors.insurance_number}
								</Form.Control.Feedback>
							</Form.Group>
						</Col>
						<Col md={6}>
							<Form.Group controlId="formAddress">
								<Form.Label>Address:</Form.Label>
								<Form.Control
									type="text"
									name="address"
									value={patientData.address}
									onChange={handleInputChange}
									placeholder="Enter your address"
								/>
							</Form.Group>
						</Col>
					</Row>
					<Row>
						<Col md={6}>
							<Form.Group controlId="formDoctor">
								<Form.Label>Doctor:</Form.Label>
								<Form.Control
									as="select"
									name="doctor_id"
									value={patientData.doctor_id}
									onChange={handleDoctorSelect}
									isInvalid={!!formErrors.doctor_id}
								>
									<option value="" disabled>
										Select a doctor
									</option>
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
								<Form.Control.Feedback type="invalid">
									{formErrors.doctor_id}
								</Form.Control.Feedback>
							</Form.Group>
						</Col>
						<Col md={6}>
							<Form.Group controlId="formAppointmentDate">
								<Form.Label>Appointment Date:</Form.Label>
								<Form.Control
									type="date"
									name="appointment_date"
									value={patientData.appointment_date}
									onChange={handleDateSelect}
									min={getMinDate()}
									max={getMaxDate()}
									isInvalid={!!formErrors.appointment_date}
								/>
								<Form.Control.Feedback type="invalid">
									{formErrors.appointment_date}
								</Form.Control.Feedback>
							</Form.Group>
						</Col>
						<Col md={6}>
							<Form.Group controlId="formAppointmentTime">
								<Form.Label>Appointment Time:</Form.Label>
								<Form.Control
									as="select"
									name="appointment_time"
									onChange={handleTimeSelect}
									isInvalid={!!formErrors.appointment_time}
								>
									<option value="">Select a time</option>
									{availableTimes.map((time) => (
										<option key={time} value={time}>
											{time}
										</option>
									))}
								</Form.Control>
								<Form.Control.Feedback type="invalid">
									{formErrors.appointment_time}
								</Form.Control.Feedback>
							</Form.Group>
						</Col>
					</Row>
					<Button
						variant="primary"
						type="button"
						onClick={() => setShowModal(true)}
						disabled={loadingSubmit}
					>
						Register for Appointment
					</Button>

					{loadingSubmit && <p>Submitting appointment...</p>}
					{errorSubmit && (
						<Alert variant="danger">{errorSubmit}</Alert>
					)}
					{successMessage && (
						<Alert variant="success">{successMessage}</Alert>
					)}

					<Modal show={showModal} onHide={() => setShowModal(false)}>
						<Modal.Header closeButton>
							<Modal.Title>Appointment Confirmation</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<p>
								Are you sure you want to register for an
								appointment?
							</p>
						</Modal.Body>
						<Modal.Footer>
							<Button
								variant="secondary"
								onClick={() => setShowModal(false)}
							>
								Cancel
							</Button>
							<Button
								variant="primary"
								onClick={handleRegistration}
							>
								Register
							</Button>
						</Modal.Footer>
					</Modal>
				</Form>
			)}
		</div>
	);
};

export default RegistrationComponent;
