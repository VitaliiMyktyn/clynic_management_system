import {
	faStethoscope,
	faHeartbeat,
	faFemale,
	faChild,
	faBone,
} from "@fortawesome/free-solid-svg-icons";
const services = [
	{
		id: 1,
		title: "General Medicine",
		description:
			"Our dedicated team of general practitioners ensures that your primary healthcare needs are met with expertise and compassion. From routine checkups to managing chronic conditions, we are here for you.",
		icon: faStethoscope,
	},
	{
		id: 2,
		title: "Cardiology",
		description:
			"Cutting-edge heart care for a healthy cardiovascular system.",
		icon: faHeartbeat,
	},
	{
		id: 3,
		title: "Gynecology",
		description:
			"Women's health services, including checkups and consultations.",
		icon: faFemale,
	},
	{
		id: 4,
		title: "Pediatrics",
		description:
			"Specialized care for the youngest members of your family.",
		icon: faChild,
	},
	{
		id: 5,
		title: "Orthopedics",
		description: "Comprehensive solutions for musculoskeletal health.",
		icon: faBone,
	},
];

export default services;
