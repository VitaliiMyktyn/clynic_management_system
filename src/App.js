// Import necessary components
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import AdminPanel from "./components/admin-panel/AdminPanel";
import Home from "./components/home-component/Home";
import NavbarComponent from "./components/menu/NavbarComponent";
import ContactUS from "./components/contact-us/ContactUS";
import Departaments from "./components/departaments/Departaments";
import ServicesComponent from "./components/services-component/ServicesComponent";
import RegistrationComponent from "./components/registration-component/RegistrationComponent";
import Footer from "./components/footer/Footer";
import services from "./components/assets/services";
import ServicesDescription from "./components/services-desctiption/ServicesDescription";

function App() {
	return (
		<div className="App">
			<NavbarComponent />
			<Routes>
				<Route
					path="/"
					element={
						<>
							<Home />
							<RegistrationComponent />
						</>
					}
				/>

				<Route path="/admin/dashboard" element={<AdminPanel />} />
				<Route path="/admin-panel" element={<AdminPanel />} />
				<Route path="/departments" element={<Departaments />} />
				<Route path="/services" element={<ServicesComponent />} />

				{/* Add the dynamic route for service details */}
				<Route
					path="/services/:id"
					element={<ServicesDescription services={services} />}
				/>

				<Route
					path="/departaments/:id"
					element={<ServicesDescription services={services} />}
				/>
				<Route path="/contact" element={<ContactUS />} />
			</Routes>
			<Footer />
		</div>
	);
}

export default App;
