// Home.jsx
import React from "react";
import { Container, Button } from "react-bootstrap";
import "./Home.css"; // Import your CSS styles
import backgroundImage from "../assets/healthcareBG.png"; // Import your background image

const Home = () => {
	return (
		<div
			className="home-container"
			style={{ backgroundImage: `url(${backgroundImage})` }}
		>
			<Container className="content-container">
				<div className="text-section">
					<h1>
						Welcome to the Polyclinic Information and Consultation
						System
					</h1>
					<p>
						Your one-stop services for all your healthcare needs. We
						provide comprehensive information about departments,
						doctors, and services, along with the convenience of
						online appointment scheduling.
					</p>
					<Button variant="primary" href="/contact">
						Contact Us
					</Button>
				</div>
			</Container>
		</div>
	);
};

export default Home;
