// ServiceDescription.js
import React from "react";
import { useParams } from "react-router-dom";

const ServicesDescription = ({ services }) => {
	const { id } = useParams();
	const service = services.find((s) => s.id === parseInt(id, 10));

	if (!service) {
		return <div>Service not found</div>;
	}

	return (
		<div>
			<h1>{service.title}</h1>
			<p>{service.description}</p>
			{/* Add any additional information you want to display here */}
		</div>
	);
};

export default ServicesDescription;
