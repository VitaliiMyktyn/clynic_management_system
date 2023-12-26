// ServicesComponent.js
import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ServicesComponent.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import RegistrationComponent from "../registration-component/RegistrationComponent"; // Import the RegistrationComponent
import services from "../assets/services";

function ServicesComponent() {
	const sliderSettings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 3,
		slidesToScroll: 1,
		responsive: [
			{
				breakpoint: 992,
				settings: {
					slidesToShow: 2,
				},
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 1,
				},
			},
		],
	};

	return (
		<div className="services-container">
			<div className="container">
				<div className="services-heading">
					<h1 className="heading-text">Our Services</h1>
					<p className="services-subheading">
						Comprehensive Healthcare Services
					</p>
				</div>
				<Slider {...sliderSettings}>
					{services.map((service) => (
						<div key={service.id}>
							<div className="service-card">
								<FontAwesomeIcon
									icon={service.icon}
									className="service-icon"
								/>
								<h3 className="service-title">
									{service.title}
								</h3>
								<p className="service-description">
									{service.description}
								</p>
								<Link to={`/services/${service.id}`}>
									<button className="btn btn-primary">
										Learn More
									</button>
								</Link>
							</div>
						</div>
					))}
				</Slider>
				<div style={{ paddingTop: "20px" }}>
					<RegistrationComponent />
				</div>
			</div>
		</div>
	);
}

export default ServicesComponent;
