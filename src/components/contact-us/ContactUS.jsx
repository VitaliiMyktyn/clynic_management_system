import React, { useState } from "react";
import { FiMail, FiMapPin, FiSend } from "react-icons/fi";
import { MdEmail } from "react-icons/md";
import axios from "axios";
import "./ContactUs.css";

// via link https://formspree.io/forms/xzblnabz/submissions

const ContactUs = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			// Make a POST request to Formspree
			const response = await axios.post(
				"https://formspree.io/f/xzblnabz",
				formData,
				{ headers: { "Content-Type": "application/json" } }
			);

			// Handle the response as needed
			console.log("Formspree Response: ", response.data);
		} catch (error) {
			// Handle errors here
			console.error("Error submitting form: ", error);
		}
	};

	return (
		<section className="contact-section">
			<div className="contact-container">
				<div className="contact-form">
					<h3 className="form-heading">Get in Touch</h3>
					<form onSubmit={handleSubmit}>
						<div className="form-group">
							<label className="form-label" htmlFor="name">
								<FiMapPin className="form-icon" />
								Full Name
							</label>
							<input
								type="text"
								name="name"
								placeholder="Your Name"
								value={formData.name}
								onChange={handleInputChange}
								className="form-input"
							/>
						</div>

						<div className="form-group">
							<label className="form-label" htmlFor="email">
								<MdEmail className="form-icon" />
								Email Address
							</label>
							<input
								type="email"
								name="email"
								placeholder="Your Email"
								value={formData.email}
								onChange={handleInputChange}
								className="form-input"
							/>
						</div>

						<div className="form-group">
							<label className="form-label" htmlFor="subject">
								<FiMail className="form-icon" />
								Subject
							</label>
							<input
								type="text"
								name="subject"
								placeholder="Subject"
								value={formData.subject}
								onChange={handleInputChange}
								className="form-input"
							/>
						</div>

						<div className="form-group">
							<label className="form-label" htmlFor="message">
								<FiMail className="form-icon" />
								Message
							</label>
							<textarea
								name="message"
								rows={4}
								placeholder="Your Message"
								value={formData.message}
								onChange={handleInputChange}
								className="form-input"
							></textarea>
						</div>

						<div className="form-group">
							<button type="submit" className="submit-btn">
								<FiSend className="form-icon" />
								Send Message
							</button>
						</div>
					</form>
				</div>
			</div>
		</section>
	);
};

export default ContactUs;
