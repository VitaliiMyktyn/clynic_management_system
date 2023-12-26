// NavbarComponent.jsx
import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaHospital, FaUserCog } from "react-icons/fa"; // Import the hospital and user cog icons
import "./NavbarComponent.css";

const NavbarComponent = () => {
	return (
		<Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
			<Container>
				<Navbar.Brand as={Link} to="/">
					<FaHospital className="navbar-brand-img" size={30} />
					Polyclinic Information and Reference System
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav className="ml-auto">
						<Nav.Link as={Link} to="/departments">
							Departments
						</Nav.Link>
						<Nav.Link as={Link} to="/services">
							Services
						</Nav.Link>
						<Nav.Link as={Link} to="/contact">
							Contact Us
						</Nav.Link>
						<Nav.Link as={Link} to="/admin/dashboard">
							<FaUserCog className="admin-icon" />
						</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

export default NavbarComponent;
