import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import {
	FaCalendarAlt,
	FaHospital,
	FaMedkit,
	FaStethoscope,
} from "react-icons/fa";
import "./Departaments.css"; // Import your CSS file for additional styling

const Department = () => {
	const renderDepartmentContent = (
		icon,
		title,
		description,
		specialties = []
	) => (
		<Card className="mb-4 department-card">
			<Card.Header as="h4" className="department-card-header">
				{icon} {title}
			</Card.Header>
			<Card.Body>
				<Card.Text className="department-description">
					{description}
				</Card.Text>
				{specialties.length > 0 && (
					<div>
						<h5 className="department-subheading">Specialties:</h5>
						<ul className="department-list">
							{specialties.map((specialty, index) => (
								<li key={index}>{specialty}</li>
							))}
						</ul>
					</div>
				)}
			</Card.Body>
		</Card>
	);

	return (
		<Container className="my-3">
			<h2 className="text-center mb-4 heading-text">
				Explore Our Medical Departments
			</h2>

			<Row>
				<Col md={6}>
					{renderDepartmentContent(
						<FaCalendarAlt />,
						"Online Booking",
						"Say goodbye to waiting in lines. Our interactive platform allows you to easily book appointments with any specialist at your convenience. Just select the doctor, pick a date, and choose a time – your appointment is set.",
						[
							"Streamlined Process",
							"Flexible Scheduling",
							"Instant Confirmation",
						]
					)}
				</Col>

				<Col md={6}>
					{renderDepartmentContent(
						<FaHospital />,
						"Specialized Departments",
						"Our experts work in various specialized departments to provide comprehensive and personalized care. Join any department according to your health condition.",
						[
							"Cardiology",
							"Neurology",
							"Gynecology",
							"Pediatrics",
							"Other Specialties",
						]
					)}
				</Col>
			</Row>

			<Row>
				<Col md={6}>
					{renderDepartmentContent(
						<FaMedkit />,
						"Medical Programs and Checkups",
						"We offer various medical programs and checkups for prevention and early detection of diseases. Explore our examination packages and take advantage of systematic medical checkups."
					)}
				</Col>

				<Col md={6}>
					{renderDepartmentContent(
						<FaStethoscope />,
						"Modern Equipment",
						"Our departments are equipped with advanced medical technologies for accurate and quick diagnosis and effective treatment. We are committed to your health and use only the best equipment."
					)}
				</Col>
			</Row>

			<Row className="mb-5">
				<Col md={12}>
					{renderDepartmentContent(
						<FaStethoscope />,
						"Experienced Medical Team",
						"Our team of doctors consists of experienced and highly qualified specialists ready to provide you with professional medical care and support at every stage of treatment."
					)}
				</Col>
			</Row>
		</Container>
	);
};

export default Department;
