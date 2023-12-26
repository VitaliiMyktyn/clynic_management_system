import React, { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import {
	FaFacebookF,
	FaInstagram,
	FaTwitter,
	FaGooglePlusG,
} from "react-icons/fa";
import "./Footer.css"; // Create this CSS file for additional styling

const Footer = () => {
	const [email, setEmail] = useState("");

	const handleEmailChange = (e) => {
		setEmail(e.target.value);
	};

	const handleSubscribe = (e) => {
		e.preventDefault();
		// You can handle the subscription logic here, e.g., send the email to your backend or integrate with a third-party service
		console.log("Email Subscribed: ", email);
		// Clear the input field after submission
		setEmail("");
		// Display an alert for successful subscription
		alert("Subscription successful!");
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			handleSubscribe(e);
		}
	};

	return (
		<footer className="text-white text-center text-lg-start bg-primary">
			<Container className="p-4">
				<Row className="mt-4">
					<Col lg={4} md={12} className="mb-4 mb-md-0">
						<h5 className="text-uppercase mb-4">
							About Our Polyclinic
						</h5>
						<p>
							We are a medical facility based in Ivano-Frankivsk,
							Ukraine, dedicated to providing high-quality
							healthcare services.
						</p>
						<p>
							Our diverse range of services ensures that our
							clients receive excellent medical care and a great
							overall experience.
						</p>

						<div className="mt-4 social-icons">
							{/* Replace '#' with the actual links */}
							<a
								href="#"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Facebook"
							>
								<FaFacebookF />
							</a>
							<a
								href="#"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Instagram"
							>
								<FaInstagram />
							</a>
							<a
								href="#"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Twitter"
							>
								<FaTwitter />
							</a>
							<a
								href="#"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Google Plus"
							>
								<FaGooglePlusG />
							</a>
						</div>
					</Col>

					<Col lg={4} md={6} className="mb-4 mb-md-0">
						<h5 className="text-uppercase mb-4">
							Subscribe to Updates
						</h5>
						<Form className="mb-4" onSubmit={handleSubscribe}>
							<Form.Control
								type="email"
								placeholder="Your email"
								value={email}
								onChange={handleEmailChange}
								onKeyPress={handleKeyPress}
							/>
						</Form>
						<ul className="fa-ul" style={{ marginLeft: "1.65em" }}>
							<li className="mb-3">
								<span className="fa-li">
									<i className="fas fa-home"></i>
								</span>
								<span className="ms-2">
									- Ivano-Frankivsk, Ukraine
								</span>
							</li>
							<li className="mb-3">
								<span className="fa-li">
									<i className="fas fa-envelope"></i>
								</span>
								<span className="ms-2">
									- info@ourpolyclinic.com
								</span>
							</li>
							<li className="mb-3">
								<span className="fa-li">
									<i className="fas fa-phone"></i>
								</span>
								<span className="ms-2">+380 50 123 4567</span>
							</li>
						</ul>
					</Col>

					<Col lg={4} md={6} className="mb-4 mb-md-0">
						<h5 className="text-uppercase mb-4">Opening Hours</h5>
						<table className="table text-center text-white">
							<tbody className="font-weight-normal">
								<tr>
									<td>Mon - Fri:</td>
									<td>9am - 6pm</td>
								</tr>
								<tr>
									<td>Sat - Sun:</td>
									<td>Closed</td>
								</tr>
							</tbody>
						</table>
					</Col>
				</Row>
			</Container>

			<div
				className="text-center p-3"
				style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
			>
				© 2023 Vitalii Mykytyn. All rights reserved.
			</div>
		</footer>
	);
};

export default Footer;
